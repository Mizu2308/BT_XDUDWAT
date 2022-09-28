import {
  Get,
  Req,
  Body,
  Post,
  Query,
  UseGuards,
  Controller,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {SWAGGER_CF} from 'configs/configs.constants';
import {JwtAuthGuard} from 'src/common/auth/guards/jwt-auth.guard';
import {RolesGuard} from 'src/common/auth/guards/roles.guard';
import {BaseDeleteResDTO} from 'src/common/dto/base-delete-response.dto';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {UserInfo} from 'src/common/dto/reqUserInfo.Dto';
import {UuidReqDTO} from 'src/common/dto/uuid-req.dto';
import {FindAllRequestDto} from './dto/list.requests.dto';
import {RequestEntity} from './entities/request.entity';
import {RequestService} from './requests.service';

@Controller('/requests')
@ApiTags('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(SWAGGER_CF.accessToken)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiOperation({
    operationId: 'get-all-users',
    description: `
      GET /
    `,
    summary: 'Get all Users',
  })
  @ApiOkResponse({description: 'OK', type: FindAllRequestDto})
  async getAll(
    @Query() filterDto: FindAllRequestDto,
    @Req() req: {user: UserInfo},
  ): Promise<ResponsePagination<RequestEntity>> {
    return this.requestService.getAll(filterDto, req.user.role);
  }

  // Delete Request by Id
  @Delete('/:id')
  @ApiOperation({
    operationId: 'Delete-Request',
    description: `
    DELETE /:id
    `,
    summary: 'Admin - Delete A Request',
  })
  @ApiOkResponse({description: 'Success', type: BaseDeleteResDTO})
  async delete(@Param(ValidationPipe) {id}: UuidReqDTO): Promise<BaseDeleteResDTO> {
    const deleted = await this.requestService.deleteRequest(id);
    return {deleted};
  }
}
