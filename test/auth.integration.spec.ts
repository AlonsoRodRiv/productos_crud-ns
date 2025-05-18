import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/service/auth.service';
import { UserService } from '../src/users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entity/user.entity';
import { DatabaseModule } from '../src/database/database.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService Integration Test', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let testUser;
  let uniqueSuffix: string;

  beforeAll(async () => {
    uniqueSuffix = Date.now().toString();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET') || 'test-secret-key',
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [AuthService, UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    // Creamos datos para las pruebas
    testUser = {
      username: `testuser_${uniqueSuffix}`,
      email: `test_${uniqueSuffix}@example.com`,
      password: 'testpassword123',
    };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = testUser;

    const registeredUser = await authService.register(createUserDto);

    expect(registeredUser).toBeDefined();
    expect(registeredUser.username).toBe(testUser.username);
    expect(registeredUser.email).toBe(testUser.email);
    expect(registeredUser.id).toBeDefined();

    // Los roles deben ser asignados correctamente
    expect(registeredUser.roles).toContain('user');
  });

  it('should validate user with correct credentials', async () => {
    const validatedUser = await authService.validateUser(
      testUser.username,
      testUser.password,
    );

    expect(validatedUser).toBeDefined();
    expect(validatedUser.username).toBe(testUser.username);
    expect(validatedUser.email).toBe(testUser.email);
    // No debería contener la contraseña
    expect(validatedUser.password).toBeUndefined();
  });

  it('should not validate user with incorrect credentials', async () => {
    const validatedUser = await authService.validateUser(
      testUser.username,
      'wrong-password',
    );

    expect(validatedUser).toBeNull();
  });

  it('should not validate non-existent user', async () => {
    const validatedUser = await authService.validateUser(
      'nonexistent-user',
      'some-password',
    );

    expect(validatedUser).toBeNull();
  });

  it('should generate a JWT token on login', async () => {
    const validatedUser = await authService.validateUser(
      testUser.username,
      testUser.password,
    );

    const loginResult = await authService.login(validatedUser);

    expect(loginResult).toBeDefined();
    expect(loginResult.access_token).toBeDefined();

    // Verificar que el token es válido y contiene la información correcta
    const decoded = jwtService.verify(loginResult.access_token);
    expect(decoded).toBeDefined();
    expect(decoded.username).toBe(testUser.username);
    expect(decoded.sub).toBe(validatedUser.id);
    expect(decoded.roles).toEqual(validatedUser.roles);
  });
});
