import {Injectable, NotFoundException} from '@nestjs/common';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {UserRoles} from '../users/users.enum';
import {FindAllRequestDto} from './dto/list.requests.dto';
import {RequestBaseDto} from './dto/requests.dto';
import {RequestEntity} from './entities/request.entity';
import {RequestMethod, RequestStatus} from './requests.enum';
import {RequestRepository} from './requests.repository';

@Injectable()
export class RequestService {
  constructor(private readonly repo: RequestRepository) {}

  /**
   * create new request
   * @param body: []
   * @param role: UserRoles
   * @returns UserBaseDto
   */
  async createRequest(
    userId: string,
    body: string,
    role: UserRoles,
    method: RequestMethod,
  ): Promise<RequestBaseDto> {
    return this.repo.createRequest(userId, body, role, method);
  }

  /**
   * Get all users
   * @param filterDto
   * @returns
   */
  async getAll(
    filterDto: FindAllRequestDto,
    role: UserRoles,
  ): Promise<ResponsePagination<RequestEntity>> {
    return this.repo.getAllUsers(filterDto, role);
  }

  async getById(id: string): Promise<RequestEntity> {
    const request = await this.repo.getRequestById(id);

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async updateRequestStatus(id: string, status: RequestStatus) {
    return await this.repo.updateRequestStatus(id, status);
  }

  /**
   * Delete request
   * @param id
   * @returns
   */
  async deleteRequest(id: string): Promise<boolean> {
    await this.getById(id);

    const deleteData = await this.repo.deleteRequest(id);
    return Boolean(deleteData?.affected);
  }
}
