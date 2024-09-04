import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { OperatorDto } from '../dto/operator.dto';
import { JwtUserData } from '@/modules/auth/guards/jwt-auth.guard';

@Injectable()
export class CreatorPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: OperatorDto) {
    const user = this.request.user as JwtUserData;

    value.createBy = user.userId;

    return value;
  }
}
