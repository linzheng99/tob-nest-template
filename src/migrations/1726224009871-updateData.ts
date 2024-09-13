import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateData1726224009871 implements MigrationInterface {
  name = 'UpdateData1726224009871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `roles` VALUES (1,'2024-09-08 18:25:27.000000','2024-09-12 15:16:54.000000','super','超级管理员'),(9,'2024-09-08 18:26:25.000000','2024-09-08 18:26:25.000000','admin','管理员'),(10,'2024-09-08 18:26:33.000000','2024-09-08 18:26:33.000000','test','测试');",
    );
    await queryRunner.query(
      "INSERT INTO `users`(`id`,`created_at`,`updated_at`,`username`,`password`,`nick_name`,`email`,`isFrozen`) VALUES(1, '2024-09-12 23:33:23.658000', '2024-09-12 23:33:23.658000', 'root', 'e10adc3949ba59abbe56e057f20f883e', '超级管理员', NULL, 0); ",
    );
    await queryRunner.query('INSERT INTO `user_roles` VALUES (1,1)');
    await queryRunner.query(
      "INSERT INTO `menu`(`id`,`created_at`,`updated_at`,`create_by`,`update_by`,`parent_id`,`path`,`name`,`component`,`meta`,`redirect`,`permission`,`type`,`order_no`) VALUES (4,'2024-09-04 06:42:22.000000','2024-09-04 06:42:22.000000',3,5,NULL,'/system','System','LAYOUT','{\"icon\": \"material-symbols:settings-rounded\", \"title\": \"系统配置\"}','/system/accounts',NULL,0,0),(6,'2024-09-04 06:52:56.000000','2024-09-04 06:52:56.000000',3,5,4,'/system/roles','Roles','/system/roles/index.vue','{\"icon\": \"eos-icons:role-binding\", \"title\": \"角色管理\"}',NULL,NULL,1,1),(8,'2024-09-04 06:54:14.000000','2024-09-04 06:54:14.000000',3,5,4,'/system/menu','Menu','/system/menu/index.vue','{\"icon\": \"dashicons:networking\", \"title\": \"菜单管理\"}',NULL,NULL,1,2),(9,'2024-09-04 23:11:14.000000','2024-09-12 15:00:23.000000',3,5,NULL,'/components','Components','LAYOUT','{\"icon\": \"material-symbols:settings-rounded\", \"title\": \"组件\"}','/components/table',NULL,0,1),(10,'2024-09-04 15:13:41.000000','2024-09-04 15:13:41.000000',3,5,9,'/components/table','Table','/components/table/index.vue','{\"icon\": \"tabler:article\", \"title\": \"表格Table\"}',NULL,NULL,1,0),(14,'2024-09-05 16:05:10.000000','2024-09-05 16:05:10.000000',3,5,9,'/components/form','Form','/components/form/index.vue','{\"icon\": \"fluent:form-48-filled\", \"title\": \"表单Form\"}',NULL,NULL,1,1),(20,'2024-09-05 21:25:13.000000','2024-09-05 21:25:13.000000',3,5,9,'/components/loadingEmpty','LoadingEmpty','/components/loadingEmptyWrapper/index.vue','{\"icon\": \"hugeicons:loading-01\", \"title\": \"加载状态loadingEmpty\"}',NULL,NULL,1,3),(23,'2024-09-06 00:38:12.000000','2024-09-06 00:38:12.000000',3,5,4,'/system/accounts','Accounts','/system/accounts/index.vue','{\"icon\": \"mdi:account-group\", \"title\": \"账号管理\"}',NULL,NULL,1,0),(31,'2024-09-11 14:44:00.829000','2024-09-11 14:44:00.829000',5,NULL,6,NULL,NULL,NULL,'{\"title\": \"新增\"}',NULL,'system:role:create',2,0),(32,'2024-09-11 15:34:20.658000','2024-09-12 15:04:12.000000',5,5,6,NULL,NULL,NULL,'{\"title\": \"删除\"}',NULL,'system:role:delete',2,2),(33,'2024-09-11 16:20:43.072000','2024-09-12 15:04:16.000000',5,5,6,NULL,NULL,NULL,'{\"title\": \"更新\"}',NULL,'system:role:update',2,1);",
    );
    await queryRunner.query(
      'INSERT INTO `role_menus` VALUES (1,4),(1,6),(1,8),(1,9),(1,10),(1,14),(1,20),(1,23),(1,31),(1,32),(1,33),(9,4),(9,6),(9,8),(9,9),(9,10),(9,14),(9,20),(9,23),(9,31),(9,32),(9,33),(10,4),(10,6),(10,8),(10,23),(10,31),(10,32),(10,33);',
    );
  }

  public async down(): Promise<void> {}
}
