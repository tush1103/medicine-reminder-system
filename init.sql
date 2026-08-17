CREATE DATABASE IF NOT EXISTS medicine_reminder;
USE medicine_reminder;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(255) NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  dosage_frequency INT NOT NULL,
  supply_days INT NOT NULL,
  dose_times JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(255) NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  next_reminder_at DATETIME NOT NULL,
  supply_end_date DATE NOT NULL,
  refill_alert_sent BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
