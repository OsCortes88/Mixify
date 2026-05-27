-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
-- Generation Time: May 06, 2023 at 07:23 PM
-- Server version: 8.0.28
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yn6kb7l5l67h7m0i`
--

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `artistId` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `genre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `popularity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`artistId`, `name`, `genre`, `image`, `popularity`) VALUES
(1, 'Frank Ocean', 'lgbtq+ hip hop', 'https://i.scdn.co/image/ab6761610000e5ebfbc3faec4a370d8393bee7f1', 85),
(2, 'PARTYNEXTDOOR', 'r&b', 'https://i.scdn.co/image/ab6761610000e5eb4e3dee8baac75dad1fea791e', 78),
(3, 'Bo Burnham', 'comic', 'https://i.scdn.co/image/ab6761610000e5eb30d9a4acdf8cd3e8c0ad39ab', 71),
(4, 'Dinos', 'french hip hop', 'https://i.scdn.co/image/ab6761610000e5ebec87f79ebb6e54d7972949b0', 66),
(5, 'Brent Faiyaz', 'dmv rap', 'https://i.scdn.co/image/ab6761610000e5eb2749cce858c97642feda7a92', 83),
(6, 'Efecto Tequila', 'argentine heavy metal', 'https://i.scdn.co/image/ab6761610000e5eb4be1d345368e80646975bdd0', 4),
(7, 'Iron Maiden', 'hard rock', 'https://i.scdn.co/image/ab6761610000e5ebdc52c8e309e46aa8430a0fa0', 73);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`artistId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `artistId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
