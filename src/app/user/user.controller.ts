import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query, Req } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { LoginUserDTO } from "./dto/loginUser.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/redis/redis.service";
import { UserVO } from "./vo/user.vo";
import { NeedLogin } from "src/decorator/permission.decorator";
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { InsertUserDTO, UpdateUserDTO } from "./dto/userDetail.dto";
import { IResponse } from "src/base/res";

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
    @Body() loginUser: LoginUserDTO
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

    const accessTokenUuid = uuid()
    this.redisService.set(accessTokenUuid, accessToken);

    return IResponse.success({
      accessToken: accessTokenUuid,
      refreshToken
    });
  }

  @ApiQuery({
    name: 'id',
    description: '用户id'
  })
  @ApiResponse({
    type: UserVO,
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
    type: UserVO,
    description: '用户详情'
  })
  @NeedLogin()
  @Get('getUserInfo')
  async getUserInfo(
    @Req() request: Request
  ) {
    return request.user;
  }

  @Get("initData")
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @NeedLogin()
  @Post('add')
  async addUser(
    @Body() inserUser: InsertUserDTO
  ) {
    const foundUser = await this.userService.findUserByUsername(inserUser.username);

    if (foundUser) throw new HttpException('用户已存在', HttpStatus.OK);

    return await this.userService.insertUser(inserUser);
  }

  @NeedLogin()
  @Post('update')
  async updateUser(
    @Body() updateUser: UpdateUserDTO
  ) {
    return await this.userService.updateUser(updateUser);
  }
}