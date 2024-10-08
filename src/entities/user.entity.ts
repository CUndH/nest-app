import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    unique: true
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码'
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称'
  })
  nickName: string;


  @Column({
    comment: '邮箱',
    length: 50
  })
  email: string;


  @Column({
    comment: '头像',
    type: 'text',
    nullable: true
  })
  headPic: string;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true
  })
  phoneNumber: string;

  @Column({
    comment: '用户状态',
    default: 1
  })
  status: number;


  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles'
  })
  roles: Role[]
}