import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Book } from 'src/entities/book.entity';
import { User } from 'src/entities/user.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Book, User])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
