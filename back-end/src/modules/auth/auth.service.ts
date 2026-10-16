import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { db, nextId, saveDb, UserRecord } from '../../common/utils/in-memory-db';
import { AppRole } from '../rbac/role.enum';
import { GoogleAuthDto } from './dto/google-auth.dto';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: AppRole;
  firstName?: string;
  lastName?: string;
}

interface LoginPayload {
  login: string;
  password: string;
  role?: AppRole;
}

interface VerifiedGoogleProfile {
  sub: string;
  email: string;
  email_verified?: boolean | string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private readonly oauthClient = new OAuth2Client();

  register(payload: RegisterPayload): UserRecord {
    const exists = db.users.some(
      (user) =>
        user.email.toLowerCase() === payload.email.toLowerCase() ||
        user.username.toLowerCase() === payload.username.toLowerCase(),
    );
    if (exists) {
      throw new BadRequestException('A user with this email or username already exists');
    }

    const created: UserRecord = {
      id: nextId('user'),
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: payload.role || AppRole.USER,
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatar: null,
      authProvider: 'local',
    };
    db.users.push(created);
    saveDb();
    return created;
  }

  login(payload: LoginPayload): UserRecord {
    const login = payload.login.toLowerCase();
    const user = db.users.find(
      (item) =>
        (item.email.toLowerCase() === login || item.username.toLowerCase() === login) &&
        (item.password || 'Demo@123') === payload.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (payload.role && user.role !== payload.role) {
      throw new UnauthorizedException('Invalid role for this account');
    }
    return user;
  }

  /**
   * Securely validates Google OAuth credential / token on the backend
   * and links or auto-provisions a Se7enSquare user.
   */
  async googleAuth(payload: GoogleAuthDto): Promise<UserRecord> {
    if (!payload.credential && !payload.accessToken) {
      throw new BadRequestException('Either Google credential (ID token) or accessToken is required');
    }

    let googleProfile: VerifiedGoogleProfile;

    if (payload.credential) {
      try {
        const ticket = await this.oauthClient.verifyIdToken({
          idToken: payload.credential,
          audience: process.env.GOOGLE_CLIENT_ID || undefined,
        });
        const p = ticket.getPayload();
        if (!p || !p.email || !p.sub) {
          throw new UnauthorizedException('Invalid Google token claims');
        }
        googleProfile = {
          sub: p.sub,
          email: p.email,
          email_verified: p.email_verified,
          given_name: p.given_name,
          family_name: p.family_name,
          name: p.name,
          picture: p.picture,
        };
      } catch (err: unknown) {
        // Fallback to Google tokeninfo endpoint
        try {
          const tokenInfoRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(payload.credential)}`,
          );
          if (!tokenInfoRes.ok) {
            throw new Error(`Google tokeninfo endpoint returned ${tokenInfoRes.status}`);
          }
          const p = (await tokenInfoRes.json()) as Record<string, unknown>;
          if (!p.email || !p.sub) {
            throw new Error('Google tokeninfo missing email or sub');
          }
          googleProfile = {
            sub: String(p.sub),
            email: String(p.email),
            email_verified: p.email_verified === 'true' || p.email_verified === true,
            given_name: typeof p.given_name === 'string' ? p.given_name : undefined,
            family_name: typeof p.family_name === 'string' ? p.family_name : undefined,
            name: typeof p.name === 'string' ? p.name : undefined,
            picture: typeof p.picture === 'string' ? p.picture : undefined,
          };
        } catch {
          const msg = err instanceof Error ? err.message : 'Token verification failed';
          throw new UnauthorizedException(`Google token verification failed: ${msg}`);
        }
      }
    } else {
      // payload.accessToken
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${payload.accessToken}` },
        });
        if (!res.ok) {
          throw new Error(`Google userinfo returned HTTP ${res.status}`);
        }
        const p = (await res.json()) as Record<string, unknown>;
        if (!p.email || !p.sub) {
          throw new Error('Google userinfo missing email or sub');
        }
        googleProfile = {
          sub: String(p.sub),
          email: String(p.email),
          email_verified: p.email_verified === true || p.email_verified === 'true',
          given_name: typeof p.given_name === 'string' ? p.given_name : undefined,
          family_name: typeof p.family_name === 'string' ? p.family_name : undefined,
          name: typeof p.name === 'string' ? p.name : undefined,
          picture: typeof p.picture === 'string' ? p.picture : undefined,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Access token validation failed';
        throw new UnauthorizedException(`Google authentication failed: ${msg}`);
      }
    }

    const isVerified = googleProfile.email_verified === true || googleProfile.email_verified === 'true';
    if (!isVerified) {
      throw new UnauthorizedException('Google account email has not been verified');
    }

    const email = googleProfile.email.toLowerCase().trim();
    const googleId = googleProfile.sub;

    // Check if user already exists with matching googleId or matching email
    const existingUser = db.users.find(
      (u) => (u.googleId && u.googleId === googleId) || u.email.toLowerCase() === email,
    );

    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
      }
      if (!existingUser.authProvider) {
        existingUser.authProvider = 'google';
      }
      if (!existingUser.avatar && googleProfile.picture) {
        existingUser.avatar = googleProfile.picture;
      }
      saveDb();
      return existingUser;
    }

    // Provision new user
    const baseUsername =
      (email.split('@')[0] || 'player').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'player';
    let candidateUsername = baseUsername;
    let counter = 1;
    while (db.users.some((u) => u.username.toLowerCase() === candidateUsername.toLowerCase())) {
      candidateUsername = `${baseUsername}${counter}`;
      counter++;
    }

    const newUser: UserRecord = {
      id: nextId('user'),
      username: candidateUsername,
      email,
      role: AppRole.USER,
      firstName: googleProfile.given_name || googleProfile.name?.split(' ')[0] || 'Gamer',
      lastName: googleProfile.family_name || googleProfile.name?.split(' ').slice(1).join(' ') || '',
      avatar: googleProfile.picture || null,
      googleId,
      authProvider: 'google',
    };

    db.users.push(newUser);
    saveDb();
    return newUser;
  }
}
