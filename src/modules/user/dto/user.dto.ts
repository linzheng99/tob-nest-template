import { PagerDto } from '@/common/dto/pager.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class UserQueryDto extends IntersectionType(
  PagerDto,
  PartialType(RegisterUserDto),
) {}
