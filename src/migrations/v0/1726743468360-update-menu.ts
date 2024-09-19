import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMenu1726743468360 implements MigrationInterface {
  name = 'UpdateMenu1726743468360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE `menu` SET `external` = <{external: https://github.com/linzheng99/tob-nest-template }>WHERE `id` = 36',
    );
    await queryRunner.query(
      'UPDATE `menu` SET `external` = <{external: https://github.com/linzheng99/tob-front-end-template}> WHERE `id` = 37',
    );
    await queryRunner.query(
      'UPDATE `menu` SET `external` = <{external: https://github.com/linzheng99/tob-docs-site}> WHERE `id` = 38',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`external\``);
  }
}
