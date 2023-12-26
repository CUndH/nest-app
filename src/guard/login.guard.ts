import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtUserData, Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LoginGuard implements CanActivate {

  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private RedisService: RedisService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const needLogin = this.reflector.getAllAndOverride('needLogin', [
      context.getClass(),
      context.getHandler()
    ]);

    if (!needLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.replace('Bearer ', '');
      const res = await this.RedisService.get(token);
      const data = this.jwtService.verify<JwtUserData>(res);

        request.user = {
          userId: data.userId,
          username: data.username,
          email: data.email,
          roles: data.roles,
          permissions: data.permissions
        }
        return true;

    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}