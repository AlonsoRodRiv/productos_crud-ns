import { UserService } from './../../users/service/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Find the user by username using the user service
    const user = await this.userService.findByUsername(username);

    // If user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Return user without password
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Let the UserService handle the user creation including password hashing
    const user = await this.userService.create(createUserDto);

    // Return user without password for security
    const { password, ...result } = user;
    return result;
  }
}
