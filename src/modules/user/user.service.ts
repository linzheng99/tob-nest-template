import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { md5 } from '@/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private repository: Repository<User>;

  register(user: CreateUserDto) {
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.nickName = user.nickName;

    this.repository.save(user);

    return '注册成功';
  }
}
