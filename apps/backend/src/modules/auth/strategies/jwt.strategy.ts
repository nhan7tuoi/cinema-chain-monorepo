import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload, IUserContext } from '@cinema/types';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'FALLBACK_KEY',
    });
  }

  async validate(payload: IJwtPayload): Promise<IUserContext & { permissions: string[] }> {
    const role = await this.prisma.role.findUnique({
      where: { code: payload.userType },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    const permissions: string[] = role?.permissions?.map((rp: any) => rp.permission?.name).filter(Boolean) || [];

    return {
      userId: payload.sub,
      email: payload.email,
      userType: payload.userType,
      permissions,
    };
  }
}

