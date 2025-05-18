import { User } from '../entity/user.entity';

export const usersProviders = [{ provide: 'UsersRepository', useValue: User }];
