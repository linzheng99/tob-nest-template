import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateData1726755901264 implements MigrationInterface {
  name = 'UpdateData1726755901264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`external\``);
    await queryRunner.query(
      `DELETE FROM \`menu\` WHERE \`id\` IN (36, 37, 38);`,
    );
    await queryRunner.query(
      `ALTER TABLE \`menu\` ADD \`external\` varchar(255) NULL`,
    );
    await queryRunner.query(
      "INSERT INTO `menu` VALUES (36,'2024-09-19 15:48:23.141000','2024-09-19 08:06:57.000000',1,1,0,NULL,'','Nest服务仓库地址','LAYOUT','{\"icon\": \"ph:link-bold\", \"title\": \"Nest服务仓库地址\"}',NULL,3,NULL,'https://github.com/linzheng99/tob-nest-template'),(37,'2024-09-19 16:02:03.213000','2024-09-19 08:06:51.000000',1,1,0,NULL,'','Web服务仓库地址','LAYOUT','{\"icon\": \"ph:link-bold\", \"title\": \"Web服务仓库地址\"}',NULL,4,NULL,'https://github.com/linzheng99/tob-front-end-template'),(38,'2024-09-19 16:09:51.522000','2024-09-19 08:10:27.000000',1,1,0,NULL,NULL,'Web文档地址','LAYOUT','{\"icon\": \"ph:link-bold\", \"title\": \"Web文档地址\"}',NULL,5,NULL,'https://linzheng99.github.io/tob-docs-site/')",
    );
    await queryRunner.query(
      'INSERT INTO `role_menus` VALUES (1,36),(1,37),(1,38);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`external\``);
  }
}
