-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: finanzas_familiares
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `inversiones`
--

DROP TABLE IF EXISTS `inversiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inversiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `cantidad` decimal(15,2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inversiones`
--

LOCK TABLES `inversiones` WRITE;
/*!40000 ALTER TABLE `inversiones` DISABLE KEYS */;
INSERT INTO `inversiones` VALUES (1,13,'inversion',5000.00,'2023-12-12','Nueva inversión'),(2,13,'accion',250.00,'2024-10-10','mmm');
/*!40000 ALTER TABLE `inversiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticker` varchar(10) DEFAULT NULL,
  `precio` decimal(15,2) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `comision` decimal(15,2) DEFAULT NULL,
  `categoria` enum('equitie','bond','on','cripto') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trades`
--

LOCK TABLES `trades` WRITE;
/*!40000 ALTER TABLE `trades` DISABLE KEYS */;
INSERT INTO `trades` VALUES (1,'MMM',10169.00,9,642.48,'equitie'),(2,'MMM',11291.00,-1,79.26,'equitie'),(3,'MMM',11311.00,-8,635.23,'equitie'),(4,'AAPL',10656.38,4,299.23,'equitie'),(5,'AAPL',10750.00,-4,301.86,'equitie'),(6,'JPM',19320.00,6,813.76,'equitie'),(7,'JMIA',11519.58,17,1374.75,'equitie'),(8,'JPM',19400.00,-6,817.13,'equitie'),(9,'JMIA',16750.00,-17,1998.95,'equitie'),(10,'BMA',6890.00,72,3482.48,'equitie'),(11,'BMA',5750.00,-72,2906.28,'equitie'),(12,'BMA',6500.00,72,3285.36,'equitie'),(13,'RUC6O',1140.82,17,98.70,'equitie'),(14,'YMCHO',807.52,28,115.07,'on'),(15,'IRCFO',1151.79,23,134.81,'on'),(16,'RUC6O',1075.90,233,1275.73,'on'),(17,'IRCFO',1289.90,-23,150.98,'on'),(18,'RUC6O',1205.90,-240,1472.84,'on');
/*!40000 ALTER TABLE `trades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `tipo` enum('ingreso','gasto') DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `fecha` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
INSERT INTO `transacciones` VALUES (1,1,'ingreso',1500.00,'Salario','Pago mensual','2024-09-21','2024-09-22 00:42:29'),(2,7,'gasto',200.50,'Transporte','Pasaje de autobús','2024-09-25','2024-09-22 15:53:24'),(4,13,'ingreso',1200.00,'Chamba','Entrego la cola','2024-09-24','2024-09-25 00:43:30'),(5,13,'gasto',500.00,'Deseos','Se compro una tanga','2024-09-24','2024-09-25 00:43:59'),(6,13,'ingreso',150.00,'Sueldo','Comfer','2024-10-02','2024-10-04 00:57:50'),(7,13,'ingreso',250.00,'Changa','Venta cola','2024-10-08','2024-10-08 02:02:10'),(8,13,'gasto',9500.00,'Deseo','Helado','2024-10-04','2024-10-08 02:10:30'),(9,22,'ingreso',3520.00,'Chamba','entrego la cola','2024-10-10','2024-10-09 00:02:03'),(10,22,'gasto',500.00,'deseo','pago una trola','2024-10-06','2024-10-09 00:03:00');
/*!40000 ALTER TABLE `transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verificado` tinyint(1) DEFAULT '0',
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan Perez','juanperez@example.com','miPasswordSegura','2024-09-22 00:42:19',0,NULL),(7,'Maria Gomez','mariagomez@example.com','$2a$10$NMO6ldiPjdidZ9hkAhFAu.tNIgTMOP9NcnkpoOPXINiuhbfu3p6vK','2024-09-22 03:23:54',0,NULL),(13,'Franco','franco.ferreres99@gmail.com','$2a$10$dJJT2kTMhr.oxROUTNMBT.iudeW.xrUxlMD3fpYXZ4vjiTVHoPZ/y','2024-09-24 01:27:34',1,'/uploads/1727554961940.jpg'),(22,'Hasstor','franco.wow.iv@gmail.com','$2a$10$3ce9gHJOJDMTN3hgPel1Rup4nTKYuXk9sAD/GDePhxkW08g1f/gDK','2024-10-06 18:11:21',1,'/uploads/1728238280630.jpg');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-09 23:02:17
