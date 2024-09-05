import { ApiProperty } from '@nestjs/swagger';
import { MenuEntity } from './entities/menu.entity';

export class MenuItemInfo extends MenuEntity {
  @ApiProperty({ type: [MenuItemInfo] })
  children: MenuItemInfo[];
}
