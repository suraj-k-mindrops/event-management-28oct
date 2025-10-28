# Database Schema for Mindrops Event Management System

## ⚠️ IMPORTANT READ THIS FIRST ⚠️

### Critical Points for Backend Developer:

1. **FIELD NAMES MUST MATCH EXACTLY** - The frontend expects these exact field names (case-sensitive):
   - `typeOfEvent` (NOT `type_of_event` or `eventType`)
   - `nameOfEvent` (NOT `eventName`)
   - `organizerName` (NOT `organizer_name`)
   - `logisticsServiceProvider` (NOT `logistics_service_provider`)
   - `eventCompany` (NOT `event_company`)
   - And ALL other field names as specified below

2. **JSON Fields** - These fields store JSON arrays:
   - `amenities`, `subEvents`, `event_types_supported`, `sub_event_types_supported`
   - Store as JSON in MySQL: `'["Item1", "Item2"]'`

3. **Providers Table** - This table has ~50+ columns but only certain columns are used per category:
   - When `category = 'Logistics'` → Use logistics-specific columns
   - When `category = 'Catering'` → Use catering-specific columns
   - When `category = 'Security'` → Use security-specific columns
   - When `category = 'Gifts'` → Use gifts-specific columns
   - When `category = 'DJ'` → Use DJ-specific columns
   - When `category = 'Photographers'` → Use photographers-specific columns
   - Other columns can be NULL

4. **Timestamps** - `created_at` and `updated_at` are auto-managed

5. **Foreign Keys** - All foreign key relationships are specified

---

## Purpose
This document provides the exact database schema requirements for the Mindrops Event Management System frontend. The backend developer should use this document to create database tables with matching field names, data types, and relationships.

---

## Overview of Required Modules

The following modules are required in the database schema (News & Updates and Form Editor are **SKIPPED**):

1. **Users** - Authentication and user management
2. **Dashboard** - Core statistics and overview
3. **Event Directory** - Public event listings
4. **Event Packages** - Completed event packages with metrics
5. **Student Management** - Student profiles and information
6. **Service Providers** - Multiple categories:
   - Event Types
   - Venues
   - Logistics Service Providers
   - Catering Services
   - Security Agencies
   - Gift Shops
   - DJ Services
   - Photographers

---

## 1. Users Table

**Purpose:** User authentication and role management

### Table: `users`

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed
  role ENUM('STUDENT', 'ADMIN', 'ORGANIZER') DEFAULT 'STUDENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Fields:
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Full name (VARCHAR(255), NOT NULL)
- `email` - Email address (VARCHAR(255), UNIQUE, NOT NULL)
- `password` - Hashed password (VARCHAR(255), NOT NULL)
- `role` - User role (ENUM: 'STUDENT', 'ADMIN', 'ORGANIZER')
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## 2. Event Types Table

**Purpose:** Define event categories and types

### Table: `event_types`

```sql
CREATE TABLE event_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL, -- hex color code (e.g., '#FF5733')
  description TEXT,
  category VARCHAR(255), -- e.g., 'Social Events', 'Corporate Events'
  subEvents JSON, -- array of strings (e.g., ["Wedding", "Birthday Party"])
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active)
);
```

### Fields:
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Event type name (VARCHAR(255), NOT NULL)
- `color` - Hex color code (VARCHAR(7), NOT NULL)
- `description` - Description (TEXT)
- `category` - Category name (VARCHAR(255))
- `subEvents` - Sub-events array (JSON)
- `active` - Active status (BOOLEAN, default TRUE)
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## 3. Venues Table

**Purpose:** Manage event venues with detailed information

### Table: `venues`

```sql
CREATE TABLE venues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT,
  description TEXT,
  amenities JSON, -- array of strings
  status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
  bookings INT DEFAULT 0,
  
  -- Additional venue-specific fields
  venue_type VARCHAR(255), -- e.g., 'Indoor', 'Outdoor', 'Mixed'
  event_types_supported JSON, -- array of strings
  sub_event_types_supported JSON, -- array of strings
  total_area_sqft VARCHAR(50), -- can be number or range
  parking_capacity VARCHAR(50), -- can be number or range
  rooms_available VARCHAR(50), -- can be number or range
  booking_status VARCHAR(50), -- e.g., 'Available', 'Booked'
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),
  date VARCHAR(255), -- event date if applicable
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_location (location)
);
```

### Fields:

**Core Fields (Required):**
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Venue name (VARCHAR(255), NOT NULL)
- `contact` - Contact number (VARCHAR(50), NOT NULL)
- `address` - Physical address (VARCHAR(255), NOT NULL)
- `location` - Location name (VARCHAR(255), NOT NULL)
- `capacity` - Maximum capacity (INT)
- `description` - Description (TEXT)
- `amenities` - Amenities list (JSON, array of strings)
- `status` - Status (ENUM: 'Active', 'Maintenance', 'Inactive')
- `bookings` - Booking count (INT, default 0)

**Extended Fields (Optional):**
- `venue_type` - Venue type (VARCHAR(255))
- `event_types_supported` - Supported event types (JSON)
- `sub_event_types_supported` - Supported sub-event types (JSON)
- `total_area_sqft` - Total area (VARCHAR(50))
- `parking_capacity` - Parking capacity (VARCHAR(50))
- `rooms_available` - Number of rooms (VARCHAR(50))
- `booking_status` - Current booking status (VARCHAR(50))
- `latitude` - GPS latitude (VARCHAR(50))
- `longitude` - GPS longitude (VARCHAR(50))
- `email` - Email address (VARCHAR(255))
- `website` - Website URL (VARCHAR(500))
- `date` - Event date (VARCHAR(255))

**Timestamps:**
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## 4. Directory Entries Table

**Purpose:** Store event directory entries (upcoming/current events)

### Table: `directory_entries`

```sql
CREATE TABLE directory_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  typeOfEvent VARCHAR(255) NOT NULL, -- e.g., 'Conference', 'Wedding'
  nameOfEvent VARCHAR(255) NOT NULL,
  venueLocation VARCHAR(255) NOT NULL,
  dateOfEvent DATETIME NOT NULL,
  teamsDepartmentsWorkprofile TEXT,
  targetAudience TEXT,
  theme VARCHAR(255),
  eventCompany VARCHAR(255),
  sponsors TEXT,
  vendors TEXT,
  manpowerRequired TEXT,
  logisticsServiceProvider VARCHAR(255),
  miscellaneous TEXT,
  mediaPhotos VARCHAR(500), -- URLs or references
  mediaVideos VARCHAR(500), -- URLs or references
  organizerName VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (dateOfEvent)
);
```

### Fields:
- `id` - Primary key (INT, AUTO_INCREMENT)
- `typeOfEvent` - Event type (VARCHAR(255), NOT NULL)
- `nameOfEvent` - Event name (VARCHAR(255), NOT NULL)
- `venueLocation` - Venue location (VARCHAR(255), NOT NULL)
- `dateOfEvent` - Event date and time (DATETIME, NOT NULL)
- `teamsDepartmentsWorkprofile` - Team/department info (TEXT)
- `targetAudience` - Target audience description (TEXT)
- `theme` - Event theme (VARCHAR(255))
- `eventCompany` - Organizing company (VARCHAR(255))
- `sponsors` - Sponsors list (TEXT)
- `vendors` - Vendors list (TEXT)
- `manpowerRequired` - Manpower requirements (TEXT)
- `logisticsServiceProvider` - Logistics provider name (VARCHAR(255))
- `miscellaneous` - Additional information (TEXT)
- `mediaPhotos` - Photo URLs (VARCHAR(500))
- `mediaVideos` - Video URLs (VARCHAR(500))
- `organizerName` - Organizer name (VARCHAR(255), NOT NULL)
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## 5. Event Packages Table

**Purpose:** Store completed event packages with success metrics

### Table: `event_packages`

```sql
CREATE TABLE event_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  typeOfEvent VARCHAR(255) NOT NULL,
  nameOfEvent VARCHAR(255) NOT NULL,
  venueLocation VARCHAR(255) NOT NULL,
  dateOfEvent DATETIME NOT NULL,
  teamsDepartmentsWorkprofile TEXT,
  targetAudience TEXT,
  theme VARCHAR(255),
  eventCompany VARCHAR(255),
  sponsors TEXT,
  vendors TEXT,
  manpowerRequired TEXT,
  logisticsServiceProvider VARCHAR(255),
  miscellaneous TEXT,
  mediaPhotos VARCHAR(500),
  mediaVideos VARCHAR(500),
  organizerName VARCHAR(255) NOT NULL,
  
  -- Success metrics (unique to packages)
  successMetrics TEXT,
  totalAttended VARCHAR(50),
  feedback TEXT,
  rating VARCHAR(50), -- e.g., '1' to '5'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (dateOfEvent)
);
```

### Fields:

**Common with Directory (same as directory_entries):**
- `id`, `typeOfEvent`, `nameOfEvent`, `venueLocation`, `dateOfEvent`
- `teamsDepartmentsWorkprofile`, `targetAudience`, `theme`
- `eventCompany`, `sponsors`, `vendors`, `manpowerRequired`
- `logisticsServiceProvider`, `miscellaneous`, `mediaPhotos`, `mediaVideos`
- `organizerName`, `created_at`, `updated_at`

**Unique to Packages:**
- `successMetrics` - Success metrics (TEXT)
- `totalAttended` - Total attendees (VARCHAR(50))
- `feedback` - Event feedback (TEXT)
- `rating` - Event rating (VARCHAR(50))

---

## 6. Students Table

**Purpose:** Manage student profiles and information

### Table: `students`

```sql
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  portfolioLink VARCHAR(500), -- URL to portfolio
  address TEXT,
  organisation VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);
```

### Fields:
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Full name (VARCHAR(255), NOT NULL)
- `email` - Email address (VARCHAR(255), NOT NULL)
- `phone` - Phone number (VARCHAR(50), NOT NULL)
- `status` - Status (ENUM: 'Active', 'Inactive')
- `portfolioLink` - Portfolio URL (VARCHAR(500))
- `address` - Address (TEXT)
- `organisation` - Organization name (VARCHAR(255))
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## 7. Providers Table

**Purpose:** Store service providers for multiple categories (Logistics, Catering, Security, Gifts, DJ, Photographers)

### Table: `providers`

```sql
CREATE TABLE providers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  address TEXT,
  description TEXT,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  
  -- Category field (REQUIRED to distinguish provider type)
  category ENUM('Logistics', 'Catering', 'Security', 'Gifts', 'DJ', 'Photographers') NOT NULL,
  
  -- ========================================
  -- LOGISTICS-SPECIFIC FIELDS
  -- (only populated when category = 'Logistics')
  -- ========================================
  logistics_id VARCHAR(255),
  service_type VARCHAR(255), -- e.g., 'Transport', 'Equipment Rental'
  vehicle_types_available VARCHAR(255), -- e.g., 'Trucks, Vans, Cars'
  equipment_types VARCHAR(255), -- e.g., 'Staging, Tables, Chairs'
  capacity_handling VARCHAR(255), -- e.g., '500+ guests'
  available_locations VARCHAR(255),
  contact_person VARCHAR(255),
  contact_number VARCHAR(50),
  license_number VARCHAR(255),
  insurance_coverage VARCHAR(255),
  service_radius VARCHAR(255), -- e.g., '50 km'
  
  -- ========================================
  -- CATERING-SPECIFIC FIELDS
  -- (only populated when category = 'Catering')
  -- ========================================
  cuisine_types VARCHAR(255), -- e.g., 'Indian, Italian, Chinese'
  menu_categories VARCHAR(255), -- e.g., 'Vegetarian, Non-Vegetarian, Vegan'
  serving_capacity VARCHAR(255), -- e.g., '100-500 guests'
  equipment_available VARCHAR(255), -- e.g., 'Linens, Cutlery, Serving Equipment'
  staff_count VARCHAR(255), -- e.g., '10-20 staff'
  halal_certified BOOLEAN DEFAULT FALSE,
  vegetarian_options BOOLEAN DEFAULT FALSE,
  
  -- ========================================
  -- SECURITY-SPECIFIC FIELDS
  -- (only populated when category = 'Security')
  -- ========================================
  security_license VARCHAR(255),
  security_services VARCHAR(255), -- e.g., 'Crowd Control, Access Control'
  staff_qualifications VARCHAR(255), -- e.g., 'Trained Guards, Licensed Security'
  equipment_provided VARCHAR(255), -- e.g., 'Metal Detectors, Walkie-Talkies'
  response_time VARCHAR(255), -- e.g., '15 minutes'
  patrol_areas VARCHAR(255),
  
  -- ========================================
  -- GIFTS-SPECIFIC FIELDS
  -- (only populated when category = 'Gifts')
  -- ========================================
  gift_categories VARCHAR(255), -- e.g., 'Corporate Gifts, Custom Gifts'
  price_range VARCHAR(255), -- e.g., 'Rs. 100 - Rs. 1000'
  customization_available BOOLEAN DEFAULT FALSE,
  delivery_available BOOLEAN DEFAULT FALSE,
  bulk_discounts BOOLEAN DEFAULT FALSE,
  
  -- ========================================
  -- DJ-SPECIFIC FIELDS
  -- (only populated when category = 'DJ')
  -- ========================================
  equipment_owned VARCHAR(255), -- e.g., 'Sound System, Mixer, Lighting'
  music_genres VARCHAR(255), -- e.g., 'EDM, Bollywood, Pop, Rock'
  experience_years VARCHAR(255), -- e.g., '5+ years'
  event_types_handled VARCHAR(255), -- e.g., 'Weddings, Corporate, Parties'
  lighting_available BOOLEAN DEFAULT FALSE,
  sound_system_power VARCHAR(255), -- e.g., '10kW'
  
  -- ========================================
  -- PHOTOGRAPHERS-SPECIFIC FIELDS
  -- (only populated when category = 'Photographers')
  -- ========================================
  photography_style VARCHAR(255), -- e.g., 'Candid, Traditional, Documentary'
  equipment_used VARCHAR(255), -- e.g., 'Canon, Sony, Professional Lighting'
  years_experience VARCHAR(255), -- e.g., '3+ years'
  portfolio_link VARCHAR(500), -- URL to portfolio
  editing_services BOOLEAN DEFAULT FALSE,
  drone_photography BOOLEAN DEFAULT FALSE,
  
  -- ========================================
  -- COMMON FIELDS (ALL CATEGORIES)
  -- ========================================
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  owner_id INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_status (status)
);
```

### Fields Explanation:

#### Common Fields (All Categories):
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Provider name (VARCHAR(255), NOT NULL)
- `contact` - Contact number (VARCHAR(50), NOT NULL)
- `address` - Address (TEXT)
- `description` - Description (TEXT)
- `email` - Email (VARCHAR(255), NOT NULL)
- `website` - Website URL (VARCHAR(500))
- `status` - Status (ENUM: 'Active', 'Inactive')
- `category` - Provider category (ENUM: 'Logistics', 'Catering', 'Security', 'Gifts', 'DJ', 'Photographers')
- `latitude` - GPS latitude (VARCHAR(50))
- `longitude` - GPS longitude (VARCHAR(50))
- `owner_id` - User reference (INT, Foreign Key to users.id)

#### Logistics-Specific Fields:
Only populate when `category = 'Logistics'`
- `logistics_id`, `service_type`, `vehicle_types_available`
- `equipment_types`, `capacity_handling`, `available_locations`
- `contact_person`, `contact_number`, `license_number`
- `insurance_coverage`, `service_radius`

#### Catering-Specific Fields:
Only populate when `category = 'Catering'`
- `cuisine_types`, `menu_categories`, `serving_capacity`
- `equipment_available`, `staff_count`
- `halal_certified`, `vegetarian_options`

#### Security-Specific Fields:
Only populate when `category = 'Security'`
- `security_license`, `security_services`, `staff_qualifications`
- `equipment_provided`, `response_time`, `patrol_areas`

#### Gifts-Specific Fields:
Only populate when `category = 'Gifts'`
- `gift_categories`, `price_range`
- `customization_available`, `delivery_available`, `bulk_discounts`

#### DJ-Specific Fields:
Only populate when `category = 'DJ'`
- `equipment_owned`, `music_genres`, `experience_years`
- `event_types_handled`, `lighting_available`, `sound_system_power`

#### Photographers-Specific Fields:
Only populate when `category = 'Photographers'`
- `photography_style`, `equipment_used`, `years_experience`
- `portfolio_link`, `editing_services`, `drone_photography`

**Note:** All category-specific fields can be NULL for records of other categories. Only populate the fields relevant to the `category` value.

---

## 8. Events Table (For Dashboard)

**Purpose:** Core events table for dashboard statistics

### Table: `events`

```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  description TEXT,
  event_type_id INT,
  venue_id INT,
  organizer_id INT NOT NULL,
  status ENUM('draft', 'published', 'cancelled') DEFAULT 'draft',
  capacity INT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_date (date),
  INDEX idx_status (status)
);
```

### Fields:
- `id` - Primary key (INT, AUTO_INCREMENT)
- `name` - Event name (VARCHAR(255), NOT NULL)
- `date` - Event date and time (DATETIME, NOT NULL)
- `description` - Description (TEXT)
- `event_type_id` - Reference to event_types (INT, Foreign Key)
- `venue_id` - Reference to venues (INT, Foreign Key)
- `organizer_id` - Reference to users (INT, NOT NULL, Foreign Key)
- `status` - Status (ENUM: 'draft', 'published', 'cancelled')
- `capacity` - Capacity (INT)
- `price` - Price (DECIMAL(10,2))
- `created_at` - Timestamp (TIMESTAMP, auto-managed)
- `updated_at` - Timestamp (TIMESTAMP, auto-managed)

---

## Important Notes for Backend Developer

### 1. Field Name Matching
**CRITICAL:** Use the **exact field names** as specified in this document. The frontend expects these exact field names:
- `typeOfEvent` (not `type_of_event` or `eventType`)
- `nameOfEvent` (not `eventName`)
- `organizerName` (not `organizer_name`)
- `logisticsServiceProvider` (not `logistics_service_provider`)
- And so on...

### 2. JSON Fields
The following fields should store JSON arrays:
- `amenities` in venues - array of strings
- `subEvents` in event_types - array of strings
- `event_types_supported` in venues - array of strings
- `sub_event_types_supported` in venues - array of strings

**Example in MySQL:**
```sql
-- When inserting:
amenities = '["WiFi", "Parking", "Catering"]'

-- When querying:
JSON_EXTRACT(amenities, '$[*]') AS amenities_array
```

### 3. Category-Specific Fields in Providers
The `providers` table contains many columns, but only certain columns are used based on the `category` field:

- **Logistics**: Use `logistics_id`, `service_type`, `vehicle_types_available`, etc.
- **Catering**: Use `cuisine_types`, `menu_categories`, `halal_certified`, etc.
- **Security**: Use `security_license`, `security_services`, etc.
- **Gifts**: Use `gift_categories`, `customization_available`, etc.
- **DJ**: Use `equipment_owned`, `music_genres`, `lighting_available`, etc.
- **Photographers**: Use `photography_style`, `equipment_used`, `drone_photography`, etc.

### 4. Timestamps
Both `created_at` and `updated_at` should be automatically managed:
- `created_at`: Set on INSERT
- `updated_at`: Set on INSERT and UPDATE

### 5. Foreign Keys
Maintain referential integrity:
- `events.event_type_id` → `event_types.id`
- `events.venue_id` → `venues.id`
- `events.organizer_id` → `users.id`
- `providers.owner_id` → `users.id`

### 6. Indexes
Add indexes for better query performance:
- Status columns
- Date columns
- Category columns
- Location columns

### 7. Data Types
- Use `VARCHAR` for variable-length strings
- Use `TEXT` for long text content
- Use `INT` for integers
- Use `DECIMAL(10,2)` for money
- Use `BOOLEAN` for true/false values
- Use `DATETIME` for timestamps with date and time
- Use `TIMESTAMP` for auto-managed timestamps
- Use `ENUM` for constrained string values
- Use `JSON` for structured array data

---

## Summary

This schema includes **8 main tables**:

1. `users` - User authentication
2. `event_types` - Event categories
3. `venues` - Event venues
4. `directory_entries` - Event directory (upcoming events)
5. `event_packages` - Completed events with metrics
6. `students` - Student profiles
7. `providers` - Service providers (multi-category)
8. `events` - Core events for dashboard

**Total columns in providers table:** ~50+ columns (many are category-specific and can be NULL)

This schema aligns perfectly with the frontend requirements.

