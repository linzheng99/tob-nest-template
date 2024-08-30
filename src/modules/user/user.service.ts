import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { md5 } from '@/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorEnum } from '@/constants/error-code.constant';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async register(dto: RegisterUserDto) {
    const exists = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (exists) throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

    const user = new User();
    user.username = dto.username;
    user.password = md5(dto.password);
    user.nickName = dto.nickName;
    user.email = dto.email;

    this.userRepository.save(user);
    return 'success';
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
    return 'success';
  }

  async findUserByUserName(username: string) {
    console.log(username);

    return await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
