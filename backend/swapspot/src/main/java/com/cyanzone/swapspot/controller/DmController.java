package com.cyanzone.swapspot.controller;

import com.cyanzone.swapspot.common.ApiResponse;
import com.cyanzone.swapspot.dto.DmMessageRow;
import com.cyanzone.swapspot.dto.DmThreadRow;
import com.cyanzone.swapspot.service.DmService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class DmController {

  private final DmService dm;

  public DmController(DmService dm) {
    this.dm = dm;
  }

  @PostMapping("/dm/{otherId}")
  public ApiResponse<Map<String, String>> dmWith(@PathVariable Integer otherId) {
    String threadId = dm.getOrCreateThread(otherId);
    return ApiResponse.success(Map.of("threadId", threadId));
  }

  @GetMapping("/threads")
  public ApiResponse<List<DmThreadRow>> threads() {
    return ApiResponse.success(dm.listThreads());
  }

  @GetMapping("/threads/{id}")
  public ApiResponse<List<DmMessageRow>> messages(
      @PathVariable Long id,
      @RequestParam(required = false) Long beforeId,
      @RequestParam(defaultValue = "30") int limit
  ) {
    return ApiResponse.success(dm.listMessages(id, beforeId, limit));
  }

  public record SendReq(String contentJson, String clientMsgId) {}

  @PostMapping("/threads/{id}/send")
  public ApiResponse<Map<String, String>> send(@PathVariable Long id, @RequestBody SendReq req) {
    String msgId = dm.send(id, req.contentJson(), req.clientMsgId());
    return ApiResponse.success(Map.of("msgId", msgId));
  }

  public record ReadReq(Long lastMsgId) {}

  @PostMapping("/threads/{id}/read")
  public ApiResponse<Void> read(@PathVariable Long id, @RequestBody ReadReq req) {
    dm.markRead(id, req.lastMsgId());
    return ApiResponse.success();
  }

  @PostMapping("/threads/{id}/clear")
  public ApiResponse<Void> clear(@PathVariable Long id) {
    dm.clear(id);
    return ApiResponse.success();
  }

  @PostMapping("/threads/{id}/hide")
  public ApiResponse<Void> hide(@PathVariable Long id) {
    dm.hide(id);
    return ApiResponse.success();
  }
}
