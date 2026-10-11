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

// Configuration (Defaults for local phpMyAdmin / XAMPP / MAMP / LAMP)
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'kamalpur_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';

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
} catch (PDOException $e) {
    // 2. Graceful Fallback to SQLite if MySQL is not running
    $db_type = 'sqlite';
    $data_dir = __DIR__ . '/../data';
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }
    $sqlite_file = $data_dir . '/kamalpur.sqlite';
    $is_new = !file_exists($sqlite_file);

    try {
        $pdo = new PDO("sqlite:" . $sqlite_file);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        if ($is_new) {
            init_sqlite_schema($pdo);
        }
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

function init_sqlite_schema($db) {
    // Create tables in SQLite if MySQL is offline
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

    // Seed default admin user: admin / admin123
    $default_hash = password_hash('admin123', PASSWORD_BCRYPT);
    $stmt = $db->prepare("INSERT OR IGNORE INTO admin_users (username, password_hash, full_name, role) VALUES ('admin', ?, 'Central Executive Committee', 'superadmin')");
    $stmt->execute([$default_hash]);

    // Seed default gallery items
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

    // Seed default artists
    $artists = [
        ['Pradip Rudra Pal', 'Chief Clay Sculptor & Idol Architect', 'Kumartuli, North Kolkata · 4th Gen Dynasty', '2005 – 2026', 'PR', 'Fourth-generation inheritor of the legendary Kumartuli clay sculpting dynasty, Pradip Rudra Pal has spent over 35 years sculpting divine forms for premier pujas. At Kamalpur Abhijan Sangha, he conceptualized and hand-sculpted the monumental 117 scriptural forms of Devi Durga.', 'Ganga Clay, Straw Binding & Classical Ekchala', '7x Biswakarma Shilpa Puraskar, Asian Paints Sharad Shamman', '117 Forms Sanctum, 108 Durga Avatar Darshan', '"Maa Durga is not mere clay and straw. She is the living mother of Bengal."'],
        ['Susanta Ray & Subrata Dey', 'Pandal Architects & Spatial Designers', 'Kolkata & Ranaghat · Thematic Spatial Studio', '2012 – 2026', 'SR', 'Celebrated architectural visionaries of contemporary Puja movement, Ray & Dey specialize in massive sustainable installations crafted purely from bamboo, terracotta tiles, Dokra brass accents, and handmade jute fabric.', 'Nadia Bamboo, Terracotta Relief Tiles, Dokra Brass', 'Bengal Thematic Pandal Excellence Award, Nadia Heritage Trophy', '80 Temple Sanctum Complex, Terracotta Whispering Corridor', 'Over 65,000 seasoned bamboo poles, sustainable architecture.'],
        ['Babu Pal & Sridam Das', 'Chandannagar Illumination Engineers', 'Chandannagar, Hooghly · Lighting Guild Maestros', '1994 – Present', 'BP', 'Carrying forward Chandannagars legendary lighting heritage for 32 continuous years, Babu Pal and Sridam Das design the iconic 1.5-kilometer illuminated grand avenue from Ranaghat Station to the Sangha grounds.', 'Kinetic 3D LED Arches, Microcontroller Storyboard Illumination', 'Chandannagar Light Master Guild Gold Medal', '1.5 km Station Boulevard Gate, Dancing Peacock 3D Arch', 'Over 250,000 smart LEDs with dedicated green generator grid.'],
        ['Gokul Das & Motilal Troupe', 'Traditional Dhak Maestros & Percussion Ensemble', 'Murshidabad & Ranaghat · 60-Member Ensemble', '1988 – Present', 'GD', 'Leading a synchronized 60-member artisan percussion ensemble, Ustad Gokul Das and Motilal Das create the rhythmic heart of our Sharodotsav, welcoming Maa Durga from Mahalaya morning to Dashami.', 'Bengal Mango Wood Dhak, Brass Kanshi & Sanctum Shankha Ensemble', 'State Folk Percussion Honors, Nadia Cultural Heritage Award', 'Mahalaya Bodhon Beats, Sandhi Puja 108 Dhak Aarati', '"The Dhak does not create sound; it summons the soul."']
    ];
    $a_stmt = $db->prepare("INSERT INTO artists (name, craft, region, era_tag, avatar_initials, bio, tradition, accolades, creations, philosophy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($artists as $art) {
        $a_stmt->execute($art);
    }
}
