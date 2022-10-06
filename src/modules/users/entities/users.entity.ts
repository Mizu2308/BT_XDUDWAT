import {RequestEntity} from 'src/modules/request/entities/request.entity';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import {UserRoles, UserStage, UserStatus} from '../users.enum';

export const UserEntityName = 'users';

@Entity({name: UserEntityName})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => RequestEntity, (request: RequestEntity) => request.staffId)
  request: RequestEntity[];

  @Column({name: 'username', nullable: false, unique: true})
  username: string;

  @Column({name: 'first_name', nullable: true})
  firstName: string;

  @Column({name: 'last_name', nullable: true})
  lastName: string;

  @Column({name: 'identity', nullable: true})
  identity: number;

  @Column({name: 'description', nullable: true})
  description: string;

  @Column({name: 'survey_price', nullable: true, type: 'decimal'})
  surveyPrice: number;

  @Column({name: 'number_of_survey', nullable: true})
  numberSurvey: number;

  @Column({name: 'number_question_of_survey', nullable: true})
  questionSurvey: number;

  @Column({name: 'password', nullable: true})
  password: string;

  @Column({name: 'confirm_password', nullable: true})
  confirmPassword: string;

  @Column({name: 'email', nullable: false, unique: true})
  email: string;

  @Column({name: 'phone', nullable: true})
  phone: string;

  @Column({name: 'address', nullable: true})
  address: string;

  @Column({name: 'role', type: 'enum', enum: UserRoles, default: UserRoles.USER})
  role: UserRoles;

  @Column({name: 'status', type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE})
  status: UserStatus;

  @Column({name: 'stage', type: 'enum', enum: UserStage, nullable: true})
  stage: UserStage;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
