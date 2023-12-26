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
    user1.isAdmin = true;
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
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
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
}