import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { db, nextId, saveDb, SanctionRecord, SanctionType } from '../../common/utils/in-memory-db';
import { NotificationsService } from '../notifications/notifications.service';

export interface CreateSanctionPayload {
  targetUserId: number;
  communityId: number | null;
  type: SanctionType;
  reason: string;
  byUserId: number;
  byRole: string;
  reportId?: number | null;
  expiresAt?: string | null;
}

@Injectable()
export class SanctionsService {
  /**
   * Creates a sanction record and writes a notification to the target user.
   */
  create(payload: CreateSanctionPayload): SanctionRecord {
    const record: SanctionRecord = {
      id: nextId('sanction'),
      targetUserId: payload.targetUserId,
      communityId: payload.communityId ?? null,
      type: payload.type,
      reason: payload.reason,
      byUserId: payload.byUserId,
      byRole: payload.byRole,
      reportId: payload.reportId ?? null,
      createdAt: new Date().toISOString(),
      expiresAt: payload.expiresAt ?? null,
      status: 'active',
    };
    db.sanctions.push(record);
    saveDb();

    // Notification to target
    const typeLabel: Record<SanctionType, string> = {
      warn: 'Warning',
      mute: 'Mute',
      ban: 'Ban',
      suspend: 'Suspension',
      community_suspend: 'Community Suspension',
      content_removed: 'Content Removal',
    };
    NotificationsService.push({
      userId: payload.targetUserId,
      type: 'sanction',
      text: `${typeLabel[payload.type] ?? payload.type} applied to your account: ${payload.reason}`,
      targetId: record.id,
    });

    return record;
  }

  /**
   * Reverses an active sanction. Writes a reversal notification to the target.
   */
  reverse(sanctionId: number, byUserId: number): SanctionRecord {
    const sanction = db.sanctions.find((s) => s.id === sanctionId);
    if (!sanction) throw new NotFoundException(`Sanction ${sanctionId} not found`);
    if (sanction.status === 'reversed') return sanction;

    sanction.status = 'reversed';
    sanction.reversedBy = byUserId;
    sanction.reversedAt = new Date().toISOString();
    saveDb();

    NotificationsService.push({
      userId: sanction.targetUserId,
      type: 'sanction',
      text: `A ${sanction.type} sanction on your account has been lifted`,
      targetId: sanction.id,
    });

    return sanction;
  }

  /**
   * Returns all sanctions for a given user (all time, all types).
   */
  listForUser(userId: number): SanctionRecord[] {
    return db.sanctions.filter((s) => s.targetUserId === userId);
  }

  /**
   * Throws ForbiddenException if the user has an active mute, ban, or suspend
   * scoped to the given community or platform-wide (communityId === null).
   */
  assertCanPost(userId: number, communityId: number | null): void {
    const blocking: SanctionType[] = ['mute', 'ban', 'suspend'];
    const now = new Date().toISOString();
    const active = db.sanctions.find(
      (s) =>
        s.targetUserId === userId &&
        s.status === 'active' &&
        blocking.includes(s.type) &&
        (s.communityId === null || s.communityId === communityId) &&
        (s.expiresAt === null || s.expiresAt > now),
    );
    if (active) {
      throw new ForbiddenException(`Posting blocked due to active ${active.type}: ${active.reason}`);
    }
  }
}
