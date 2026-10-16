import { AppRole } from '../../modules/rbac/role.enum';
import * as fs from 'fs';
import * as path from 'path';
import { initialCounters, seedDb, hashPassword, verifyPassword } from './seed-data';

export { hashPassword, verifyPassword };

const DB_FILE = path.join(process.cwd(), 'db.json');

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'escalated';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  role: AppRole;
  bio?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string | null;
  googleId?: string;
  authProvider?: 'local' | 'google';
  status: UserStatus;
  statusReason?: string;
  statusUntil?: string;
  statusBy?: number;
  createdAt?: string;
  privacy?: {
    showActivity?: boolean;
    allowDMs?: boolean;
    [key: string]: any;
  };
  passwordHash?: string;
  password?: string; // legacy optional for migration
}

export interface CommunityChannel {
  id: string;
  name: string;
  type: string;
  topic?: string;
}

export interface CommunityRecord {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  tags: string[];
  channels?: Array<string | CommunityChannel | { id?: string; name: string; type?: string; topic?: string }>;
  icon?: string;
  category?: string;
  slug?: string;
  banner?: string;
  bannerImage?: string;
  visibility?: 'public' | 'private';
  rules?: string[];
  status?: 'active' | 'suspended';
  suspendedReason?: string;
  suspendedAt?: string;
  suspendedBy?: number;
  createdAt?: string;
  memberCount?: number; // derived in UI/service
  onlineCount?: number;
}


export interface MembershipRecord {
  id: number;
  userId: number;
  communityId: number;
  role?: 'owner' | 'moderator' | 'member';
  joinedAt: string;
}

export interface EventRecord {
  id: number;
  title: string;
  description: string;
  communityId: number;
  date: string;
  time?: string;
  type?: string;
  attendees?: number; // derived from eventRegistrations
  maxAttendees?: number;
  status?: string;
  createdBy?: string;
  organiserId?: number;
  entryFee?: number;
  prizePool?: number;
}

export interface PostRecord {
  id: number;
  title: string;
  content: string;
  communityId: number;
  authorId: number;
  upvotes?: number;
  commentCount?: number;
  createdAt?: string;
}

export interface ReportRecord {
  id: number;
  reporterId: number;
  targetType: 'post' | 'user' | 'community';
  targetId: number;
  reason: string;
  status: ReportStatus;
  escalatedTo?: string;
  resolutionNote?: string;
}

export interface EventRegistrationRecord {
  id: number;
  eventId: number;
  userId: number;
  registeredAt: string;
  fullName?: string;
  contactEmail?: string;
  phone?: string;
  inGameId?: string;
}

export interface AppealRecord {
  id: number;
  userId?: number;
  actionId: string;
  text: string;
  acknowledgement: string;
  resolution: string;
  evidence: string[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ChatMessageRecord {
  id: number;
  channelId: string;
  communityId?: number;
  authorId?: number;
  authorName: string;
  content: string;
  attachments: string[];
  reactions: Record<string, number[]>;
  pinned: boolean;
  deleted?: boolean;
  deletedBy?: number;
  deletedAt?: string;
  editedAt?: string;
  replyToId?: number;
  createdAt: string;
}

export interface AuditLogRecord {
  id: number;
  action: string;
  actor: string;
  target?: string;
  reason?: string;
  createdAt: string;
}

export type NotificationType =
  | 'reaction'
  | 'report_status'
  | 'system'
  | 'sanction'
  | 'appeal'
  | 'application'
  | 'community';

export interface NotificationRecord {
  id: number;
  userId: number;
  type: NotificationType;
  text: string;
  channelId?: string;
  targetId?: number;
  read: boolean;
  createdAt: string;
}

export interface PlatformConfigRecord {
  registrationEnabled: boolean;
  eventApprovalRequired: boolean;
  reportEscalationEnabled: boolean;
  maxEventCapacity: number;
  autoModEnabled: boolean;
  maxChannelsPerCommunity: number;
  maxCommunitiesPerUser: number;
}

export type SubscriptionPlan = 'free' | 'plus' | 'ultra_pro';

export interface SubscriptionRecord {
  id: number;
  userId: number;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled';
  startedAt: string;
}

export type OrganiserStatus = 'pending' | 'verified' | 'rejected';
export type OrganiserPlan = 'free' | 'premium';

export interface OrganiserRecord {
  id: number;
  userId: number;
  status: OrganiserStatus;
  plan: OrganiserPlan;
  experienceNote?: string;
  games?: string;
  organisations?: string;
  pastEventLinks?: string[];
  expectedTournamentSize?: number;
  rulesAgreement?: boolean;
  rejectionReason?: string;
  appliedAt: string;
  verifiedAt?: string;
}

export interface FeaturedEventRecord {
  id: number;
  eventId: number;
  userId: number;
  startAt: string;
  endAt: string;
  status: 'active' | 'expired';
}

export type PaymentType = 'subscription' | 'organiser_subscription' | 'featured_event' | 'tournament_commission';

export interface PaymentRecord {
  id: number;
  userId: number;
  type: PaymentType;
  amount: number;
  description: string;
  createdAt: string;
}

export type ModeratorApplicationStatus = 'pending' | 'certified' | 'rejected';

export interface ModeratorApplicationRecord {
  id: number;
  userId: number;
  status: ModeratorApplicationStatus;
  quizScore: number;
  passMark?: number;
  answers?: number[];
  statement?: { why: string; timeZone: string; weeklyHours: number };
  rejectionReason?: string;
  appliedAt: string;
  certifiedAt?: string;
}

export type RatingTargetType = 'organiser' | 'moderator';

export interface RatingRecord {
  id: number;
  targetType: RatingTargetType;
  targetUserId: number;
  raterId: number;
  score: number;
  comment?: string;
  createdAt: string;
}

export type SanctionType =
  | 'warn'
  | 'mute'
  | 'ban'
  | 'suspend'
  | 'community_suspend'
  | 'content_removed';

export interface SanctionRecord {
  id: number;
  targetUserId: number;
  communityId: number | null;
  type: SanctionType;
  reason: string;
  byUserId: number;
  byRole: string;
  reportId: number | null;
  createdAt: string;
  expiresAt: string | null;
  status: 'active' | 'reversed';
  reversedBy?: number;
  reversedAt?: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  communities: CommunityRecord[];
  memberships: MembershipRecord[];
  events: EventRecord[];
  posts: PostRecord[];
  reports: ReportRecord[];
  eventRegistrations: EventRegistrationRecord[];
  appeals: AppealRecord[];
  messages: ChatMessageRecord[];
  auditLog: AuditLogRecord[];
  notifications: NotificationRecord[];
  subscriptions: SubscriptionRecord[];
  organisers: OrganiserRecord[];
  featuredEvents: FeaturedEventRecord[];
  payments: PaymentRecord[];
  moderatorApplications: ModeratorApplicationRecord[];
  ratings: RatingRecord[];
  sanctions: SanctionRecord[];
  platformConfig: PlatformConfigRecord;
}

export const counters: Record<string, number> = { ...initialCounters };

export let db: DatabaseSchema = JSON.parse(JSON.stringify(seedDb));


export type MigrationFn = (database: any, dbCounters: Record<string, number>) => void;

export const MIGRATIONS: MigrationFn[] = [
  // MIGRATION A1: Schema additions, normalization, and password hashing
  (database, dbCounters) => {
    // 1. Users migration
    if (Array.isArray(database.users)) {
      database.users.forEach((u: any) => {
        if (!u.status) u.status = 'active';
        if (!u.createdAt) u.createdAt = '2026-01-01T00:00:00.000Z';
        if (!u.privacy) u.privacy = { showActivity: true, allowDMs: true };
        if (!u.passwordHash && u.authProvider !== 'google') {
          u.passwordHash = hashPassword(u.password || 'Demo@123');
        }
        delete u.password;
      });
    }

    // 2. Communities migration: status, createdAt, remove stored counts, normalize channels
    if (Array.isArray(database.communities)) {
      database.communities.forEach((c: any) => {
        if (!c.status) c.status = 'active';
        if (!c.createdAt) c.createdAt = '2026-01-01T00:00:00.000Z';
        delete c.memberCount;
        delete c.onlineCount;

        const rawChannels = Array.isArray(c.channels) ? c.channels : [];
        const normalized = rawChannels.map((ch: any) => {
          if (typeof ch === 'string') {
            return {
              id: ch.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
              name: ch,
              type: 'text',
              topic: '',
            };
          }
          return {
            id: ch.id || (ch.name ? ch.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'general'),
            name: ch.name || 'channel',
            type: ch.type || 'text',
            topic: ch.topic || '',
          };
        });

        const hasGeneral = normalized.some(
          (ch: any) => ch.id === 'general' || (ch.name && ch.name.toLowerCase() === 'general'),
        );
        if (!hasGeneral) {
          normalized.unshift({ id: 'general', name: 'general', type: 'text', topic: 'General discussion' });
        }
        c.channels = normalized;
      });
    }

    // 3. Memberships migration: role and owner membership
    if (Array.isArray(database.memberships)) {
      database.memberships.forEach((m: any) => {
        if (!m.role) m.role = 'member';
      });

      if (Array.isArray(database.communities)) {
        database.communities.forEach((c: any) => {
          const existing = database.memberships.find(
            (m: any) => m.communityId === c.id && m.userId === c.ownerId,
          );
          if (existing) {
            existing.role = 'owner';
          } else {
            const newId = dbCounters.membership || 1;
            dbCounters.membership = newId + 1;
            database.memberships.push({
              id: newId,
              userId: c.ownerId,
              communityId: c.id,
              role: 'owner',
              joinedAt: c.createdAt || new Date().toISOString(),
            });
          }
        });
      }
    }

    // 4. Events migration: remove stored attendees
    if (Array.isArray(database.events)) {
      database.events.forEach((e: any) => {
        delete e.attendees;
      });
    }

    // 5. Posts migration: remove stored upvotes and commentCount
    if (Array.isArray(database.posts)) {
      database.posts.forEach((p: any) => {
        delete p.upvotes;
        delete p.commentCount;
      });
    }

    // 6. Messages migration: deleted flag, reactions as userId[]
    if (Array.isArray(database.messages)) {
      database.messages.forEach((msg: any) => {
        if (msg.deleted === undefined) msg.deleted = false;
        if (msg.reactions && typeof msg.reactions === 'object') {
          const migratedReactions: Record<string, number[]> = {};
          for (const [emoji, val] of Object.entries(msg.reactions)) {
            if (Array.isArray(val)) {
              migratedReactions[emoji] = val as number[];
            } else if (typeof val === 'number') {
              migratedReactions[emoji] = msg.authorId ? [msg.authorId] : [1];
            }
          }
          msg.reactions = migratedReactions;
        } else {
          msg.reactions = {};
        }
      });
    }

    // 7. Sanctions collection
    if (!Array.isArray(database.sanctions)) {
      database.sanctions = [];
    }
  },
];

// Load from file if exists with deep-merge over seed defaults
if (fs.existsSync(DB_FILE)) {
  try {
    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);

    if (parsed.counters && typeof parsed.counters === 'object') {
      Object.assign(counters, parsed.counters);
    }

    if (parsed.db && typeof parsed.db === 'object') {
      for (const key of Object.keys(seedDb) as Array<keyof typeof seedDb>) {
        if (Array.isArray(seedDb[key])) {
          db[key] = Array.isArray(parsed.db[key]) ? parsed.db[key] : JSON.parse(JSON.stringify(seedDb[key]));
        } else if (typeof seedDb[key] === 'object' && seedDb[key] !== null) {
          db[key] = { ...seedDb[key], ...(parsed.db[key] || {}) };
        }
      }
    }
  } catch (err) {
    console.error('Failed to load db.json, falling back to seed data:', err);
    db = JSON.parse(JSON.stringify(seedDb));
  }
} else {
  db = JSON.parse(JSON.stringify(seedDb));
}

// Run all migrations
for (const migration of MIGRATIONS) {
  migration(db, counters);
}

// Synchronize nextId counters with maximum collection IDs
const ENTITY_COUNTER_MAP: Record<string, string> = {
  users: 'user',
  communities: 'community',
  memberships: 'membership',
  events: 'event',
  posts: 'post',
  reports: 'report',
  eventRegistrations: 'eventRegistration',
  appeals: 'appeal',
  messages: 'message',
  auditLog: 'auditLog',
  notifications: 'notification',
  subscriptions: 'subscription',
  organisers: 'organiser',
  featuredEvents: 'featuredEvent',
  payments: 'payment',
  moderatorApplications: 'moderatorApplication',
  ratings: 'rating',
  sanctions: 'sanction',
};

for (const [colName, counterKey] of Object.entries(ENTITY_COUNTER_MAP)) {
  if (Array.isArray(db[colName])) {
    const maxId = (db[colName] as any[]).reduce((max: number, item: any) => {
      return item && typeof item.id === 'number' && item.id > max ? item.id : max;
    }, 0);
    if (counters[counterKey] === undefined || counters[counterKey] <= maxId) {
      counters[counterKey] = maxId + 1;
    }
  }
}

// Save migrated database
saveDb();

export function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ counters, db }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

export function nextId(entity: keyof typeof initialCounters | string): number {
  if (counters[entity] === undefined) {
    counters[entity] = 1;
  }
  const value = counters[entity];
  counters[entity] += 1;
  saveDb();
  return value;
}
