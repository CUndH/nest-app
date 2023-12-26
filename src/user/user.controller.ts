import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query, Req } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/loginUser.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/redis/redis.service";
import { UserVo } from "./vo/user.vo";
import { NeedLogin } from "src/decorator/permission.decorator";
import { JwtUserData, Request } from 'express'

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Post('login')
  async userLogin(
    @Body() loginUser: LoginUserDto
  ) {
    const vo = await this.userService.login(loginUser);

    const accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      email: vo.userInfo.email,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    const refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  @ApiQuery({
    name: 'id',
    description: '用户id'
  })
  @ApiResponse({
    type: UserVo,
    description: '用户详情'
  })
  @NeedLogin()
  @Get('getUserInfoById')
  async getUserInfoById(
    @Query('id') id: number
  ) {
    if (!id) {
      throw new HttpException('缺少用户 id', HttpStatus.OK)
    }

    return await this.userService.findUserById(id)
  }

  @ApiResponse({
    type: UserVo,
    description: '用户详情'
  })
  @NeedLogin()
  @Get('getUserInfo')
  async getUserInfo(
    @Req() request: Request
  ) {
    const authorizationHeader = request.headers['authorization'];

    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      const data = this.jwtService.verify<JwtUserData>(token);

      return await this.userService.findUserById(data.userId)
    }
  }

  @Get("initData")
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}