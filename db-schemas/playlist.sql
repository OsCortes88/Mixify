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
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `songId` varchar(300) NOT NULL,
  `title` varchar(500) NOT NULL,
  `artistId` int DEFAULT NULL,
  `preview` varchar(500) DEFAULT NULL,
  `albumImage` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist`
--

INSERT INTO `playlist` (`songId`, `title`, `artistId`, `preview`, `albumImage`) VALUES
('1C48kCtC6FXUhc0yoWAG7E', 'Hallowed Be Thy Name - Live At Estadio Nacional, Santiago', 7, 'https://p.scdn.co/mp3-preview/fb68f2f5f970663ff782846f7417494fca0eacf1?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b273dd04b6f53a7a6ec8996f8f84'),
('2c2tlXfEmLgUNvxngIi1qL', 'DEAD MAN WALKING', 5, 'https://p.scdn.co/mp3-preview/0254c84476373256060dc647bd5ba8d50e56ea94?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b27353aa764ce919d8aea07947b4'),
('2sXuaCbpqDXoJdZhkaj8zM', 'La Historia De Un Minuto', 6, NULL, 'https://i.scdn.co/image/ab67616d0000b27319b45d4d44c0416c092e3a6f'),
('2v9qAGaHNeejo7opM6YSLC', 'Rainmaker', 7, 'https://p.scdn.co/mp3-preview/c0ba1d2e38a69ad3aac301230a2ec2f8f6c7a05f?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b2734384ec4bdd4f6e777b83cdd9'),
('4CKhBJA0G3eqgyff3DaM5V', 'Microwave Popcorn', 3, 'https://p.scdn.co/mp3-preview/9edf0e9ff53f2d885d2dcef3c5a2dafa1ae28173?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b273b2c7ecf239a2b98e36e009d6'),
('50MhgV5PrQmCSuEELaYp9R', 'Comedy', 3, 'https://p.scdn.co/mp3-preview/e73b4eb71d671884b14a69be133f302378fa7782?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b27388fed14b936c38007a302413'),
('59biiIPxhjNizg6EKBC7ge', 'Par Amour', 4, NULL, 'https://i.scdn.co/image/ab67616d0000b273af09d950d28e289163448ab5'),
('5fEB6ZmVkg63GZg9qO86jh', 'Break from Toronto', 2, 'https://p.scdn.co/mp3-preview/89f708c823dc7d3827d2f063b9075b51ec47f446?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b273090b1f9557a6d23c0817bd88'),
('5olTHK5mUNmktCXafQNTTu', 'Stratego', 7, 'https://p.scdn.co/mp3-preview/1c42a90bb0e13945132fff8126a4cb4e458c796c?cid=1c095ce4357d431b9ea796ef8da2c1e2', 'https://i.scdn.co/image/ab67616d0000b273a349bce3098a0e7d64b040df');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`songId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
