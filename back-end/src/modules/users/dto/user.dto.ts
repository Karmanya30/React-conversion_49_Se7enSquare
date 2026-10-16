import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppRole } from '../../rbac/role.enum';
import { UserStatus } from '../../../common/utils/in-memory-db';

export class UserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'player01' })
  username!: string;

  @ApiProperty({ example: 'player@example.com' })
  email!: string;

  @ApiProperty({ enum: AppRole, example: AppRole.USER })
  role!: AppRole;

  @ApiProperty({ enum: ['active', 'suspended', 'banned'], example: 'active' })
  status!: UserStatus;

  @ApiPropertyOptional({ example: 'Casual and competitive gamer' })
  bio?: string;

  @ApiPropertyOptional({ example: 'Alex' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Morgan' })
  lastName?: string;

  @ApiPropertyOptional({ example: '/uploads/avatar.png' })
  avatar?: string | null;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  createdAt?: string;

  @ApiPropertyOptional({ example: { showActivity: true, allowDMs: true } })
  privacy?: Record<string, any>;
}
