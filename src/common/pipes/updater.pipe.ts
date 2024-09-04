import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { OperatorDto } from '../dto/operator.dto';
import { JwtUserData } from '@/modules/auth/guards/jwt-auth.guard';

@Injectable()
export class UpdaterPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: OperatorDto) {
    const user = this.request.user as JwtUserData;

    value.updateBy = user.userId;

    return value;
  }
}
