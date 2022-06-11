import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //Check if email is in use

    const user = await this.userService.find(email);
    if (user.length) {
      throw new BadRequestException('email in use');
    }
    //hash the password
    //Generate salt
    const salt = randomBytes(8).toString('hex');
    //hash the salt and the password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //Create a new user and save it
    const newUser = await this.userService.create(email, result);

    //return user
    return newUser;
  }

  async signin(email: string, password: string) {
    //check if email exists

    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //split salt from the stored hash
    const [salt, storedHash] = user.password.split('.');

    //hash the salt with the incoming password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //compare hash with storedHash
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
