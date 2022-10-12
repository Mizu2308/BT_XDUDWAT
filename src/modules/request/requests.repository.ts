import {InjectRepository} from '@nestjs/typeorm';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {CommonPagination} from 'src/common/helper/common-pagination';
import {Repository, DeleteResult, EntityRepository} from 'typeorm';
import {UserRoles} from '../users/users.enum';
import {FindAllRequestDto} from './dto/list.requests.dto';
import {RequestBaseDto} from './dto/requests.dto';
import {RequestEntity, RequestEntityName} from './entities/request.entity';
import {RequestMethod, RequestStatus} from './requests.enum';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private repo: Repository<RequestEntity>,
  ) {
    super();
  }

  /**
   * register user
   * @param registerUserDto
   * @returns
   */
  async createRequest(
    userId: string,
    body: string,
    creatorRole: UserRoles,
    method: RequestMethod,
  ): Promise<RequestBaseDto> {
    const request = new RequestEntity();

    request.staffId = userId;
    request.body = body;
    request.creatorRole = creatorRole;
    request.method = method;

    return request.save();
  }

  /**
   * Get all user
   * @param filterDto
   * @returns
   */
  async getAllUsers(
    filterDto: FindAllRequestDto,
    role: UserRoles,
  ): Promise<ResponsePagination<RequestEntity>> {
    const {search} = filterDto;
    const query = this.repo.createQueryBuilder(RequestEntityName);

    if (search) {
      const searchStr = search.trim();
      query
        .orWhere(`${RequestEntityName}.username ILIKE :search`, {search: `%${searchStr}%`})
        .orWhere(`${RequestEntityName}.email ILIKE :search`, {search: `%${searchStr}%`});
    }

    if (role === UserRoles.ADMIN) {
      query
        .orWhere(`(${RequestEntityName}.creator_role = '${UserRoles.STAFF}')`)
        .andWhere(`${RequestEntityName}.status = '${RequestStatus.PENDING}' `);
    } else if (role === UserRoles.STAFF) {
      query
        .orWhere(`(${RequestEntityName}.creator_role = '${UserRoles.USER}')`)
        .andWhere(`${RequestEntityName}.status = '${RequestStatus.PENDING}' `);
    }

    query.orderBy(`${RequestEntityName}.createdAt`, 'DESC');

    return CommonPagination(filterDto, query);
  }

  /**
   * Get user by Id
   * @param id
   * @returns
   */
  async getRequestById(id: string): Promise<RequestEntity> {
    return this.repo.findOne({
      where: {id},
    });
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<RequestEntity> {
    const request = await this.getRequestById(id);
    request.status = status;

    return request.save();
  }

  /**
   * Delete a request
   * @param id
   * @returns
   */
  async deleteRequest(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
