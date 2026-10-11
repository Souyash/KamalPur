-- ====================================================================
-- Kamalpur Abhijan Sangha — Official Database Schema
-- Compatible with Hostinger phpMyAdmin, MySQL 5.7+ & MariaDB 10.3+
-- ====================================================================

-- Note: When importing inside Hostinger phpMyAdmin, the database is already selected.
-- (If importing on empty local MySQL, uncomment the next two lines):
-- CREATE DATABASE IF NOT EXISTS `kamalpur_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `kamalpur_db`;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL DEFAULT 'Committee Officer',
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user: username 'admin', password 'admin123' (bcrypt hashed)
-- Fallback hash for admin123
INSERT INTO `admin_users` (`username`, `password_hash`, `full_name`, `role`)
VALUES ('admin', '$2y$10$e7QJt5fF0w5r4GgE0kH4CeC0/4H5A4d8G.gJ.4wK.y8G3k3uX9K.G', 'Central Executive Committee', 'superadmin')
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- 2. Gallery Posts Table
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Maha Protima',
  `year_tag` VARCHAR(50) NOT NULL DEFAULT '2025–2026',
  `desc_text` TEXT NOT NULL,
  `img_url` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial Gallery Posts
INSERT INTO `gallery` (`title`, `category`, `year_tag`, `desc_text`, `img_url`) VALUES
('117 Divine Forms of Durga', 'Maha Protima', '2025–2026', 'Monumental sanctum featuring 117 unique classical scriptural forms of Devi Durga sculpted from Ganga clay by master artisans of Kumartuli.', 'assets/durga-scene.jpg'),
('Terracotta & Bamboo Mandap Installation', 'Theme Architecture', '2025', 'Intricate hand-sculpted temple motifs, bamboo filigree, and sustainable artisan handicrafts adorning the main sanctum.', 'assets/durga-papercraft.jpg'),
('Chandannagar 3D Illumination Boulevard', 'Illumination Gate', 'Night View', '1.5 kilometers of computer-synchronized illuminated 3D LED arches lighting the grand approach from Ranaghat railway station.', 'assets/gallery/chandannagar-lights.jpg'),
('Maha Ashtami Sandhi Puja & 108 Pradip Aarati', 'Sacred Rituals', 'Maha Ashtami', 'Auspicious Sandhi Puja rituals performed with 108 blue lotuses, sacred clay lamps, and Vedic chants.', 'assets/gallery/sandhi-puja.jpg'),
('Vijaya Dashami Sindoor Khela & Shobhayatra', 'Vijaya Dashami', 'Farewell Seva', 'Joyous vermilion farewell to Maa Durga with traditional sweet offerings and Dhak beats by women devotee wing.', 'assets/gallery/sindoor-khela.jpg'),
('Maha Navami Dhunuchi Naach & Dhak Symphony', 'Percussion & Dance', 'Maha Navami', 'Spiritual performance with fragrant coconut-husk incense and thunderous rhythmic beats by our 60-member Dhaki troupe.', 'assets/gallery/dhunuchi-dance.jpg'),
('Free Mega Blood Donation Camp', 'Social Seva', 'Year-Round', 'Annual voluntary blood donation drive organized in association with Ranaghat Sub-Divisional Hospital Blood Bank.', 'assets/gallery/blood-donation.jpg'),
('Kamalpur Gold Cup Football Tournament', 'Youth Sports', 'Sports Meet', 'Our flagship 16-team knockout football championship fostering sportsmanship and youth athletics across Nadia.', 'assets/gallery/football-goldcup.jpg');

-- 3. Artists Table
CREATE TABLE IF NOT EXISTS `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `craft` VARCHAR(150) NOT NULL,
  `region` VARCHAR(150) NOT NULL,
  `era_tag` VARCHAR(100) NOT NULL DEFAULT '2005 – Present',
  `avatar_initials` VARCHAR(10) NOT NULL DEFAULT 'AR',
  `bio` TEXT NOT NULL,
  `tradition` VARCHAR(255) DEFAULT NULL,
  `accolades` VARCHAR(255) DEFAULT NULL,
  `creations` VARCHAR(255) DEFAULT NULL,
  `philosophy` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial Artists
INSERT INTO `artists` (`name`, `craft`, `region`, `era_tag`, `avatar_initials`, `bio`, `tradition`, `accolades`, `creations`, `philosophy`) VALUES
('Pradip Rudra Pal', 'Chief Clay Sculptor & Idol Architect', 'Kumartuli, North Kolkata · 4th Gen Dynasty', '2005 – 2026', 'PR', 'Fourth-generation inheritor of the legendary Kumartuli clay sculpting dynasty, Pradip Rudra Pal has spent over 35 years sculpting divine forms for Bengal premier pujas. At Kamalpur Abhijan Sangha, he conceptualized and hand-sculpted the monumental 117 scriptural forms of Devi Durga, marrying traditional Ganga silt clay with classical Sanskrit iconography.', 'Ganga Clay, Straw Binding & Classical Ekchala / Dhaaker Saaj', '7x Biswakarma Shilpa Puraskar, Asian Paints Sharad Shamman (2018, 2022)', '117 Forms Sanctum, 108 Durga Avatar Darshan, Mahishasuramardini', '"Maa Durga is not mere clay and straw. She is the living mother of Bengal. Each layer of Ganga soil carries centuries of prayer, awakening the divine shakti in every devotee who enters our mandap."'),
('Susanta Ray & Subrata Dey', 'Pandal Architects & Spatial Designers', 'Kolkata & Ranaghat · Thematic Spatial Studio', '2012 – 2026', 'SR', 'Celebrated architectural visionaries of Bengal contemporary Puja movement, Ray & Dey specialize in massive sustainable installations crafted purely from bamboo, terracotta tiles, Dokra brass accents, and handmade jute fabric. For our 2026 Durgotsav, they engineered the awe-inspiring 80 interconnected temple pavilions across 45,000 square feet.', 'Nadia Bamboo, Terracotta Relief Tiles, Dokra Brass, Organic Jute', 'Bengal Thematic Pandal Excellence Award (2024), Nadia Heritage Trophy', '80 Temple Sanctum Complex, Terracotta Whispering Corridor, Vedic Dome', 'Zero synthetic plastics, sustainable architecture, over 65,000 seasoned bamboo poles.'),
('Babu Pal & Sridam Das', 'Chandannagar Illumination Engineers', 'Chandannagar, Hooghly · Lighting Guild Maestros', '1994 – Present', 'BP', 'Carrying forward Chandannagar legendary lighting heritage for 32 continuous years, Babu Pal and Sridam Das design the iconic 1.5-kilometer illuminated grand avenue from Ranaghat Station to the Sangha grounds. Their kinetic computerized arches depict animated mythological sequences from the Ramayana, Mahishasuramardini, and Bengal heritage.', 'Kinetic 3D LED Arches, Microcontroller Storyboard Illumination', 'Chandannagar Light Master Guild Gold Medal (2016, 2023)', '1.5 km Station Boulevard Gate, Dancing Peacock 3D Arch, Cosmic Chariot', 'Over 250,000 smart LEDs with dedicated green generator safety grid.'),
('Gokul Das & Motilal Troupe', 'Traditional Dhak Maestros & Percussion Ensemble', 'Murshidabad & Ranaghat · 60-Member Ensemble', '1988 – Present', 'GD', 'No Durga Puja in Bengal breathes without the thunderous resonance of the sacred Dhak. Leading a synchronized 60-member artisan percussion ensemble, Ustad Gokul Das and Motilal Das create the rhythmic heart of our Sharodotsav, welcoming Maa Durga from Mahalaya morning to the solemn tears of Vijaya Dashami.', 'Bengal Mango Wood Dhak, Brass Kanshi & Sanctum Shankha Ensemble', 'State Folk Percussion Honors (2014), Nadia Cultural Heritage Award', 'Mahalaya Bodhon Beats, Sandhi Puja 108 Dhak Aarati, Dashami Bhasan', '"The Dhak does not create sound; it summons the soul. When 60 dhaks strike in unison at Sandhi Puja, you feel the heartbeat of Bengal."');

-- 4. Donations Ledger Table
CREATE TABLE IF NOT EXISTS `donations` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `address` VARCHAR(255) DEFAULT 'Ranaghat',
  `purpose` VARCHAR(150) NOT NULL DEFAULT 'Sharodotsav Durga Puja Chanda',
  `pan` VARCHAR(20) DEFAULT NULL,
  `utr` VARCHAR(100) DEFAULT 'WhatsApp Redirection',
  `status` ENUM('pending', 'verified') NOT NULL DEFAULT 'pending',
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial Donations
INSERT INTO `donations` (`id`, `name`, `phone`, `email`, `amount`, `address`, `purpose`, `pan`, `utr`, `status`, `date`) VALUES
('#KAS-2026-9241', 'Anirban Bhattacharya', '9830145678', 'anirban.b@gmail.com', 2501.00, 'Mission Para, Ranaghat, PIN 741201', 'Sharodotsav Durga Puja Chanda', 'ABCDB4321K', '429188231904', 'pending', NOW() - INTERVAL 2 HOUR),
('#KAS-2026-8819', 'Priyanka Sen', '9874561230', 'priyanka.sen@outlook.com', 5001.00, 'College Road, Ranaghat, PIN 741201', 'Maha Bhog & Prasad Annadan', '', '429177112049', 'verified', NOW() - INTERVAL 5 HOUR),
('#KAS-2026-7492', 'Sourav Ganguly', '9433120987', 'sourav.g@yahoo.com', 11000.00, 'Biswas Para, Ranaghat, PIN 741201', 'Youth Sports & Football Academy', 'AABCS9876P', '429155098231', 'verified', NOW() - INTERVAL 12 HOUR),
('#KAS-2026-6120', 'Dr. Debabrata Roy', '9836701234', 'droy.ranaghat@gmail.com', 501.00, 'Hospital More, Ranaghat, PIN 741201', 'Free Health & Blood Donation Seva', '', '429122340912', 'pending', NOW() - INTERVAL 1 DAY);

-- 5. Membership Applications Table
CREATE TABLE IF NOT EXISTS `members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'Ranaghat',
  `interest` VARCHAR(100) NOT NULL DEFAULT 'Puja & Cultural Wing',
  `message` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'reviewed') NOT NULL DEFAULT 'pending',
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial Members
INSERT INTO `members` (`id`, `name`, `phone`, `city`, `interest`, `message`, `status`, `date`) VALUES
('#MEM-2026-4412', 'Subhadip Chatterjee', '9831204921', 'Ranaghat', 'Puja & Cultural Wing', 'Eager to volunteer in Durgotsav pandal management and Pushpanjali prasad coordination.', 'pending', NOW() - INTERVAL 1 DAY),
('#MEM-2026-3981', 'Moumita Ghosh', '9732118804', 'Santipur', 'Social Welfare & Blood Camps', 'Registered nurse willing to provide healthcare support in free medical camps.', 'reviewed', NOW() - INTERVAL 2 DAY);

