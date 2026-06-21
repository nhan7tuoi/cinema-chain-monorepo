import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { IAuthResponse, IJwtPayload } from '@cinema/types';
import { UserType } from '.prisma/generated';
import { PrismaService } from '../../prisma.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  private async getTokens(userId: string, email: string | null, userType: string) {
    const payload: IJwtPayload = { sub: userId, email, userType };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'FALLBACK_KEY',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'FALLBACK_REFRESH_KEY',
        expiresIn: '7d',
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.redisService.set(`refresh_token:${userId}`, hashedRefreshToken, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const tokens = await this.getTokens(user.id, user.email, user.userType);
    
    const role = await this.prisma.role.findUnique({
      where: { code: user.userType },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    const roles: string[] = [user.userType];
    const permissions: string[] = role?.permissions?.map((rp: any) => rp.permission?.name).filter(Boolean) || [];

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        fullName: user.employee?.fullName || user.customer?.fullName || 'Unknown',
        avatarUrl: user.employee?.avatarUrl || user.customer?.avatarUrl || null,
        roles,
        permissions,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại trong hệ thống');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: registerDto.email,
          phone: registerDto.phone,
          password: hashedPassword,
          userType: UserType.CUSTOMER,
        },
      });

      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName: registerDto.fullName,
        },
      });

      return user;
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.userType);
    return {
      ...tokens,
      user: {
        id: newUser.id,
        email: newUser.email,
        userType: newUser.userType,
        fullName: registerDto.fullName,
        avatarUrl: null,
        roles: [],
        permissions: [],
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const storedHash = await this.redisService.get(`refresh_token:${userId}`);
    if (!storedHash) {
      throw new UnauthorizedException('Token đã hết hạn hoặc không tồn tại');
    }

    const isMatch = await bcrypt.compare(refreshToken, storedHash);
    if (!isMatch) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const tokens = await this.getTokens(user.id, user.email, user.userType);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.redisService.del(`refresh_token:${userId}`);
  }
}
