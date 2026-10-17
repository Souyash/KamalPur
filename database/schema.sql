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
  `img_url` MEDIUMTEXT NOT NULL,
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
  `img_url` MEDIUMTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial Artists
INSERT INTO `artists` (`name`, `craft`, `region`, `era_tag`, `avatar_initials`, `bio`, `tradition`, `accolades`, `creations`, `philosophy`, `img_url`) VALUES
('Nitish Munshi', 'Master Sculptor & Chief Idol Artist (প্রধান প্রতিমা শিল্পী)', 'Nadia & Kumartuli Tradition · Maa Durga Pratima Shilpi', '2026 Theme Idol', 'NM', 'Acclaimed master sculptor and idol artisan Nitish Munshi breathes transcendent spiritual majesty and emotional depth into sacred clay. For Kamalpur Abhijan Sangha''s historic 2026 Durgotsav under the theme \"গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ\", Sri Nitish Munshi leads the sculpting of the sanctum''s divine Maa Durga Mahishasuramardini pratima and sacred forms, weaving classical Shastric clay modeling, sacred Ganga silt, and evocative devotional expression.', 'Sacred Clay Modeling, Shastric Iconography & Chokkhu Daan Artistry', 'Lead Idol Artisan for 2026 Theme', '117 Forms Sanctum Idols, Mahishasuramardini, Navadurga Sculptural Iconography', '\"প্রতিমা শুধু মাটির রূপ নয়, মায়ের প্রতি ভক্ত হৃদয়ের নিখাদ ভক্তি আর অনুভবের দৃশ্যমান প্রকাশ। Chokkhu Daan is the supreme moment when clay awakens into divinity, blessing every soul that bows before Her.\"', 'assets/artist-nitish-munshi-avatar.jpg'),
('Sanjit Sarkar', 'Master Sculptor & Idol Artisan (প্রতিমা শিল্পী ও মৃৎশিল্পী)', 'Nadia & Bengal Artisan Guild · Maa Durga Pratima Shilpi', '2026 Theme Idol', 'SS', 'Esteemed master sculptor and idol artisan Sanjit Sarkar is dedicated to the classical art of Bengal clay iconography. For Kamalpur Abhijan Sangha''s 2026 landmark Durgotsav centering on \"গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ\", Sri Sanjit Sarkar sculpts sacred representations of the divine mother, combining pure alluvial Ganga clay, anatomical perfection, and spiritual facial ornamentation.', 'Sacred Clay Modeling, Traditional Straw Binding & Divine Visage', 'Lead Idol Artisan for 2026 Theme', '117 Forms Sanctum Idols, Mahishasuramardini & Scriptural Iconography', '\"মাটির প্রতিটি ছোঁয়ায় ভক্তি আর নিষ্ঠা মিশে থাকে। মায়ের প্রসন্ন রূপ ফুটিয়ে তোলাই আমাদের পরম সাধনা।\"', 'assets/artist-sanjit-sarkar-avatar.jpg'),
('Apurba Ray', 'Master Artist & Thematic Sculptor (মন্ডপ ও রূপসজ্জা শিল্পী)', 'Nadia & Bengal Art Studio · রূপসজ্জা ও থিম শিল্পী', '2026 Theme Artisan', 'AR', 'Master artist Apurba Ray is renowned for his mastery over thematic sacred spatial aesthetics, environmental ornamentation, and classical Bengal artistic craftsmanship. For Kamalpur Abhijan Sangha''s 2026 landmark celebration of \"গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ\", Sri Apurba Ray orchestrates the atmospheric ornamentation and sanctum artistic installations that elevate the devotee''s spiritual journey into the ancient cave sanctum of the Adi Shakti.', 'Thematic Space Design, Bengal Clay & Sanctum Artistry', '2026 Theme Master Artisan & Spatial Designer', 'Sanctum Ambience & Aesthetic Ornamentation of 117 Durga Forms', '\"শিল্প যেখানে ভক্তির রূপ ধারণ করে, সেখানেই সৃষ্টি সার্থক হয়। মায়ের অপরূপ রূপসজ্জায় আমাদের পরম নিষ্ঠা।\"', 'assets/artist-apurba-ray-avatar.jpg'),
('Proshanto Roy', 'Master Artisan & Thematic Sculptor (প্রতিমা ও রূপসজ্জা শিল্পী)', 'Nadia & Bengal Artisan Guild · থিম ও প্রতিমা শিল্পী', '2026 Theme Artisan', 'PR', 'Dedicated artisan and sculptor Proshanto Roy co-creates the profound sculptural majesty and sacred cave atmosphere for our historic 2026 Durgotsav presentation \"গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ\". Through exquisite clay modeling and thematic detailing, Sri Proshanto Roy manifests the timeless spiritual grace of the divine Mother.', 'Sacred Clay Modeling, Sculptural Detailing & Thematic Artistry', '2026 Theme Master Artisan & Sculptor', 'Thematic Sculpture & Sacred Sanctum Forms for 117 Durga Manifestations', '\"শিল্প যেখানে ভক্তির রূপ ধারণ করে, মায়ের আশীর্বাদে সেই সৃষ্টি জীবন্ত হয়ে ওঠে।\"', 'assets/artist-proshanto-roy-avatar.jpg'),
('Ananda Paul', 'Master Sculptor & Idol Artisan (মৃৎশিল্পী ও প্রতিমা রূপকার)', 'Nadia & Kumartuli Tradition · মৃৎ ও প্রতিমা শিল্পী', '2026 Theme Idol', 'AP', 'Esteemed master clay sculptor Ananda Paul brings generations of traditional Bengal Kumbhakar mastery to Kamalpur Abhijan Sangha''s 2026 landmark celebration \"গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ\". Sculpting divine Shastric idols from pure sacred silt and straw bindings, Sri Ananda Paul shapes the transcendent expressions of Devi Durga.', 'Sacred Clay Modeling, Straw Binding & Divine Visage', '2026 Theme Master Artisan & Sculptor', 'Sacred Durga Pratima & Iconographic Forms for 117 Durga Forms', '\"মাটির অঙ্গে প্রাণ প্রতিষ্ঠা করাই আমাদের বংশপরম্পরার সাধনা। মায়ের স্নেহময়ী ও তেজস্বী রূপ ফুটিয়ে তোলাতেই সার্থকতা।\"', 'assets/artist-ananda-paul-avatar.jpg'),
('Pradip Rudra Pal', 'Chief Clay Sculptor & Idol Architect', 'Kumartuli, North Kolkata · 4th Gen Dynasty', '2005 – 2026', 'PR', 'Fourth-generation inheritor of the legendary Kumartuli clay sculpting dynasty, Pradip Rudra Pal has spent over 35 years sculpting divine forms for Bengal premier pujas. At Kamalpur Abhijan Sangha, he conceptualized and hand-sculpted the monumental 117 scriptural forms of Devi Durga, marrying traditional Ganga silt clay with classical Sanskrit iconography.', 'Ganga Clay, Straw Binding & Classical Ekchala / Dhaaker Saaj', '7x Biswakarma Shilpa Puraskar, Asian Paints Sharad Shamman (2018, 2022)', '117 Forms Sanctum, 108 Durga Avatar Darshan, Mahishasuramardini', '"Maa Durga is not mere clay and straw. She is the living mother of Bengal. Each layer of Ganga soil carries centuries of prayer, awakening the divine shakti in every devotee who enters our mandap."', ''),
('Susanta Ray & Subrata Dey', 'Pandal Architects & Spatial Designers', 'Kolkata & Ranaghat · Thematic Spatial Studio', '2012 – 2026', 'SR', 'Celebrated architectural visionaries of Bengal contemporary Puja movement, Ray & Dey specialize in massive sustainable installations crafted purely from bamboo, terracotta tiles, Dokra brass accents, and handmade jute fabric. For our 2026 Durgotsav, they engineered the awe-inspiring 80 interconnected temple pavilions across 45,000 square feet.', 'Nadia Bamboo, Terracotta Relief Tiles, Dokra Brass, Organic Jute', 'Bengal Thematic Pandal Excellence Award (2024), Nadia Heritage Trophy', '80 Temple Sanctum Complex, Terracotta Whispering Corridor, Vedic Dome', 'Zero synthetic plastics, sustainable architecture, over 65,000 seasoned bamboo poles.', ''),
('Babu Pal & Sridam Das', 'Chandannagar Illumination Engineers', 'Chandannagar, Hooghly · Lighting Guild Maestros', '1994 – Present', 'BP', 'Carrying forward Chandannagar legendary lighting heritage for 32 continuous years, Babu Pal and Sridam Das design the iconic 1.5-kilometer illuminated grand avenue from Ranaghat Station to the Sangha grounds. Their kinetic computerized arches depict animated mythological sequences from the Ramayana, Mahishasuramardini, and Bengal heritage.', 'Kinetic 3D LED Arches, Microcontroller Storyboard Illumination', 'Chandannagar Light Master Guild Gold Medal (2016, 2023)', '1.5 km Station Boulevard Gate, Dancing Peacock 3D Arch, Cosmic Chariot', 'Over 250,000 smart LEDs with dedicated green generator safety grid.', ''),
('Gokul Das & Motilal Troupe', 'Traditional Dhak Maestros & Percussion Ensemble', 'Murshidabad & Ranaghat · 60-Member Ensemble', '1988 – Present', 'GD', 'No Durga Puja in Bengal breathes without the thunderous resonance of the sacred Dhak. Leading a synchronized 60-member artisan percussion ensemble, Ustad Gokul Das and Motilal Das create the rhythmic heart of our Sharodotsav, welcoming Maa Durga from Mahalaya morning to the solemn tears of Vijaya Dashami.', 'Bengal Mango Wood Dhak, Brass Kanshi & Sanctum Shankha Ensemble', 'State Folk Percussion Honors (2014), Nadia Cultural Heritage Award', 'Mahalaya Bodhon Beats, Sandhi Puja 108 Dhak Aarati, Dashami Bhasan', '"The Dhak does not create sound; it summons the soul. When 60 dhaks strike in unison at Sandhi Puja, you feel the heartbeat of Bengal."', ''),
('Maniklal Chitrakar', 'Bengal Pata Chitra & Folk Scroll Murals', 'Naya, Pingla, Paschim Medinipur · Patua Guild', '2016 – 2026', 'MC', 'A celebrated master of Bengal ancient Patachitra scroll painting tradition, Maniklal Chitrakar uses exclusively hand-ground organic pigments derived from teak leaves, turmeric, crushed conch shells, and Aparajita flower petals. His massive narrative murals narrate Devi Mahatmya hymns and traditional village folklore.', 'Organic Vegetable & Mineral Dyes on Handcrafted Cloth-Paper Scrolls', 'West Bengal State Master Craftsperson Award (2019)', 'Devi Mahatmya 100-foot mural gallery, Navadurga Folk Scroll cycle', 'Preserving endangered rural Bengal talas & organic mineral pigments.', ''),
('Pt. Debojyoti Banerjee & Swapan Chakraborty', 'Sacred Soundscape & Theme Music Composers', 'Ranaghat & Nadia · Acoustic Heritage Center', '2008 – Present', 'DB', 'Acclaimed classical musicians and acoustic soundscape designers, Pandit Debojyoti Banerjee (sitar & sarod) and Swapan Chakraborty (choral arrangement) compose the custom atmospheric score for Kamalpur Abhijan Sangha every autumn. Blending pure Raag Bhairav, Shankha calls, and Vedic Chandi stotrams.', 'Classical Indian Ragas, Sanskrit Vedic Stotrams & Spatial Ambient Acoustic', 'Nadia Classical Music Academy Honors (2020)', 'The 117 Devi Hymn Symphony, Dawn Bodhon Raga, Evening Arati Choir', 'Multi-zone 3D spatial acoustic sound field with zero harsh frequencies.', '');

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

