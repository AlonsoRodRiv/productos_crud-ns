import { Supplier } from '../entity/supplier.entity';

export const suppliersProviders = [
  { provide: 'SuppliersRepository', useValue: Supplier },
];
