import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppRole } from '../../rbac/role.enum';

export class UpdateRoleDto {
  @ApiProperty({ enum: AppRole, example: AppRole.MODERATOR })
  @IsEnum(AppRole)
  role!: AppRole;
}
