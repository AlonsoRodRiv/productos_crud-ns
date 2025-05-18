import { Product } from '../entity/product.entity';

export const productsProviders = [
  { provide: 'ProductsRepository', useValue: Product },
];
