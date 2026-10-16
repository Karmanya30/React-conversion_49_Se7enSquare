import { AppRole } from '../../modules/rbac/role.enum';
import * as crypto from 'node:crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

const DEFAULT_DEMO_HASH = hashPassword('Demo@123');

export const initialCounters = {
  user: 7,
  community: 3,
  membership: 5,
  event: 4,
  post: 4,
  report: 4,
  eventRegistration: 1,
  appeal: 1,
  message: 4,
  auditLog: 3,
  notification: 1,
  subscription: 1,
  organiser: 2,
  featuredEvent: 1,
  payment: 1,
  moderatorApplication: 1,
  rating: 1,
  sanction: 1,
};

export const seedDb = {
  users: [
    {
      id: 1,
      username: 'admin01',
      email: 'admin@gameunity.local',
      role: AppRole.ADMIN,
      bio: 'Platform administrator',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
    {
      id: 2,
      username: 'mod01',
      email: 'mod@gameunity.local',
      role: AppRole.MODERATOR,
      bio: 'Community moderator',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-02T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
    {
      id: 3,
      username: 'cm01',
      email: 'cm@gameunity.local',
      role: AppRole.COMMUNITY_MANAGER,
      bio: 'Community event manager',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-03T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
    {
      id: 4,
      username: 'player01',
      email: 'player@gameunity.local',
      role: AppRole.USER,
      bio: 'Loves FPS and RPG games',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-04T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
    {
      id: 5,
      username: 'sanidhya',
      email: 'sanidhya@gameunity.local',
      role: AppRole.OWNER,
      firstName: 'Sanidhya',
      lastName: 'Joshi',
      bio: 'Platform owner',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
    {
      id: 6,
      username: 'org01',
      email: 'organizer@gameunity.local',
      role: AppRole.ORGANIZER,
      bio: 'Certified tournament organizer',
      status: 'active' as const,
      statusReason: undefined,
      statusUntil: undefined,
      statusBy: undefined,
      createdAt: '2026-01-05T00:00:00.000Z',
      privacy: { showActivity: true, allowDMs: true },
      passwordHash: DEFAULT_DEMO_HASH,
    },
  ],
  communities: [
    {
      id: 1,
      name: 'FPS Arena',
      description: 'Competitive FPS players and tournaments',
      ownerId: 4,
      tags: ['fps', 'esports'],
      icon: '⚡',
      category: 'Gaming',
      slug: 'fps-arena',
      status: 'active' as const,
      createdAt: '2026-01-10T00:00:00.000Z',
      channels: [
        { id: 'general', name: 'general', type: 'text', topic: 'General discussion for FPS players' },
        { id: 'scrims', name: 'scrims', type: 'text', topic: 'Find and coordinate scrims' },
        { id: 'clips', name: 'clips', type: 'text', topic: 'Share gameplay clips' },
      ],
    },
    {
      id: 2,
      name: 'Indie Dev Hub',
      description: 'A space for indie game creators',
      ownerId: 2,
      tags: ['indie', 'dev'],
      icon: '🎮',
      category: 'Gaming',
      slug: 'indie-dev-hub',
      status: 'active' as const,
      createdAt: '2026-01-15T00:00:00.000Z',
      channels: [
        { id: 'general', name: 'general', type: 'text', topic: 'General indie dev discussions' },
        { id: 'announcements', name: 'announcements', type: 'text', topic: 'Official announcements' },
        { id: 'showcase', name: 'showcase', type: 'text', topic: 'Show off your WIP projects' },
      ],
    },
  ],
  memberships: [
    { id: 1, userId: 2, communityId: 1, role: 'member' as const, joinedAt: '2026-01-10T09:00:00.000Z' },
    { id: 2, userId: 4, communityId: 1, role: 'owner' as const, joinedAt: '2026-01-10T00:00:00.000Z' },
    { id: 3, userId: 3, communityId: 2, role: 'member' as const, joinedAt: '2026-02-01T08:00:00.000Z' },
    { id: 4, userId: 1, communityId: 2, role: 'member' as const, joinedAt: '2026-02-05T10:00:00.000Z' },
    { id: 5, userId: 2, communityId: 2, role: 'owner' as const, joinedAt: '2026-01-15T00:00:00.000Z' },
  ],
  events: [
    {
      id: 1,
      title: 'Friday Scrim Night',
      description: 'Weekly custom matches',
      communityId: 1,
      date: '2026-05-09',
      time: '6:00 PM',
      type: 'tournament',
      maxAttendees: 100,
      status: 'approved',
      createdBy: 'admin01',
    },
    {
      id: 2,
      title: 'Pixel Jam',
      description: '48-hour game jam kickoff',
      communityId: 2,
      date: '2026-05-10',
      time: '9:00 AM',
      type: 'hackathon',
      maxAttendees: 200,
      status: 'approved',
      createdBy: 'cm01',
    },
    {
      id: 3,
      title: 'UI Design Workshop',
      description: 'Learn UI design fundamentals for games',
      communityId: 2,
      date: '2026-05-15',
      time: '5:00 PM',
      type: 'workshop',
      maxAttendees: 50,
      status: 'pending',
      createdBy: 'player01',
    },
  ],
  posts: [
    {
      id: 1,
      title: 'Looking for squad',
      content: 'Need two players for ranked grind',
      communityId: 1,
      authorId: 4,
      createdAt: '2026-04-28T10:00:00.000Z',
    },
    {
      id: 2,
      title: 'Show your prototype',
      content: 'Drop your latest indie demos in comments',
      communityId: 2,
      authorId: 2,
      createdAt: '2026-04-29T15:00:00.000Z',
    },
    {
      id: 3,
      title: 'Tournament rules update',
      content: 'Check the pinned post for updated ruleset',
      communityId: 1,
      authorId: 1,
      createdAt: '2026-04-30T09:00:00.000Z',
    },
  ],
  reports: [
    {
      id: 1,
      reporterId: 4,
      targetType: 'post' as const,
      targetId: 1,
      reason: 'Potential abusive language in replies',
      status: 'pending' as const,
    },
    {
      id: 2,
      reporterId: 2,
      targetType: 'user' as const,
      targetId: 4,
      reason: 'Spam-like behavior',
      status: 'reviewed' as const,
    },
    {
      id: 3,
      reporterId: 1,
      targetType: 'community' as const,
      targetId: 2,
      reason: 'Misleading community description',
      status: 'pending' as const,
    },
  ],
  eventRegistrations: [] as Array<{
    id: number;
    eventId: number;
    userId: number;
    registeredAt: string;
    fullName?: string;
    contactEmail?: string;
    phone?: string;
    inGameId?: string;
  }>,
  appeals: [] as Array<{
    id: number;
    userId?: number;
    actionId: string;
    text: string;
    acknowledgement: string;
    resolution: string;
    evidence: string[];
    status: 'pending' | 'reviewed' | 'approved' | 'rejected';
    createdAt: string;
  }>,
  messages: [
    {
      id: 1,
      channelId: 'general',
      communityId: 1,
      authorId: 1,
      authorName: 'admin01',
      content: 'Welcome to the FPS Arena general channel.',
      attachments: [] as string[],
      reactions: { '👍': [1, 2] } as Record<string, number[]>,
      pinned: true,
      deleted: false,
      createdAt: '2026-05-01T09:00:00.000Z',
    },
    {
      id: 2,
      channelId: 'general',
      communityId: 1,
      authorId: 4,
      authorName: 'player01',
      content: 'Anyone queueing ranked tonight?',
      attachments: [] as string[],
      reactions: {} as Record<string, number[]>,
      pinned: false,
      deleted: false,
      createdAt: '2026-05-01T09:05:00.000Z',
    },
    {
      id: 3,
      channelId: 'announcements',
      communityId: 2,
      authorId: 3,
      authorName: 'cm01',
      content: 'Pixel Jam registration opens this week.',
      attachments: [] as string[],
      reactions: {} as Record<string, number[]>,
      pinned: false,
      deleted: false,
      createdAt: '2026-05-01T10:00:00.000Z',
    },
  ],
  auditLog: [
    { id: 1, action: 'System Boot', actor: 'system', target: 'backend', reason: 'Seed data loaded', createdAt: '2026-05-01T08:00:00.000Z' },
    { id: 2, action: 'Community Created', actor: 'admin01', target: 'FPS Arena', reason: 'Seed community', createdAt: '2026-05-01T08:10:00.000Z' },
  ],
  notifications: [] as Array<{
    id: number;
    userId: number;
    type: 'reaction' | 'report_status' | 'system' | 'sanction' | 'appeal' | 'application' | 'community';
    text: string;
    channelId?: string;
    targetId?: number;
    read: boolean;
    createdAt: string;
  }>,
  subscriptions: [] as Array<{
    id: number;
    userId: number;
    plan: 'free' | 'plus' | 'ultra_pro';
    status: 'active' | 'cancelled';
    startedAt: string;
  }>,
  organisers: [
    { id: 1, userId: 6, status: 'verified' as const, plan: 'free' as const, appliedAt: '2026-04-01T09:00:00.000Z', verifiedAt: '2026-04-02T09:00:00.000Z' },
  ],
  featuredEvents: [] as Array<{
    id: number;
    eventId: number;
    userId: number;
    startAt: string;
    endAt: string;
    status: 'active' | 'expired';
  }>,
  payments: [] as Array<{
    id: number;
    userId: number;
    type: 'subscription' | 'organiser_subscription' | 'featured_event' | 'tournament_commission';
    amount: number;
    description: string;
    createdAt: string;
  }>,
  moderatorApplications: [] as Array<{
    id: number;
    userId: number;
    communityId: number;
    status: 'pending' | 'approved' | 'rejected';
    score: number;
    answers: Record<string, string>;
    appliedAt: string;
    reviewedAt?: string;
  }>,
  ratings: [] as Array<{
    id: number;
    targetId: number;
    targetType: 'community' | 'event';
    userId: number;
    rating: number;
    createdAt: string;
  }>,
  sanctions: [] as Array<{
    id: number;
    targetUserId: number;
    communityId: number | null;
    type: 'warn' | 'mute' | 'ban' | 'suspend' | 'community_suspend' | 'content_removed';
    reason: string;
    byUserId: number;
    byRole: string;
    reportId: number | null;
    createdAt: string;
    expiresAt: string | null;
    status: 'active' | 'reversed';
    reversedBy?: number;
    reversedAt?: string;
  }>,
  platformConfig: {
    registrationEnabled: true,
    eventApprovalRequired: true,
    reportEscalationEnabled: true,
    maxEventCapacity: 500,
    autoModEnabled: true,
    maxChannelsPerCommunity: 50,
    maxCommunitiesPerUser: 10,
  },
};
