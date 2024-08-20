import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NeedLogin } from 'src/decorator/permission.decorator';
import { AccountService } from './account.service';

@ApiTags('账目管理模块')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @NeedLogin()
  @Get('list')
  async getList(@Query('bookId') bookId: number) {
    return await this.accountService.findAccountsByMonth(bookId);
  }
}
