import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({
  name: 'books'
})
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '账本名称'
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_book'
  })
  users: User[];
}