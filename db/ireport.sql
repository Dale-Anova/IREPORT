-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2019 at 01:06 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ireport`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `course` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `course`, `email`, `password`) VALUES
(1, 'dale', 'dale', 'comsci', 'd@g.com', 'dale'),
(9, 'kamote', 'dale', 'comsci', 'd@g.com', 'dale'),
(10, 'writer', 'writer', 'comsci', 'd@g.com', 'dale'),
(11, 'asd', 'asd', 'comsci', 'd@g.com', 'dale'),
(12, 'qwe', 'qwe', 'comsci', 'd@g.com', 'dale'),
(13, 'love', 'love', 'comsci', 'd@g.com', 'dale'),
(14, 'cam', 'cam', 'comsci', 'd@g.com', 'dale'),
(15, 'rot', 'rot', 'comsci', 'd@g.com', 'dale'),
(16, 'ron', 'ron', 'comsci', 'd@g.com', 'dale'),
(17, 'lov', 'lov', 'comsci', 'd@g.com', 'dale');

-- --------------------------------------------------------

--
-- Table structure for table `user_blog`
--

CREATE TABLE `user_blog` (
  `uid` varchar(200) NOT NULL,
  `id` int(100) NOT NULL,
  `blog_title` varchar(255) NOT NULL,
  `blog_content` varchar(500) NOT NULL,
  `blog_creator` varchar(100) NOT NULL,
  `blog_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `blog_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_blog`
--

INSERT INTO `user_blog` (`uid`, `id`, `blog_title`, `blog_content`, `blog_creator`, `blog_created`, `blog_modified`, `status`) VALUES
('0', 2, 'sample title', 'sample content', 'dale', '2019-01-07 05:54:00', '2019-01-07 05:54:00', 1),
('0', 3, 'the dog', 'a domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking, howling, or whining voice. It is widely kept as a pet or for work or field sports.', 'dale', '2019-01-07 06:33:26', '2019-01-07 06:33:26', 1),
('0', 4, 'the cat', 'a small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws. It is widely kept as a pet or for catching mice, and many breeds have been developed.', 'dale', '2019-01-07 06:50:02', '2019-01-07 06:50:02', 1),
('0', 5, 'story title', 'story content\n', 'dale', '2019-01-07 07:43:58', '2019-01-07 07:43:58', 1),
('0', 6, 'asdfasf', 'gfdgbfjhnfgjh', 'dale', '2019-01-07 07:58:26', '2019-01-07 07:58:26', 1),
('5', 7, 'ascdas', 'avrarcax', 'dale', '2019-01-07 08:21:28', '2019-01-07 08:21:28', 1),
('0', 8, 'agfdsv34tv wfc', '3w4gt6v34tcfq34', 'dale', '2019-01-07 08:22:26', '2019-01-07 08:22:26', 1),
('3', 9, '5dfhb51dfh61sd', 'fg5jmfg65ngf1n', 'dale', '2019-01-07 08:24:55', '2019-01-07 08:24:55', 1),
('21763a03b50c67f', 10, 'awverwr', 'r32v235v23c', 'dale', '2019-01-07 08:26:18', '2019-01-07 08:26:18', 1),
('ce09a0706c7a806', 11, 'love someone', 'love someone\n', 'dale', '2019-01-07 09:17:24', '2019-01-07 09:17:24', 1),
('ab062d312088297', 12, 'blog title', 'blog contewnt', 'dale', '2019-01-07 09:22:18', '2019-01-07 09:22:18', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_blog`
--
ALTER TABLE `user_blog`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user_blog`
--
ALTER TABLE `user_blog`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
