import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entities/permission.entity";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { md5 } from "src/utils";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserVo } from "./vo/user.vo";
import { RedisService } from "src/redis/redis.service";
import { InsertUserDto, UpdateUserDto } from "./dto/userDetail.dto";
import { IResponse } from "src/base/res";

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async initData() {
    const user1 = new User();
    user1.username = "admin";
    user1.password = md5("123456");
    user1.email = "xxx@xx.com";
    user1.status = 1;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const role1 = new Role();
    role1.name = '管理员';

    const permission1 = new Permission();
    permission1.code = 'a';
    permission1.description = '访问 a 接口';

    user1.roles = [role1];
    role1.permissions = [permission1]

    await this.permissionRepository.save([permission1]);
    await this.roleRepository.save([role1]);
    await this.userRepository.save([user1]);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username
      },
      relations: ['roles', 'roles.permissions']
    })

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.OK)
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码输入不正确', HttpStatus.OK)
    }

    let res = new UserVo()
    res.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      status: user.status,
      roles: user.roles.map(item => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach(permission => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        })
        return arr;
      }, [])
    }

    return res;
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    })

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      }
    })

    return user;
  }

  async insertUser(user: InsertUserDto) {
    const insertUser = new User();
    insertUser.username = user.username;
    insertUser.password = md5(user.password);
    insertUser.email = user.email || '';
    insertUser.nickName = user.nickName;

    try {
      const res = await this.userRepository.save(insertUser);
      return IResponse.success(res.id);
    } catch (e) {
      this.logger.error(e, UserService);
      return IResponse.fail();
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const updateData = new User()

    if (updateUserDto.id) {
      updateData.username = updateUserDto.username;
      updateData.password = md5(updateUserDto.password);
      updateData.email = updateUserDto.email || '';
      updateData.nickName = updateUserDto.nickName;
    } else {
      updateData.username = updateUserDto.username;
      updateData.nickName = updateUserDto.nickName;
      updateData.email = updateUserDto.email;
    }

    try {
      if (updateUserDto.id) {
        const res = await this.userRepository.save(updateData);
        return IResponse.success(res.id);
      } else {
        await this.userRepository.update(updateData, {
          id: updateUserDto.id
        })
      }
    } catch (e) {
      this.logger.error(e, UserService);
      return IResponse.fail()
    }
  }
}