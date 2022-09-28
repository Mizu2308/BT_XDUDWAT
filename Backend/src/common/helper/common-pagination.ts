import {BadRequestException} from '@nestjs/common';
import {SelectQueryBuilder} from 'typeorm';
import {commonRadix} from '../constants/common.constants';
import {CommonPaginationDto} from '../dto/pagination.dto';
import {ResponsePagination} from '../dto/pagination-response.dto';
import {BasePagingEnum} from '../enum/common.enum';

/**
 * Generate response for paginate get endpoint.
 * @param commonPaginationDto CommonPaginationDto
 * @param query SelectQueryBuilder
 */
export async function CommonPagination<T>(
  commonPaginationDto: CommonPaginationDto,
  query: SelectQueryBuilder<T>,
): Promise<ResponsePagination<T>> {
  const page = (parseInt(commonPaginationDto.page, commonRadix) || BasePagingEnum.PAGE) - 1;
  const pageSize = parseInt(commonPaginationDto.pageSize, commonRadix) || BasePagingEnum.PAGE_SIZE;
  if (page < 0 || pageSize < 1) {
    throw new BadRequestException();
  }
  const [result, totalCount] = await query
    .skip(page * pageSize)
    .take(pageSize)
    .getManyAndCount();
  return {
    data: result,
    pagination: {
      currentPage: page + 1,
      pageSize,
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
    },
  };
}

export async function CommonPaginationRawQuery<T>(
  commonPaginationDto: CommonPaginationDto,
  data,
  totalCount,
): Promise<ResponsePagination<T>> {
  const page = (parseInt(commonPaginationDto.page, commonRadix) || BasePagingEnum.PAGE) - 1;
  const pageSize = parseInt(commonPaginationDto.pageSize, commonRadix) || BasePagingEnum.PAGE_SIZE;
  if (page < 0 || pageSize < 1) {
    throw new BadRequestException();
  }
  return {
    data,
    pagination: {
      currentPage: page + 1,
      pageSize,
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
    },
  };
}
