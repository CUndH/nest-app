import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponse } from 'src/base/res';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { InsertAccountDTO } from './dto/account.dto';
import { User } from 'src/entities/user.entity';
import { Book } from 'src/entities/book.entity';

@Injectable()
export class AccountService {
  @InjectRepository(Account)
  private accountRepository: Repository<Account>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Book)
  private bookRepository: Repository<Book>;

  async findAccountsByMonth(bookId: number) {
    // sudo 按月范围查询
    const accounts = await this.accountRepository.find({
      where: {
        book: {
          id: bookId,
        },
      },
    });

    return IResponse.success(accounts);
  }

  async insertAccount(account: InsertAccountDTO) {
    const insertAccount = new Account();
    insertAccount.remark = account.remark || '';
    insertAccount.price = account.price;

    const user = await this.userRepository.findOne({
      where: { id: account.userId || 1 },
    });

    const book = await this.bookRepository.findOne({
      where: { id: account.bookId || 1 },
    });

    insertAccount.user = user;
    insertAccount.book = book;
  }
}
