-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: tob_nest_template
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  `type` tinyint NOT NULL DEFAULT '0',
  `parent_id` int DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `component` varchar(255) DEFAULT NULL,
  `meta` json NOT NULL,
  `redirect` varchar(255) DEFAULT NULL,
  `order_no` int DEFAULT '0',
  `permission` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (4,'2024-09-04 06:42:22.000000','2024-09-04 06:42:22.000000',3,5,0,NULL,'/system','System','LAYOUT','{\"icon\": \"material-symbols:settings-rounded\", \"title\": \"系统配置\"}','/system/accounts',0,NULL),(6,'2024-09-04 06:52:56.000000','2024-09-04 06:52:56.000000',3,5,1,4,'/system/roles','Roles','/system/roles/index.vue','{\"icon\": \"eos-icons:role-binding\", \"title\": \"角色管理\"}',NULL,1,NULL),(8,'2024-09-04 06:54:14.000000','2024-09-04 06:54:14.000000',3,5,1,4,'/system/menu','Menu','/system/menu/index.vue','{\"icon\": \"dashicons:networking\", \"title\": \"菜单管理\"}',NULL,2,NULL),(9,'2024-09-04 23:11:14.000000','2024-09-12 15:00:23.000000',3,5,0,NULL,'/components','Components','LAYOUT','{\"icon\": \"material-symbols:settings-rounded\", \"title\": \"组件\"}','/components/table',1,NULL),(10,'2024-09-04 15:13:41.000000','2024-09-04 15:13:41.000000',3,5,1,9,'/components/table','Table','/components/table/index.vue','{\"icon\": \"tabler:article\", \"title\": \"表格Table\"}',NULL,0,NULL),(14,'2024-09-05 16:05:10.000000','2024-09-05 16:05:10.000000',3,5,1,9,'/components/form','Form','/components/form/index.vue','{\"icon\": \"fluent:form-48-filled\", \"title\": \"表单Form\"}',NULL,1,NULL),(20,'2024-09-05 21:25:13.000000','2024-09-05 21:25:13.000000',3,5,1,9,'/components/loadingEmpty','LoadingEmpty','/components/loadingEmptyWrapper/index.vue','{\"icon\": \"hugeicons:loading-01\", \"title\": \"加载状态loadingEmpty\"}',NULL,3,NULL),(23,'2024-09-06 00:38:12.000000','2024-09-06 00:38:12.000000',3,5,1,4,'/system/accounts','Accounts','/system/accounts/index.vue','{\"icon\": \"mdi:account-group\", \"title\": \"账号管理\"}',NULL,0,NULL),(31,'2024-09-11 14:44:00.829000','2024-09-11 14:44:00.829000',5,NULL,2,6,NULL,NULL,NULL,'{\"title\": \"新增\"}',NULL,0,'system:role:create'),(32,'2024-09-11 15:34:20.658000','2024-09-12 15:04:12.000000',5,5,2,6,NULL,NULL,NULL,'{\"title\": \"删除\"}',NULL,2,'system:role:delete'),(33,'2024-09-11 16:20:43.072000','2024-09-12 15:04:16.000000',5,5,2,6,NULL,NULL,NULL,'{\"title\": \"更新\"}',NULL,1,'system:role:update');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_menus`
--

DROP TABLE IF EXISTS `role_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_menus` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `IDX_cec0c62317111ac45c9c295d22` (`role_id`),
  KEY `IDX_4c7c7bd4eb8a33aece58434cbf` (`menu_id`),
  CONSTRAINT `FK_4c7c7bd4eb8a33aece58434cbf5` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_cec0c62317111ac45c9c295d226` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_menus`
--

LOCK TABLES `role_menus` WRITE;
/*!40000 ALTER TABLE `role_menus` DISABLE KEYS */;
INSERT INTO `role_menus` VALUES (1,4),(1,6),(1,8),(1,9),(1,10),(1,14),(1,20),(1,23),(1,31),(1,32),(1,33),(9,4),(9,6),(9,8),(9,9),(9,10),(9,14),(9,20),(9,23),(9,31),(9,32),(9,33),(10,4),(10,6),(10,31),(10,32),(10,33);
/*!40000 ALTER TABLE `role_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(20) NOT NULL COMMENT '角色名',
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_648e3f5447f725579d7d4ffdfb` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'2024-09-08 18:25:27.000000','2024-09-12 15:16:54.000000','super','超级管理员'),(9,'2024-09-08 18:26:25.000000','2024-09-08 18:26:25.000000','admin','管理员'),(10,'2024-09-08 18:26:33.000000','2024-09-13 16:06:09.000000','test','测试');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_87b8888186ca9769c960e92687` (`user_id`),
  KEY `IDX_b23c65e50a758245a33ee35fda` (`role_id`),
  CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,10);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL,
  `nick_name` varchar(50) NOT NULL COMMENT '昵称',
  `email` varchar(255) DEFAULT NULL,
  `isFrozen` tinyint NOT NULL DEFAULT '0' COMMENT '是否冻结',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2024-09-12 23:33:23.658000','2024-09-12 23:33:23.658000','root','e10adc3949ba59abbe56e057f20f883e','超级管理员',NULL,0),(2,'2024-09-14 00:05:15.326000','2024-09-14 00:05:15.326000','test','e10adc3949ba59abbe56e057f20f883e','测试',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-14 18:28:08
