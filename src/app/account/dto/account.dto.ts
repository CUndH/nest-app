import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InsertAccountDTO {
  @IsNotEmpty({
    message: '金额不能为空',
  })
  @ApiProperty()
  price: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  bookId: number;
}
