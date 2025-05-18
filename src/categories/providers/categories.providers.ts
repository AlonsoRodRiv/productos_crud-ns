import { Category } from '../entity/category.entity';

export const categoriesProviders = [
  { provide: 'CategoriesRepository', useValue: Category },
];
