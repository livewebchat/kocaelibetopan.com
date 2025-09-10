-- Create the about_page table for Kocaeli Betopan
-- Run this SQL command in your MySQL database

CREATE TABLE IF NOT EXISTS about_page (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Hakkımızda',
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default content if table is empty
INSERT INTO about_page (title, content) 
SELECT 'Hakkımızda', '<p>Kocaeli Betopan hakkında bilgiler buraya eklenecek.</p>'
WHERE NOT EXISTS (SELECT 1 FROM about_page);