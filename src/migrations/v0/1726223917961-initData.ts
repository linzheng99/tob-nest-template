import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1726223917961 implements MigrationInterface {
  name = 'InitData1726223917961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`menu\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`create_by\` int NULL COMMENT '创建者', \`update_by\` int NULL COMMENT '更新者', \`type\` tinyint NOT NULL DEFAULT '0', \`parent_id\` int NULL, \`path\` varchar(255) NULL, \`name\` varchar(255) NULL, \`component\` varchar(255) NULL, \`meta\` json NOT NULL, \`redirect\` varchar(255) NULL, \`order_no\` int NULL DEFAULT '0', \`permission\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(50) NOT NULL COMMENT '用户名', \`password\` varchar(255) NOT NULL, \`nick_name\` varchar(50) NOT NULL COMMENT '昵称', \`email\` varchar(255) NULL, \`isFrozen\` tinyint NOT NULL COMMENT '是否冻结' DEFAULT 0, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(20) NOT NULL COMMENT '角色名', \`remark\` varchar(255) NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`user_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_87b8888186ca9769c960e92687\` (\`user_id\`), INDEX \`IDX_b23c65e50a758245a33ee35fda\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_menus\` (\`role_id\` int NOT NULL, \`menu_id\` int NOT NULL, INDEX \`IDX_cec0c62317111ac45c9c295d22\` (\`role_id\`), INDEX \`IDX_4c7c7bd4eb8a33aece58434cbf\` (\`menu_id\`), PRIMARY KEY (\`role_id\`, \`menu_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_87b8888186ca9769c960e926870\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_b23c65e50a758245a33ee35fda1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_cec0c62317111ac45c9c295d226\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_4c7c7bd4eb8a33aece58434cbf5\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_4c7c7bd4eb8a33aece58434cbf5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_cec0c62317111ac45c9c295d226\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_b23c65e50a758245a33ee35fda1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_87b8888186ca9769c960e926870\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4c7c7bd4eb8a33aece58434cbf\` ON \`role_menus\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cec0c62317111ac45c9c295d22\` ON \`role_menus\``,
    );
    await queryRunner.query(`DROP TABLE \`role_menus\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b23c65e50a758245a33ee35fda\` ON \`user_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`menu\``);
  }
}
