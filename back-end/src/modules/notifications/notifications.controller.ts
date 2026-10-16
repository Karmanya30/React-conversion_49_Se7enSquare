import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { AppRole } from '../rbac/role.enum';
import { MarkAllReadDto } from './dto/mark-all-read.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @Roles(AppRole.ADMIN, AppRole.COMMUNITY_MANAGER, AppRole.MODERATOR, AppRole.USER, AppRole.ORGANIZER, AppRole.OWNER)
  @ApiOperation({ summary: 'List notifications for a user, newest first' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiOkResponse({ description: 'Array of notifications for the given userId' })
  findAll(
    @Query('userId') userId?: string,
    @CurrentUser('id') currentUserId?: number,
  ) {
    const targetUserId = userId ? parseInt(userId, 10) : currentUserId;
    if (!targetUserId || isNaN(targetUserId)) {
      return [];
    }
    return this.service.findForUser(targetUserId);
  }

  @Patch('read-all')
  @Roles(AppRole.ADMIN, AppRole.COMMUNITY_MANAGER, AppRole.MODERATOR, AppRole.USER, AppRole.ORGANIZER, AppRole.OWNER)
  @ApiOperation({ summary: 'Mark every notification for a user as read' })
  markAllRead(@Body() payload: MarkAllReadDto) {
    return this.service.markAllRead(payload.userId);
  }

  @Patch(':id')
  @Roles(AppRole.ADMIN, AppRole.COMMUNITY_MANAGER, AppRole.MODERATOR, AppRole.USER, AppRole.ORGANIZER, AppRole.OWNER)
  @ApiOperation({ summary: 'Mark a single notification read/unread' })
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateNotificationDto) {
    return this.service.markRead(id, payload.read);
  }
}
