-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-sautheuhz.alwaysdata.net
-- Generation Time: Nov 19, 2021 at 04:32 PM
-- Server version: 10.5.11-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sautheuhz_bdd`
--

-- --------------------------------------------------------

--
-- Table structure for table `Clients`
--

CREATE TABLE `Clients` (
  `clients_id` int(11) NOT NULL,
  `idMutuelle` int(11) NOT NULL,
  `clients_noSS` varchar(13) NOT NULL,
  `clients_nom` varchar(50) NOT NULL,
  `clients_prenom` varchar(50) NOT NULL,
  `clients_sexe` varchar(1) NOT NULL,
  `clients_dateNaissance` date NOT NULL,
  `clients_tel` int(11) NOT NULL,
  `clients_mail` varchar(50) NOT NULL,
  `clients_adresse` varchar(50) NOT NULL,
  `clients_ville` varchar(50) NOT NULL,
  `clients_cp` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Clients`
--

INSERT INTO `Clients` (`clients_id`, `idMutuelle`, `clients_noSS`, `clients_nom`, `clients_prenom`, `clients_sexe`, `clients_dateNaissance`, `clients_tel`, `clients_mail`, `clients_adresse`, `clients_ville`, `clients_cp`) VALUES
(29, 2, '3333333333333', 'TEST', 'MEDOC', 'M', '2021-11-11', 666666666, 'mailfictig@comptetest.COM', '8 rue du test', 'MEDICAMENT', '75222');

-- --------------------------------------------------------

--
-- Table structure for table `Medecins`
--

CREATE TABLE `Medecins` (
  `Medecins_id` int(11) NOT NULL,
  `Medecins_noOrdre` int(11) NOT NULL,
  `Medecins_nom` varchar(50) NOT NULL,
  `Medecins_prenom` varchar(50) NOT NULL,
  `Medecins_tel` int(11) NOT NULL,
  `Medecins_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



--
-- Table structure for table `Medicaments`
--

CREATE TABLE `Medicaments` (
  `Medicaments_id` int(11) NOT NULL,
  `Medicaments_libelle` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `Mutuelles`
--

CREATE TABLE `Mutuelles` (
  `Mutuelles_id` int(11) NOT NULL,
  `Mutuelles_nom` varchar(50) NOT NULL,
  `Mutuelles_tel` int(10) NOT NULL,
  `Mutuelles_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
------------------------------------

--
-- Table structure for table `Ordonnances`
--

CREATE TABLE `Ordonnances` (
  `Ordonnances_id` int(11) NOT NULL,
  `idPath` int(11) NOT NULL,
  `idMedecin` int(11) NOT NULL,
  `idClient` int(11) NOT NULL,
  `Ordonnances_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Ordonnances`
--

INSERT INTO `Ordonnances` (`Ordonnances_id`, `idPath`, `idMedecin`, `idClient`, `Ordonnances_date`) VALUES
(0, 2, 1, 29, '2021-11-12')
-- --------------------------------------------------------

--
-- Table structure for table `Pathologies`
--

CREATE TABLE `Pathologies` (
  `Pathologies_id` int(11) NOT NULL,
  `Pathologies_libelle` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `Prescriptions`
--

CREATE TABLE `Prescriptions` (
  `Prescriptions_id` int(11) NOT NULL,
  `idOrdo` int(11) NOT NULL,
  `idMedicament` int(11) NOT NULL,
  `Prescriptions_quantite` int(11) NOT NULL,
  `Prescriptions_frequence` int(3) NOT NULL,
  `Prescriptions_dateFin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `Stocks`
--

CREATE TABLE `Stocks` (
  `Stocks_id` int(11) NOT NULL,
  `idMedicament` int(11) NOT NULL,
  `Stocks_quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Indexes for table `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`clients_id`);

--
-- Indexes for table `Employes`
--
ALTER TABLE `Employes`
  ADD PRIMARY KEY (`Employes_id`);

--
-- Indexes for table `Medecins`
--
ALTER TABLE `Medecins`
  ADD PRIMARY KEY (`Medecins_id`);

--
-- Indexes for table `Medicaments`
--
ALTER TABLE `Medicaments`
  ADD PRIMARY KEY (`Medicaments_id`);

--
-- Indexes for table `Mutuelles`
--
ALTER TABLE `Mutuelles`
  ADD PRIMARY KEY (`Mutuelles_id`);

--
-- Indexes for table `Ordonnances`
--
ALTER TABLE `Ordonnances`
  ADD PRIMARY KEY (`Ordonnances_id`);

--
-- Indexes for table `Pathologies`
--
ALTER TABLE `Pathologies`
  ADD PRIMARY KEY (`Pathologies_id`);

--
-- Indexes for table `Prescriptions`
--
ALTER TABLE `Prescriptions`
  ADD PRIMARY KEY (`Prescriptions_id`);

--
-- Indexes for table `Stocks`
--
ALTER TABLE `Stocks`
  ADD PRIMARY KEY (`Stocks_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `clients_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `Employes`
--
ALTER TABLE `Employes`
  MODIFY `Employes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Medecins`
--
ALTER TABLE `Medecins`
  MODIFY `Medecins_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Medicaments`
--
ALTER TABLE `Medicaments`
  MODIFY `Medicaments_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `Mutuelles`
--
ALTER TABLE `Mutuelles`
  MODIFY `Mutuelles_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Ordonnances`
--
ALTER TABLE `Ordonnances`
  MODIFY `Ordonnances_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `Pathologies`
--
ALTER TABLE `Pathologies`
  MODIFY `Pathologies_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Prescriptions`
--
ALTER TABLE `Prescriptions`
  MODIFY `Prescriptions_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `Stocks`
--
ALTER TABLE `Stocks`
  MODIFY `Stocks_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
