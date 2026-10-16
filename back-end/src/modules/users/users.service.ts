import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { db, nextId, saveDb, UserRecord } from '../../common/utils/in-memory-db';
import { sanitizeUser, SanitizedUser } from '../../common/utils/sanitize-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AppRole } from '../rbac/role.enum';

@Injectable()
export class UsersService {
  findAll(search?: string): SanitizedUser[] {
    if (!search || !search.trim()) {
      return db.users.map(sanitizeUser);
    }
    const q = search.trim().toLowerCase();
    return db.users
      .filter((u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q)
      )
      .map(sanitizeUser);
  }

  findOne(id: number): SanitizedUser {
    const user = db.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return sanitizeUser(user);
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

  getMe(user: UserRecord): SanitizedUser {
    return sanitizeUser(user);
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

  updateMe(userId: number, payload: UpdateProfileDto): SanitizedUser {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (payload.firstName !== undefined) user.firstName = payload.firstName;
    if (payload.lastName !== undefined) user.lastName = payload.lastName;
    if (payload.bio !== undefined) user.bio = payload.bio;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.avatar !== undefined) user.avatar = payload.avatar;

    saveDb();
    return sanitizeUser(user);
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
