<?php
// ====================================================================
// KamalPur Sangha — Universal Database Connector
// Supports MySQL / phpMyAdmin with automatic SQLite local fallback
// ====================================================================

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration (Configured for Hostinger MySQL & phpMyAdmin)
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'u197762167_kamalpur';
$db_user = getenv('DB_USER') ?: 'u197762167_admin';
$db_pass = getenv('DB_PASS') ?: 'Kas#Ranaghat!9472';

$pdo = null;
$db_type = 'mysql';

// 1. Attempt MySQL Connection (phpMyAdmin)
try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    init_or_migrate_database($pdo, 'mysql');
} catch (PDOException $e) {
    // 2. Graceful Fallback to SQLite if MySQL is not running
    $db_type = 'sqlite';
    $data_dir = __DIR__ . '/../data';
    if (!is_dir($data_dir)) {
        @mkdir($data_dir, 0755, true);
    }
    $sqlite_file = $data_dir . '/kamalpur.sqlite';

    try {
        $pdo = new PDO("sqlite:" . $sqlite_file);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        init_or_migrate_database($pdo, 'sqlite');
    } catch (PDOException $ex) {
        echo json_encode([
            'success' => false,
            'error'   => 'Database connection failed: ' . $ex->getMessage()
        ]);
        exit;
    }
}

function get_db() {
    global $pdo;
    return $pdo;
}

function get_db_info() {
    global $db_type, $db_name, $db_host;
    return [
        'type' => $db_type,
        'database' => $db_name,
        'host' => $db_host,
        'connected' => true
    ];
}

function save_image_from_input($img_url, $subfolder = 'uploads') {
    $img_url = trim((string)$img_url);
    if (empty($img_url)) return '';

    // If it is a base64 data URL, decode and write to disk
    if (preg_match('/^data:image\/(\w+);base64,(.+)$/s', $img_url, $matches)) {
        $ext = strtolower($matches[1]);
        if ($ext === 'jpeg') $ext = 'jpg';
        if (!in_array($ext, ['jpg', 'png', 'webp', 'gif'])) {
            $ext = 'jpg';
        }
        $data = base64_decode($matches[2]);
        if ($data !== false) {
            $upload_dir = __DIR__ . '/../assets/' . $subfolder;
            if (!is_dir($upload_dir)) {
                @mkdir($upload_dir, 0755, true);
            }
            $filename = 'img_' . uniqid() . '.' . $ext;
            $filepath = $upload_dir . '/' . $filename;
            if (@file_put_contents($filepath, $data) !== false) {
                return 'assets/' . $subfolder . '/' . $filename;
            }
        }
    }
    return $img_url;
}

function init_or_migrate_database($db, $type) {
    if (!$db) return;

    try {
        if ($type === 'mysql') {
            $db->exec("
                CREATE TABLE IF NOT EXISTS admin_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(60) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(100) NOT NULL DEFAULT 'Committee Officer',
                    role VARCHAR(50) NOT NULL DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

                CREATE TABLE IF NOT EXISTS gallery (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL DEFAULT 'Maha Protima',
                    year_tag VARCHAR(50) NOT NULL DEFAULT '2025–2026',
                    desc_text TEXT NOT NULL,
                    img_url MEDIUMTEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

                CREATE TABLE IF NOT EXISTS artists (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(150) NOT NULL,
                    craft VARCHAR(150) NOT NULL,
                    region VARCHAR(150) NOT NULL,
                    era_tag VARCHAR(100) NOT NULL DEFAULT '2005 – Present',
                    avatar_initials VARCHAR(10) NOT NULL DEFAULT 'AR',
                    bio TEXT NOT NULL,
                    tradition VARCHAR(255) DEFAULT NULL,
                    accolades VARCHAR(255) DEFAULT NULL,
                    creations VARCHAR(255) DEFAULT NULL,
                    philosophy TEXT DEFAULT NULL,
                    img_url MEDIUMTEXT DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

                CREATE TABLE IF NOT EXISTS donations (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(150) NOT NULL,
                    phone VARCHAR(30) DEFAULT NULL,
                    email VARCHAR(100) DEFAULT NULL,
                    amount DECIMAL(10, 2) NOT NULL,
                    address VARCHAR(255) DEFAULT 'Ranaghat',
                    purpose VARCHAR(150) NOT NULL DEFAULT 'Sharodotsav Durga Puja Chanda',
                    pan VARCHAR(20) DEFAULT NULL,
                    utr VARCHAR(100) DEFAULT 'WhatsApp Redirection',
                    status ENUM('pending', 'verified') NOT NULL DEFAULT 'pending',
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

                CREATE TABLE IF NOT EXISTS members (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(150) NOT NULL,
                    phone VARCHAR(30) NOT NULL,
                    city VARCHAR(100) DEFAULT 'Ranaghat',
                    interest VARCHAR(100) NOT NULL DEFAULT 'Puja & Cultural Wing',
                    message TEXT,
                    status ENUM('pending', 'reviewed', 'accepted') NOT NULL DEFAULT 'pending',
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");

            // Ensure columns in case of existing older MySQL tables
            try { $db->exec("ALTER TABLE gallery MODIFY COLUMN img_url MEDIUMTEXT NOT NULL"); } catch (Exception $e) {}
            try { $db->exec("ALTER TABLE artists ADD COLUMN img_url MEDIUMTEXT DEFAULT NULL"); } catch (Exception $e) {}

        } else {
            // SQLite schema
            $db->exec("
                CREATE TABLE IF NOT EXISTS admin_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'admin',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS gallery (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    category TEXT NOT NULL DEFAULT 'Maha Protima',
                    year_tag TEXT NOT NULL DEFAULT '2025–2026',
                    desc_text TEXT NOT NULL,
                    img_url TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS artists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    craft TEXT NOT NULL,
                    region TEXT NOT NULL,
                    era_tag TEXT NOT NULL DEFAULT '2005 – Present',
                    avatar_initials TEXT NOT NULL DEFAULT 'AR',
                    bio TEXT NOT NULL,
                    tradition TEXT,
                    accolades TEXT,
                    creations TEXT,
                    philosophy TEXT,
                    img_url TEXT DEFAULT '',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS donations (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    phone TEXT,
                    email TEXT,
                    amount REAL NOT NULL,
                    address TEXT DEFAULT 'Ranaghat',
                    purpose TEXT NOT NULL DEFAULT 'Sharodotsav Durga Puja Chanda',
                    pan TEXT,
                    utr TEXT DEFAULT 'WhatsApp Redirection',
                    status TEXT NOT NULL DEFAULT 'pending',
                    date DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS members (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    city TEXT DEFAULT 'Ranaghat',
                    interest TEXT NOT NULL DEFAULT 'Puja & Cultural Wing',
                    message TEXT,
                    status TEXT NOT NULL DEFAULT 'pending',
                    date DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            ");

            // Ensure SQLite artists table has img_url
            try {
                $cols = $db->query("PRAGMA table_info(artists)")->fetchAll(PDO::FETCH_COLUMN, 1);
                if (!in_array('img_url', $cols)) {
                    $db->exec("ALTER TABLE artists ADD COLUMN img_url TEXT DEFAULT ''");
                }
            } catch (Exception $e) {}
        }

        // Seed admin user if missing
        $admin_count = (int)$db->query("SELECT COUNT(*) FROM admin_users")->fetchColumn();
        if ($admin_count === 0) {
            $default_hash = password_hash('admin123', PASSWORD_BCRYPT);
            $stmt = $db->prepare("INSERT INTO admin_users (username, password_hash, full_name, role) VALUES ('admin', ?, 'Central Executive Committee', 'superadmin')");
            $stmt->execute([$default_hash]);
        }

        // Seed gallery items if empty
        $gallery_count = (int)$db->query("SELECT COUNT(*) FROM gallery")->fetchColumn();
        if ($gallery_count === 0) {
            $gallery_items = [
                ['117 Divine Forms of Durga', 'Maha Protima', '2025–2026', 'Monumental sanctum featuring 117 unique classical scriptural forms of Devi Durga sculpted from Ganga clay by master artisans of Kumartuli.', 'assets/durga-scene.jpg'],
                ['Terracotta & Bamboo Mandap Installation', 'Theme Architecture', '2025', 'Intricate hand-sculpted temple motifs, bamboo filigree, and sustainable artisan handicrafts adorning the main sanctum.', 'assets/durga-papercraft.jpg'],
                ['Chandannagar 3D Illumination Boulevard', 'Illumination Gate', 'Night View', '1.5 kilometers of computer-synchronized illuminated 3D LED arches lighting the grand approach from Ranaghat railway station.', 'assets/gallery/chandannagar-lights.jpg'],
                ['Maha Ashtami Sandhi Puja & 108 Pradip Aarati', 'Sacred Rituals', 'Maha Ashtami', 'Auspicious Sandhi Puja rituals performed with 108 blue lotuses, sacred clay lamps, and Vedic chants.', 'assets/gallery/sandhi-puja.jpg'],
                ['Vijaya Dashami Sindoor Khela & Shobhayatra', 'Vijaya Dashami', 'Farewell Seva', 'Joyous vermilion farewell to Maa Durga with traditional sweet offerings and Dhak beats by women devotee wing.', 'assets/gallery/sindoor-khela.jpg'],
                ['Maha Navami Dhunuchi Naach & Dhak Symphony', 'Percussion & Dance', 'Maha Navami', 'Spiritual performance with fragrant coconut-husk incense and thunderous rhythmic beats by our 60-member Dhaki troupe.', 'assets/gallery/dhunuchi-dance.jpg'],
                ['Free Mega Blood Donation Camp', 'Social Seva', 'Year-Round', 'Annual voluntary blood donation drive organized in association with Ranaghat Sub-Divisional Hospital Blood Bank.', 'assets/gallery/blood-donation.jpg'],
                ['Kamalpur Gold Cup Football Tournament', 'Youth Sports', 'Sports Meet', 'Our flagship 16-team knockout football championship fostering sportsmanship and youth athletics across Nadia.', 'assets/gallery/football-goldcup.jpg']
            ];
            $g_stmt = $db->prepare("INSERT INTO gallery (title, category, year_tag, desc_text, img_url) VALUES (?, ?, ?, ?, ?)");
            foreach ($gallery_items as $item) {
                $g_stmt->execute($item);
            }
        }

        // Seed artists if empty
        $artists_count = (int)$db->query("SELECT COUNT(*) FROM artists")->fetchColumn();
        if ($artists_count === 0) {
            $artists = [
                ['Nitish Munshi', 'Master Sculptor & Chief Idol Artist (প্রধান প্রতিমা শিল্পী)', 'Nadia & Kumartuli Tradition · Maa Durga Pratima Shilpi', '2026 Theme Idol', 'NM', 'Acclaimed master sculptor and idol artisan Nitish Munshi breathes transcendent spiritual majesty and emotional depth into sacred clay. For Kamalpur Abhijan Sangha\'s historic 2026 Durgotsav under the theme "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Nitish Munshi leads the sculpting of the sanctum\'s divine Maa Durga Mahishasuramardini pratima and sacred forms, weaving classical Shastric clay modeling, sacred Ganga silt, and evocative devotional expression.', 'Sacred Clay Modeling, Shastric Iconography & Chokkhu Daan Artistry', 'Lead Idol Artisan for 2026 Theme', '117 Forms Sanctum Idols, Mahishasuramardini, Navadurga Sculptural Iconography', '"প্রতিমা শুধু মাটির রূপ নয়, মায়ের প্রতি ভক্ত হৃদয়ের নিখাদ ভক্তি আর অনুভবের দৃশ্যমান প্রকাশ। Chokkhu Daan is the supreme moment when clay awakens into divinity, blessing every soul that bows before Her."', 'assets/artist-nitish-munshi-avatar.jpg'],
                ['Sanjit Sarkar', 'Master Sculptor & Idol Artisan (প্রতিমা শিল্পী ও মৃৎশিল্পী)', 'Nadia & Bengal Artisan Guild · Maa Durga Pratima Shilpi', '2026 Theme Idol', 'SS', 'Esteemed master sculptor and idol artisan Sanjit Sarkar is dedicated to the classical art of Bengal clay iconography. For Kamalpur Abhijan Sangha\'s 2026 landmark Durgotsav centering on "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Sanjit Sarkar sculpts sacred representations of the divine mother, combining pure alluvial Ganga clay, anatomical perfection, and spiritual facial ornamentation.', 'Sacred Clay Modeling, Traditional Straw Binding & Divine Visage', 'Lead Idol Artisan for 2026 Theme', '117 Forms Sanctum Idols, Mahishasuramardini & Scriptural Iconography', '"মাটির প্রতিটি ছোঁয়ায় ভক্তি আর নিষ্ঠা মিশে থাকে। মায়ের প্রসন্ন রূপ ফুটিয়ে তোলাই আমাদের পরম সাধনা।"', 'assets/artist-sanjit-sarkar-avatar.jpg'],
                ['Apurba Ray', 'Master Artist & Thematic Sculptor (মন্ডপ ও রূপসজ্জা শিল্পী)', 'Nadia & Bengal Art Studio · রূপসজ্জা ও থিম শিল্পী', '2026 Theme Artisan', 'AR', 'Master artist Apurba Ray is renowned for his mastery over thematic sacred spatial aesthetics, environmental ornamentation, and classical Bengal artistic craftsmanship. For Kamalpur Abhijan Sangha\'s 2026 landmark celebration of "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Apurba Ray orchestrates the atmospheric ornamentation and sanctum artistic installations that elevate the devotee\'s spiritual journey into the ancient cave sanctum of the Adi Shakti.', 'Thematic Space Design, Bengal Clay & Sanctum Artistry', '2026 Theme Master Artisan & Spatial Designer', 'Sanctum Ambience & Aesthetic Ornamentation of 117 Durga Forms', '"শিল্প যেখানে ভক্তির রূপ ধারণ করে, সেখানেই সৃষ্টি সার্থক হয়। মায়ের অপরূপ রূপসজ্জায় আমাদের পরম নিষ্ঠা।"', 'assets/artist-apurba-ray-avatar.jpg'],
                ['Pradip Rudra Pal', 'Chief Clay Sculptor & Idol Architect', 'Kumartuli, North Kolkata · 4th Gen Dynasty', '2005 – 2026', 'PR', 'Fourth-generation inheritor of the legendary Kumartuli clay sculpting dynasty, Pradip Rudra Pal has spent over 35 years sculpting divine forms for premier pujas. At Kamalpur Abhijan Sangha, he conceptualized and hand-sculpted the monumental 117 scriptural forms of Devi Durga.', 'Ganga Clay, Straw Binding & Classical Ekchala', '7x Biswakarma Shilpa Puraskar, Asian Paints Sharad Shamman', '117 Forms Sanctum, 108 Durga Avatar Darshan', '"Maa Durga is not mere clay and straw. She is the living mother of Bengal."', ''],
                ['Susanta Ray & Subrata Dey', 'Pandal Architects & Spatial Designers', 'Kolkata & Ranaghat · Thematic Spatial Studio', '2012 – 2026', 'SR', 'Celebrated architectural visionaries of contemporary Puja movement, Ray & Dey specialize in massive sustainable installations crafted purely from bamboo, terracotta tiles, Dokra brass accents, and handmade jute fabric.', 'Nadia Bamboo, Terracotta Relief Tiles, Dokra Brass', 'Bengal Thematic Pandal Excellence Award, Nadia Heritage Trophy', '80 Temple Sanctum Complex, Terracotta Whispering Corridor', 'Over 65,000 seasoned bamboo poles, sustainable architecture.', ''],
                ['Babu Pal & Sridam Das', 'Chandannagar Illumination Engineers', 'Chandannagar, Hooghly · Lighting Guild Maestros', '1994 – Present', 'BP', 'Carrying forward Chandannagars legendary lighting heritage for 32 continuous years, Babu Pal and Sridam Das design the iconic 1.5-kilometer illuminated grand avenue from Ranaghat Station to the Sangha grounds.', 'Kinetic 3D LED Arches, Microcontroller Storyboard Illumination', 'Chandannagar Light Master Guild Gold Medal', '1.5 km Station Boulevard Gate, Dancing Peacock 3D Arch', 'Over 250,000 smart LEDs with dedicated green generator grid.', ''],
                ['Gokul Das & Motilal Troupe', 'Traditional Dhak Maestros & Percussion Ensemble', 'Murshidabad & Ranaghat · 60-Member Ensemble', '1988 – Present', 'GD', 'Leading a synchronized 60-member artisan percussion ensemble, Ustad Gokul Das and Motilal Das create the rhythmic heart of our Sharodotsav, welcoming Maa Durga from Mahalaya morning to Dashami.', 'Bengal Mango Wood Dhak, Brass Kanshi & Sanctum Shankha Ensemble', 'State Folk Percussion Honors, Nadia Cultural Heritage Award', 'Mahalaya Bodhon Beats, Sandhi Puja 108 Dhak Aarati', '"The Dhak does not create sound; it summons the soul."', ''],
                ['Maniklal Chitrakar', 'Bengal Pata Chitra & Folk Scroll Murals', 'Naya, Pingla, Paschim Medinipur · Patua Guild', '2016 – 2026', 'MC', 'A celebrated master of Bengal ancient Patachitra scroll painting tradition, Maniklal Chitrakar uses exclusively hand-ground organic pigments derived from teak leaves, turmeric, crushed conch shells, and Aparajita flower petals. His massive narrative murals narrate Devi Mahatmya hymns and traditional village folklore.', 'Organic Vegetable & Mineral Dyes on Handcrafted Cloth-Paper Scrolls', 'West Bengal State Master Craftsperson Award (2019)', 'Devi Mahatmya 100-foot mural gallery, Navadurga Folk Scroll cycle', 'Preserving endangered rural Bengal talas & organic mineral pigments.', ''],
                ['Pt. Debojyoti Banerjee & Swapan Chakraborty', 'Sacred Soundscape & Theme Music Composers', 'Ranaghat & Nadia · Acoustic Heritage Center', '2008 – Present', 'DB', 'Acclaimed classical musicians and acoustic soundscape designers, Pandit Debojyoti Banerjee (sitar & sarod) and Swapan Chakraborty (choral arrangement) compose the custom atmospheric score for Kamalpur Abhijan Sangha every autumn. Blending pure Raag Bhairav, Shankha calls, and Vedic Chandi stotrams.', 'Classical Indian Ragas, Sanskrit Vedic Stotrams & Spatial Ambient Acoustic', 'Nadia Classical Music Academy Honors (2020)', 'The 117 Devi Hymn Symphony, Dawn Bodhon Raga, Evening Arati Choir', 'Multi-zone 3D spatial acoustic sound field with zero harsh frequencies.', '']
            ];
            $a_stmt = $db->prepare("INSERT INTO artists (name, craft, region, era_tag, avatar_initials, bio, tradition, accolades, creations, philosophy, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($artists as $art) {
                $a_stmt->execute($art);
            }
        }
    } catch (Exception $e) {
        error_log('Database init/migration warning: ' . $e->getMessage());
    }
}

