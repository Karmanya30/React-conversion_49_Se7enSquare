// Offline demo fallback only — replaced by live data from GET /api/communities.
export const DEFAULT_COMMUNITIES = [
  { id: 1, name: 'Pro Gamers', icon: '⚡', memberCount: 2451, onlineCount: 312, category: 'Gaming', description: 'Competitive gaming for all skill levels.', tags: ['MOBA', 'FPS', 'Esports'] },
  { id: 2, name: 'Dev Nexus', icon: '💻', memberCount: 12400, onlineCount: 890, category: 'Technology', description: 'Realtime discussions on web dev and open source.', tags: ['Web', 'Open Source'] },
  { id: 3, name: 'Design Studio', icon: '🎨', memberCount: 8200, onlineCount: 420, category: 'Design', description: 'Weekly UI crits and design sprints.', tags: ['UI', 'Figma', 'Branding'] },
  { id: 4, name: 'Open Source Hub', icon: '🌱', memberCount: 6800, onlineCount: 245, category: 'Technology', description: 'Collaborate on open source projects.', tags: ['Git', 'Hacktoberfest'] },
  { id: 5, name: 'Hackathon HQ', icon: '🏆', memberCount: 5100, onlineCount: 180, category: 'Technology', description: 'Hackathons, competitions, and team-building.', tags: ['Hackathon', 'Prizes'] },
  { id: 6, name: 'Music Makers', icon: '🎵', memberCount: 3200, onlineCount: 88, category: 'Music', description: 'Producers, singers, and music enthusiasts.', tags: ['EDM', 'Hip-hop', 'Classical'] },
  { id: 7, name: 'Fit Squad', icon: '🏋️', memberCount: 4500, onlineCount: 130, category: 'Sports', description: 'Fitness goals, workout plans, nutrition tips.', tags: ['Fitness', 'Nutrition'] },
  { id: 8, name: 'Learn Anything', icon: '📚', memberCount: 9800, onlineCount: 560, category: 'Education', description: 'Courses, tutorials, and study groups.', tags: ['Courses', 'Mentoring'] },
];

export const SORT_LABELS = {
  active: 'Most Active',
  members: 'Most Members',
  trending: 'Trending',
  newest: 'Recently Created',
};

// The API returns memberCount/onlineCount; the demo fallback uses members/online.
export const memberCountOf = (c) => c.memberCount ?? c.members ?? 0;
export const onlineCountOf = (c) => c.onlineCount ?? c.online ?? 0;
