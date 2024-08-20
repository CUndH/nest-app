import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/base/res";
import { Book } from "src/entities/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class BookService {
  @InjectRepository(Book)
  private bookRepository: Repository<Book>;

  async findBooks() {
    const books = await this.bookRepository.find({
      relations: ['users']
    });


    const res = books.map(item => {
      const avatars = item.users.map(user => {
        return user.headPic;
      })

      return {
        ...item,
        avatars,
        // sudo 之后把总金额改成由各项条目合计
        price: 12300
      }
    })

    return IResponse.success(res);
  }
}