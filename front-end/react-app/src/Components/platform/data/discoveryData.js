export const DEFAULT_COMMUNITIES = [];

export const SORT_LABELS = {
  active: 'Most Active',
  members: 'Most Members',
  trending: 'Trending',
  newest: 'Recently Created',
};

// The API returns memberCount/onlineCount; the demo fallback uses members/online.
export const memberCountOf = (c) => c.memberCount ?? c.members ?? 0;
export const onlineCountOf = (c) => c.onlineCount ?? c.online ?? 0;
