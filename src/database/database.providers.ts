// import { DataSource } from 'typeorm';
// import { join } from 'path';
// import { Product } from 'src/products/entity/product.entity';
// import { Category } from 'src/categories/entity/category.entity';
// import { Supplier } from 'src/suppliers/entity/supplier.entity';
// import { User } from 'src/users/entity/user.entity';

// export const databaseProviders = [
//   {
//     provide: 'DATA_SOURCE',
//     useFactory: async () => {
//       const dataSource = new DataSource({
//         type: 'sqlite',
//         database: join(process.cwd(), 'database.sqlite'),
//         entities: [Product, Category, Supplier, User],
//         synchronize: true,
//       });

//       return dataSource.initialize();
//     },
//   },
// ];
