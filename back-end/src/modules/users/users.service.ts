import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { db, nextId, saveDb, UserRecord } from '../../common/utils/in-memory-db';
import { sanitizeUser, SanitizedUser } from '../../common/utils/sanitize-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DEFAULT_PRIVACY, privacyOf, canInspectUser, userForViewer } from '../../common/utils/user-privacy';
import { AppRole } from '../rbac/role.enum';

@Injectable()
export class UsersService {
  findAll(search?: string, viewer?: UserRecord, communityId?: number, reportId?: number) {
    const q = search?.trim().toLowerCase();
    return db.users.filter(u => {
      if (communityId) return db.memberships.some(m => m.userId === u.id && m.communityId === communityId);
      return u.privacy?.appearInSearch !== false || canInspectUser(u, viewer, reportId);
    }).map(u => userForViewer(u, viewer, reportId)).filter(u => !q ||
      [u.username, 'email' in u ? u.email : '', 'firstName' in u ? u.firstName : '', 'lastName' in u ? u.lastName : '']
        .some(value => String(value || '').toLowerCase().includes(q)));
  }

  findOne(id: number, viewer?: UserRecord, reportId?: number) {
    const user = db.users.find(item => item.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return userForViewer(user, viewer, reportId);
  }

  create(payload: CreateUserDto): SanitizedUser {
    const created: UserRecord = {
      id: nextId('user'),
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
      privacy: { showActivity: true, allowDMs: true },
    };
    db.users.push(created);
    saveDb();
    return sanitizeUser(created);
  }

  getMe(user: UserRecord) {
    return { ...sanitizeUser(user), privacy: privacyOf(user), hasPassword: Boolean(user.passwordHash) };
  }

  update(id: number, payload: Partial<UserRecord>): SanitizedUser {
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.assign(user, payload);
    saveDb();
    return sanitizeUser(user);
  }

  updateMe(userId: number, payload: UpdateProfileDto) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (payload.username && db.users.some(u => u.id !== userId && u.username.toLowerCase() === payload.username?.toLowerCase())) {
      throw new BadRequestException('username: already taken');
    }
    if (payload.email && db.users.some(u => u.id !== userId && u.email.toLowerCase() === payload.email?.toLowerCase())) {
      throw new BadRequestException('email: already in use');
    }
    if (payload.email && payload.email !== user.email && user.googleId) {
      throw new BadRequestException('email: Google account email cannot be changed here');
    }
    if (payload.avatar && !/^(\/uploads\/[A-Za-z0-9_.-]+|https?:\/\/[^\s]+)$/.test(payload.avatar)) {
      throw new BadRequestException('avatar: upload an image to obtain a URL');
    }
    if (payload.username !== undefined) user.username = payload.username;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.privacy) user.privacy = { ...DEFAULT_PRIVACY, ...user.privacy, ...payload.privacy };
    if (payload.firstName !== undefined) user.firstName = payload.firstName;
    if (payload.lastName !== undefined) user.lastName = payload.lastName;
    if (payload.bio !== undefined) user.bio = payload.bio;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.avatar !== undefined) user.avatar = payload.avatar;

    saveDb();
    return this.getMe(user);
  }

  updateRole(targetId: number, currentUserId: number, payload: UpdateRoleDto): SanitizedUser {
    if (targetId === currentUserId) {
      throw new BadRequestException('Cannot change your own role');
    }

    const targetUser = db.users.find((u) => u.id === targetId);
    if (!targetUser) {
      throw new NotFoundException(`User with id ${targetId} not found`);
    }

    // Protection: cannot demote the last active admin on the platform
    if (targetUser.role === AppRole.ADMIN && payload.role !== AppRole.ADMIN) {
      const activeAdminCount = db.users.filter(
        (u) => u.role === AppRole.ADMIN && u.status === 'active',
      ).length;
      if (activeAdminCount <= 1) {
        throw new BadRequestException('Cannot demote the last administrator on the platform');
      }
    }

    targetUser.role = payload.role;
    saveDb();
    return sanitizeUser(targetUser);
  }

  remove(id: number): { message: string } {
    this.findOne(id);
    db.users = db.users.filter((item) => item.id !== id);
    db.memberships = db.memberships.filter((item) => item.userId !== id);
    db.posts = db.posts.filter((item) => item.authorId !== id);
    db.reports = db.reports.filter((item) => !(item.targetType === 'user' && item.targetId === id));
    saveDb();
    return { message: `User ${id} deleted` };
  }
}
