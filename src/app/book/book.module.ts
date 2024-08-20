import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/entities/account.entity";
import { Book } from "src/entities/book.entity";
import { User } from "src/entities/user.entity";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Book, User])
  ],
  controllers: [
    BookController
  ],
  providers: [BookService]
})
export class BookModule { }
