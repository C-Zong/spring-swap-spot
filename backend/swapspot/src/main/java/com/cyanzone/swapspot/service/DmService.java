package com.cyanzone.swapspot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cyanzone.swapspot.dto.DmMessageRow;
import com.cyanzone.swapspot.dto.DmThreadRow;
import com.cyanzone.swapspot.entity.DmMessage;
import com.cyanzone.swapspot.entity.DmThread;
import com.cyanzone.swapspot.entity.DmThreadUserState;
import com.cyanzone.swapspot.exception.BusinessException;
import com.cyanzone.swapspot.mapper.DmMessageMapper;
import com.cyanzone.swapspot.mapper.DmStateMapper;
import com.cyanzone.swapspot.mapper.DmThreadMapper;
import com.cyanzone.swapspot.mapper.DmThreadQueryMapper;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DmService {

    private final DmThreadMapper threadMapper;
    private final DmMessageMapper messageMapper;
    private final DmStateMapper stateMapper;
    private final DmThreadQueryMapper queryMapper;
    private final StringRedisTemplate redis;
    private final CurrentUserService currentUser;
    private final HashOperations<String, String, String> hashOps;
    private final S3Service s3Service;


    public DmService(DmThreadMapper threadMapper,
                     DmMessageMapper messageMapper,
                     DmStateMapper stateMapper,
                     DmThreadQueryMapper queryMapper,
                     StringRedisTemplate redis,
                     CurrentUserService currentUser,
                     S3Service s3Service) {
        this.threadMapper = threadMapper;
        this.messageMapper = messageMapper;
        this.stateMapper = stateMapper;
        this.queryMapper = queryMapper;
        this.redis = redis;
        this.currentUser = currentUser;
        this.hashOps = redis.opsForHash();
        this.s3Service = s3Service;
    }

    private String readKey(Integer uid) {
        return "msg:read:" + uid;
    }

    public String getOrCreateThread(Integer otherId) {
        Integer me = currentUser.requireUserId();
        int a = Math.min(me, otherId);
        int b = Math.max(me, otherId);

        DmThread existing = threadMapper.selectOne(
                new LambdaQueryWrapper<DmThread>()
                        .eq(DmThread::getAId, a)
                        .eq(DmThread::getBId, b)
        );
        if (existing != null) {
            ensureState(existing.getId(), me);
            ensureState(existing.getId(), otherId);
            unhide(existing.getId(), me);
            return String.valueOf(existing.getId());
        }

        DmThread t = new DmThread();
        t.setAId(a);
        t.setBId(b);
        threadMapper.insert(t);

        ensureState(t.getId(), me);
        ensureState(t.getId(), otherId);
        return String.valueOf(t.getId());
    }

    private void ensureState(Long threadId, Integer uid) {
        DmThreadUserState s = getState(threadId, uid);
        if (s != null) return;

        DmThreadUserState ns = new DmThreadUserState();
        ns.setThreadId(threadId);
        ns.setUserId(uid);
        ns.setClearedBeforeMsgId(0L);
        ns.setIsHidden(false);
        stateMapper.insert(ns);
    }


    public List<DmThreadRow> listThreads() {
        Integer me = currentUser.requireUserId();
        List<DmThreadRow> rows = queryMapper.listThreads(me);

        if (!rows.isEmpty()) {
            List<String> fields = rows.stream().map(r -> String.valueOf(r.getThreadId())).toList();
            List<String> vals = hashOps.multiGet(readKey(me), fields);

            for (int i = 0; i < rows.size(); i++) {
                String v = (vals.get(i) != null) ? vals.get(i) : "0";
                long lastRead = 0;
                try {
                    lastRead = Long.parseLong(v);
                } catch (Exception ignored) {
                }
                rows.get(i).setUnreadDot(rows.get(i).getLatestMsgId() != null && rows.get(i).getLatestMsgId() > lastRead);
                rows.get(i).setOtherAvatarUrl(s3Service.presignGetUrl(rows.get(i).getOtherAvatarUrl()));
            }
        }
        return rows;
    }

    public List<DmMessageRow> listMessages(Long threadId, Long beforeId, int limit) {
        Integer me = currentUser.requireUserId();
        assertInThread(threadId, me);

        Long clearedBefore = getClearedBefore(threadId, me);
        List<DmMessageRow> dmr = queryMapper.listMessages(threadId, clearedBefore, beforeId, Math.min(limit, 50));
        dmr.forEach(r -> r.setIsMe(r.getSenderId().equals(me)));
        return dmr;
    }

    public String send(Long threadId, String contentJson, String clientMsgId) {
        Integer me = currentUser.requireUserId();
        assertInThread(threadId, me);

        DmMessage m = new DmMessage();
        m.setThreadId(threadId);
        m.setSenderId(me);
        m.setContentJson(contentJson);
        m.setClientMsgId(clientMsgId);
        messageMapper.insert(m);

        hashOps.put(readKey(me), String.valueOf(threadId), String.valueOf(m.getId()));
        return String.valueOf(m.getId());
    }

    public void markRead(Long threadId, Long lastMsgId) {
        Integer me = currentUser.requireUserId();
        assertInThread(threadId, me);

        hashOps.put(readKey(me), String.valueOf(threadId), String.valueOf(lastMsgId));
    }

    public void clear(Long threadId) {
        Integer me = currentUser.requireUserId();
        assertInThread(threadId, me);

        Long clearedBefore = getClearedBefore(threadId, me);
        Long latest = queryMapper.getLatestMsgId(threadId, clearedBefore);
        Long to = (latest == null) ? clearedBefore : latest;

        DmThreadUserState s = getState(threadId, me);
        if (s == null) {
            ensureState(threadId, me);
            s = getState(threadId, me);
        }
        s.setClearedBeforeMsgId(to);
        updateState(s);

        redis.opsForHash().put(readKey(me), String.valueOf(threadId), String.valueOf(to));
    }


    public void hide(Long threadId) {
        Integer me = currentUser.requireUserId();
        assertInThread(threadId, me);

        DmThreadUserState s = getState(threadId, me);
        if (s == null) {
            ensureState(threadId, me);
            s = getState(threadId, me);
        }
        s.setIsHidden(true);
        updateState(s);

    }

    public void unhide(Long threadId, Integer me) {
        DmThreadUserState s = getState(threadId, me);
        if (s == null) return;
        if (Boolean.TRUE.equals(s.getIsHidden())) {
            s.setIsHidden(false);
            updateState(s);
        }
    }


    private Long getClearedBefore(Long threadId, Integer uid) {
        DmThreadUserState s = getState(threadId, uid);
        return (s == null || s.getClearedBeforeMsgId() == null) ? 0L : s.getClearedBeforeMsgId();
    }


    private void assertInThread(Long threadId, Integer uid) {
        DmThread t = threadMapper.selectById(threadId);
        if (t == null || (!t.getAId().equals(uid) && !t.getBId().equals(uid))) {
            throw new BusinessException(403, "No access");
        }
    }

    private DmThreadUserState getState(Long threadId, Integer uid) {
        return stateMapper.selectOne(new LambdaQueryWrapper<DmThreadUserState>()
                .eq(DmThreadUserState::getThreadId, threadId)
                .eq(DmThreadUserState::getUserId, uid)
        );
    }

    private void updateState(DmThreadUserState s) {
        stateMapper.update(
                s,
                new LambdaQueryWrapper<DmThreadUserState>()
                        .eq(DmThreadUserState::getThreadId, s.getThreadId())
                        .eq(DmThreadUserState::getUserId, s.getUserId())
        );
    }
}
