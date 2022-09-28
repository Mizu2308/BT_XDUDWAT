import {InjectRepository} from '@nestjs/typeorm';
import {UserIdDTO} from './dto/get-by-id.user.dto';
import {RegisterUserDto} from './dto/register.user.dto';
import {UpdateUserDto} from './dto/update.user.dto';
import {FindAllUsersDto} from './dto/list.users.dto';
import {UserEntity, UserEntityName} from './entities/users.entity';
import {Not, IsNull, Repository, DeleteResult, EntityRepository} from 'typeorm';
import {CommonPagination} from 'src/common/helper/common-pagination';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {UserRoles, UserStatus} from './users.enum';
import {CreateUserDto} from './dto/create.user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {
    super();
  }

  /**
   * register user
   * @param registerUserDto
   * @returns
   */
  async registerUser(registerUserDto: RegisterUserDto, password: string): Promise<UserEntity> {
    const user = new UserEntity();

    user.username = registerUserDto.username;
    user.password = password;
    user.confirmPassword = password;
    user.email = registerUserDto.email;
    user.phone = registerUserDto.phone;
    user.address = registerUserDto.address;

    return user.save();
  }

  /**
   * Create user
   * @param createDto
   * @returns
   */
  async createUser(
    createDto: CreateUserDto,
    password: string,
    role: UserRoles,
  ): Promise<UserEntity> {
    const user = new UserEntity();

    user.username = createDto.username;
    user.password = password;
    user.confirmPassword = password;
    user.email = createDto.email;
    user.firstName = createDto.firstName;
    user.lastName = createDto.lastName;
    user.identity = createDto.identity;
    user.description = createDto.description;
    user.surveyPrice = createDto.surveyPrice;
    user.numberSurvey = createDto.numberSurvey;
    user.questionSurvey = createDto.questionSurvey;
    user.role = role;

    return user.save();
  }

  /**
   * Get all user
   * @param filterDto
   * @returns
   */
  async getAllUsers(
    filterDto: FindAllUsersDto,
    role: UserRoles,
  ): Promise<ResponsePagination<UserEntity>> {
    const {search} = filterDto;
    const query = this.repo.createQueryBuilder(UserEntityName);

    if (search) {
      const searchStr = search.trim();
      query
        .orWhere(`${UserEntityName}.username ILIKE :search`, {search: `%${searchStr}%`})
        .orWhere(`${UserEntityName}.email ILIKE :search`, {search: `%${searchStr}%`});
    }

    if (role === UserRoles.ADMIN) {
      query.orWhere(`(${UserEntityName}.role = '${UserRoles.STAFF}')`);
    } else if (role === UserRoles.STAFF) {
      query.orWhere(`(${UserEntityName}.role = '${UserRoles.USER}')`);
    }

    query.orderBy(`${UserEntityName}.createdAt`, 'DESC');

    return CommonPagination(filterDto, query);
  }

  /**
   * Get user by Id
   * @param id
   * @returns
   */
  async getUserById(id: string): Promise<UserEntity> {
    return this.repo.findOne({
      where: {id},
    });
  }

  /**
   * Get user
   * @param field 'username' | 'email' | 'phone' | 'tabletId'
   * @param fieldData string
   * @param dupId string
   * @returns
   */
  async getUserByField(
    field: 'username' | 'email' | 'phone' | 'role',
    fieldData: string,
    dupId: string = null,
  ): Promise<UserEntity> {
    return this.repo.findOne({
      where: {
        [field]: fieldData,
        id: Not(dupId || IsNull()),
      },
    });
  }

  /**
   * Update user
   * @param user
   * @param updateDto
   * @returns
   */
  async updateUser(user: UserEntity, updateDto: UpdateUserDto): Promise<UserEntity> {
    user.phone = updateDto.phone;
    user.address = updateDto.address;
    user.firstName = updateDto.firstName;
    user.lastName = updateDto.lastName;
    user.identity = updateDto.identity;
    user.description = updateDto.description;
    user.surveyPrice = updateDto.surveyPrice;
    user.numberSurvey = updateDto.numberSurvey;
    user.questionSurvey = updateDto.questionSurvey;

    return user.save();
  }

  /**
   * Update user status
   * @param user UserEntity
   * @param status UserStatus
   * @returns UserEntity
   */
  async updateUserStatus(user: UserEntity, status: UserStatus): Promise<UserEntity> {
    user.status = status;

    return user.save();
  }

  /**
   * Change password
   * @param user UserEntity
   * @param newPassword string
   * @returns UserEntity
   */
  async changePassword(user: UserEntity, newPassword: string): Promise<UserEntity> {
    user.password = newPassword;
    user.confirmPassword = newPassword;

    return user.save();
  }

  /**
   * Get user by username and password
   * @param username
   * @param passport
   * @returns
   */
  async getUserByUserNamePass(username: string, passport: string): Promise<UserEntity> {
    return this.repo.findOne({
      where: {
        username: username,
        password: passport,
      },
    });
  }
}
