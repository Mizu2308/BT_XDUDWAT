import {IRequestBase} from './requests.interface';

export type ICreateRequest = Pick<IRequestBase, 'body' | 'method' | 'creatorRole'>;
