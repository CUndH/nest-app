import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { User } from "./user.entity";

@Entity({
  name: 'accounts'
})
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    comment: '备注'
  })
  remark: string;

  @Column({ type: 'int' })
  price: number;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Book, (book) => book.id)
  book: Book;
}