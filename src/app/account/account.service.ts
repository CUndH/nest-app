import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/base/res";
import { Account } from "src/entities/account.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountService {
  @InjectRepository(Account)
  private accountRepository: Repository<Account>;

  async findAccountsByMonth(bookId: number) {
    // sudo 按月范围查询
    const accounts = await this.accountRepository.find({
      where: {
        book: {
          id: bookId
        }
      }
    })

    return IResponse.success(accounts);
  }
}