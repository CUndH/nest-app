import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NeedLogin } from "src/decorator/permission.decorator";
import { BookService } from "./book.service";

@ApiTags('账本管理模块')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @NeedLogin()
  @Get('list')
  async getList() {
    return await this.bookService.findBooks();
  }
}