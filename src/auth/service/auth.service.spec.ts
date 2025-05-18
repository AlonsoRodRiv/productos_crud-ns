import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entity/user.entity';

// Mock para bcrypt
jest.mock('bcrypt', () => ({
  compare: jest
    .fn()
    .mockImplementation((password, hash) =>
      Promise.resolve(password === 'password123'),
    ),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        email: 'test@example.com',
        roles: ['user'],
      };

      mockUserService.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser('testuser', 'password123');
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
      });
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
    });

    it('should return null when user does not exist', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        email: 'test@example.com',
        roles: ['user'],
      };

      mockUserService.findByUsername.mockResolvedValue(user);

      // El mock de bcrypt.compare devolverá false para cualquier contraseña diferente a 'password123'
      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a JWT token', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
      };

      const result = await service.login(user);

      expect(result).toEqual({
        access_token: 'mocked-jwt-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
        roles: ['user'],
      });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      const createdUser: User = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedPassword',
        roles: ['user'],
      };

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        roles: ['user'],
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
