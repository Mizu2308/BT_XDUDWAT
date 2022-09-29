import {ApiProperty} from '@nestjs/swagger';

class PaginationResDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPage: number;

  @ApiProperty()
  totalCount: number;
}

export class ResponsePagination<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  pagination: PaginationResDto;
}
