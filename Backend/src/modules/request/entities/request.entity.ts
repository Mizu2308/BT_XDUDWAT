import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {UserRoles} from 'src/modules/users/users.enum';
import {RequestMethod, RequestStatus} from '../requests.enum';
import {IRegisterUser} from 'src/modules/users/interfaces/register.user.interface';
import {ICreateUser} from 'src/modules/users/interfaces/create.user.interface';
import {IUserBase} from 'src/modules/users/interfaces/user.interface';
import {UserEntity} from 'src/modules/users/entities/users.entity';

export const RequestEntityName = 'requests';

@Entity({name: RequestEntityName})
export class RequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'staff_id'})
  staffId: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  @JoinColumn({name: 'staff_id'})
  user: UserEntity;

  @Column({name: 'body', nullable: true})
  body: string;

  @Column({name: 'method', type: 'enum', enum: RequestMethod, nullable: true})
  method: RequestMethod;

  @Column({name: 'creator_role', type: 'enum', enum: UserRoles})
  creatorRole: UserRoles;

  @Column({name: 'status', type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING})
  status: RequestStatus;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
