<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Este proyecto es un CRUD completo desarrollado con NestJS, utilizando SQLite como base de datos. Implementa autenticación con JWT y gestión de productos, categorías y proveedores.

### Características Técnicas

- **Framework**: NestJS (Node.js + TypeScript)
- **Base de datos**: SQLite
- **Autenticación**: JWT (JSON Web Tokens)
- **Arquitectura**: Modular siguiendo los principios SOLID
- **Validación**: Class-validator para DTOs
- **Tests**: Jest para pruebas unitarias e integración

## Estructura del Proyecto

```
src/
├── app.module.ts              # Módulo principal de la aplicación
├── main.ts                    # Punto de entrada de la aplicación
├── auth/                      # Módulo de autenticación
│   ├── auth.module.ts         # Configuración del módulo de autenticación
│   ├── controller/            # Controladores de autenticación
│   ├── decorators/            # Decoradores personalizados
│   ├── dto/                   # Objetos de transferencia de datos
│   ├── guards/                # Guards de autenticación
│   ├── service/               # Servicios de autenticación
│   └── strategies/            # Estrategias de autenticación (JWT, Local)
│
├── categories/                # Módulo de categorías
│   ├── categories.module.ts   # Configuración del módulo de categorías
│   ├── controller/            # Controladores de categorías
│   ├── dto/                   # Objetos de transferencia de datos
│   ├── entity/                # Entidades para la base de datos
│   ├── providers/             # Proveedores de categorías
│   └── service/               # Servicios de categorías
│
├── config/                    # Configuración de la aplicación
│   ├── config.module.ts       # Módulo de configuración
│   ├── database-config.service.ts # Servicio de configuración de base de datos
│   └── env/                   # Variables de entorno
│
├── database/                  # Configuración de la base de datos
│   ├── database.module.ts     # Módulo de base de datos
│   ├── database.providers.ts  # Proveedores de base de datos
│   └── init.ts               # Inicialización de la base de datos
│
├── products/                  # Módulo de productos
│   ├── product.module.ts      # Configuración del módulo de productos
│   ├── controller/            # Controladores de productos
│   ├── dto/                   # Objetos de transferencia de datos
│   ├── entity/                # Entidades para la base de datos
│   ├── providers/             # Proveedores de productos
│   └── service/               # Servicios de productos
│
├── suppliers/                 # Módulo de proveedores
│   ├── supplier.module.ts     # Configuración del módulo de proveedores
│   ├── controller/            # Controladores de proveedores
│   ├── dto/                   # Objetos de transferencia de datos
│   ├── entity/                # Entidades para la base de datos
│   ├── providers/             # Proveedores de proveedores
│   └── service/               # Servicios de proveedores
│
└── users/                     # Módulo de usuarios
    ├── user.module.ts         # Configuración del módulo de usuarios
    ├── dto/                   # Objetos de transferencia de datos
    ├── entity/                # Entidades para la base de datos
    ├── providers/             # Proveedores de usuarios    └── service/               # Servicios de usuarios
```

## Endpoints API

La aplicación expone los siguientes endpoints:

### Autenticación

- `POST /auth/login` - Iniciar sesión y obtener token JWT
- `POST /auth/register` - Registrar un nuevo usuario

### Productos

- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener un producto por ID
- `POST /products` - Crear un nuevo producto (requiere autenticación)
- `PATCH /products/:id` - Actualizar un producto (requiere autenticación)
- `DELETE /products/:id` - Eliminar un producto (requiere autenticación)

### Categorías

- `GET /categories` - Listar todas las categorías
- `GET /categories/:id` - Obtener una categoría por ID
- `POST /categories` - Crear una nueva categoría (requiere autenticación)
- `PATCH /categories/:id` - Actualizar una categoría (requiere autenticación)
- `DELETE /categories/:id` - Eliminar una categoría (requiere autenticación)

### Proveedores

- `GET /suppliers` - Listar todos los proveedores
- `GET /suppliers/:id` - Obtener un proveedor por ID
- `POST /suppliers` - Crear un nuevo proveedor (requiere autenticación)
- `PATCH /suppliers/:id` - Actualizar un proveedor (requiere autenticación)
- `DELETE /suppliers/:id` - Eliminar un proveedor (requiere autenticación)

## Testing

El proyecto incluye:

- Tests unitarios para los servicios
- Tests de integración para los endpoints principales

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

El proyecto está configurado con Jest para las pruebas unitarias y de integración.

```bash
# Ejecutar pruebas unitarias
$ npm run test

# Ejecutar pruebas end-to-end
$ npm run test:e2e

# Generar informe de cobertura
$ npm run test:cov
```

Los archivos de prueba están organizados de la siguiente manera:

- `*.spec.ts`: Pruebas unitarias de servicios
- `*.integration.spec.ts`: Pruebas de integración para endpoints

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
