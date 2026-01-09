"use client";

import ProfileHeader from "@/components/me/sections/ProfileHeader";
import useMe from "@/hooks/useMe";
import useProfileSave from "@/hooks/useProfileSave";
import { useMyListings } from "@/hooks/useMyListings";
import ListingsCard from "@/components/me/sections/ListingsCard";
import FavoritesCard from "@/components/me/sections/FavoritesCard";
import TradeHistoryCard from "@/components/me/sections/TradeHistoryCard";

export default function DashboardPage() {
  const { user, setUser, loading } = useMe();
  const { listings: myListings, loading: listingsLoading, reload } = useMyListings({ limit: 3 });
  const saveProfile = useProfileSave();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ProfileHeader
        user={user}
        onSave={async ({ headline, bio, avatarFile }) => {
          const updated = await saveProfile({ user, headline, bio, avatarFile });
          setUser((prev) => (prev ? { ...prev, ...updated } : prev));
        }}
      />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ListingsCard listings={myListings} loading={listingsLoading} reload={reload} />
        <FavoritesCard />
        <TradeHistoryCard />
      </div>
    </div>
  );
}
