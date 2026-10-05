import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { UserModel, IUser } from '../../database/models/User';
import { Role } from '@codexa/shared';

export interface AuthTokens {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    xp: number;
    streak: number;
  };
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
    role?: Role;
    learningGoal?: string;
    experienceLevel?: string;
  }): Promise<AuthTokens> {
    const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.hashPassword(data.password);
    const user = await UserModel.create({
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role || 'STUDENT',
      xp: 0,
      streak: 1,
      preferences: {
        learningGoal: data.learningGoal || 'Master Full Stack Development',
        experienceLevel: data.experienceLevel || 'beginner',
        weeklyTargetHours: 5,
      },
    });

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
      },
    };
  }

  static async login(data: { email: string; password: string }): Promise<AuthTokens> {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await this.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Check streak
    const today = new Date().toISOString().slice(0, 10);
    if (user.lastActiveDate !== today) {
      user.streak = (user.streak || 0) + 1;
      user.lastActiveDate = today;
      await user.save();
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
      },
    };
  }

  static async googleLogin(data: {
    credential?: string;
    accessToken?: string;
    email?: string;
    name?: string;
    googleId?: string;
    picture?: string;
  }): Promise<AuthTokens> {
    let email = data.email?.toLowerCase().trim();
    let name = data.name?.trim();
    let googleId = data.googleId;
    let picture = data.picture;

    // 1. If a Google JWT ID token credential is provided, decode payload
    if (data.credential) {
      try {
        const parts = data.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) {
            email = payload.email.toLowerCase().trim();
          }
          if (payload.name) {
            name = payload.name;
          }
          if (payload.sub) {
            googleId = payload.sub;
          }
          if (payload.picture) {
            picture = payload.picture;
          }
        }
      } catch (e) {
        console.warn('Failed to parse Google credential JWT:', e);
      }
    }

    // 2. If a Google OAuth access token is provided, fetch userinfo from Google API
    if (data.accessToken && !email) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (res.ok) {
          const info = (await res.json()) as any;
          if (info.email) email = info.email.toLowerCase().trim();
          if (info.name) name = info.name;
          if (info.sub) googleId = info.sub;
          if (info.picture) picture = info.picture;
        }
      } catch (e) {
        console.warn('Failed to fetch userinfo with Google access token:', e);
      }
    }

    if (!email) {
      throw new Error('Google authentication failed: unable to verify Google account email');
    }

    let user = await UserModel.findOne({
      $or: [
        { email },
        ...(googleId ? [{ googleId }] : []),
      ],
    });

    if (!user) {
      // Create new user for first-time Google sign-in
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await this.hashPassword(randomPassword);

      user = await UserModel.create({
        email,
        passwordHash,
        name: name || email.split('@')[0],
        googleId,
        avatarUrl: picture,
        role: 'STUDENT',
        xp: 0,
        streak: 1,
        preferences: {
          learningGoal: 'Master Full Stack Engineering',
          experienceLevel: 'beginner',
          weeklyTargetHours: 5,
        },
      });
    } else {
      // Update googleId / avatar if not set
      let modified = false;
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (picture && !user.avatarUrl) {
        user.avatarUrl = picture;
        modified = true;
      }

      // Check streak
      const today = new Date().toISOString().slice(0, 10);
      if (user.lastActiveDate !== today) {
        user.streak = (user.streak || 0) + 1;
        user.lastActiveDate = today;
        modified = true;
      }

      if (modified) {
        await user.save();
      }
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
      },
    };
  }
}
