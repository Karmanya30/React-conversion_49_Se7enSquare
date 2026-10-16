import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppRole } from '../rbac/role.enum';
import { UserRecord } from '../../common/utils/in-memory-db';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@ApiHeader({
  name: 'x-role',
  required: true,
  description:
    'RBAC role header. Accepted values: admin | community_manager | organizer | moderator | user. ' +
    'GET endpoints require any valid role. POST / PATCH / DELETE require admin.',
  schema: { type: 'string', enum: ['admin', 'community_manager', 'organizer', 'moderator', 'user'] },
})
@ApiHeader({
  name: 'x-user-id',
  required: true,
  description: 'Numeric user ID of the requesting user.',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user record without password or hash. Accessible even if suspended/banned.',
  })
  @ApiOkResponse({ type: UserDto, description: 'The sanitized profile of the current user' })
  getMe(@CurrentUser() user: UserRecord) {
    return this.usersService.getMe(user);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Partially updates the current user profile. Only whitelisted fields (firstName, lastName, bio, phone, avatar) are updated.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ type: UserDto, description: 'The updated user record' })
  updateMe(
    @CurrentUser('id') userId: number,
    @Body() payload: UpdateProfileDto,
  ) {
    return this.usersService.updateMe(userId, payload);
  }

  @Patch(':id/role')
  @Roles(AppRole.ADMIN)
  @ApiOperation({
    summary: 'Update user role',
    description: 'Admin-only endpoint to assign or change a user role. Cannot demote yourself or the last remaining admin.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Target user ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: UserDto, description: 'The updated user record with the new role' })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') currentUserId: number,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(id, currentUserId, payload);
  }

  @Get()
  @Roles(AppRole.ADMIN, AppRole.COMMUNITY_MANAGER, AppRole.MODERATOR, AppRole.USER, AppRole.ORGANIZER, AppRole.OWNER)
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns every user in the database without passwords or hashes.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Filter users by username, email or name' })
  @ApiOkResponse({ type: UserDto, isArray: true, description: 'Array of sanitized user records' })
  @ApiForbiddenResponse({ description: 'Missing or invalid role/identity' })
  findAll(@CurrentUser() viewer: UserRecord, @Query('search') search?: string, @Query('communityId') communityId?: string, @Query('reportId') reportId?: string) {
    return this.usersService.findAll(search, viewer, communityId ? Number(communityId) : undefined, reportId ? Number(reportId) : undefined);
  }

  @Get(':id')
  @Roles(AppRole.ADMIN, AppRole.COMMUNITY_MANAGER, AppRole.MODERATOR, AppRole.USER, AppRole.ORGANIZER, AppRole.OWNER)
  @ApiOperation({
    summary: 'Get a single user by ID',
    description: 'Fetches one sanitized user record by numeric ID.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Numeric user ID' })
  @ApiOkResponse({ type: UserDto, description: 'The matching user record' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() viewer: UserRecord, @Query('reportId') reportId?: string) {
    return this.usersService.findOne(id, viewer, reportId ? Number(reportId) : undefined);
  }

  @Post()
  @Roles(AppRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a user record. Requires admin role.',
  })
  @ApiBody({ type: CreateUserDto, description: 'User creation payload' })
  @ApiCreatedResponse({ type: UserDto, description: 'The newly created user' })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Delete(':id')
  @Roles(AppRole.ADMIN)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Removes a user and associated records. Requires admin role.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Numeric user ID to delete' })
  @ApiOkResponse({ schema: { example: { message: 'User 4 deleted' } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
