-- Contact Messages Table Migration
-- This script creates the contact_messages table for storing contact form submissions

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    admin_notes TEXT,
    replied_at TIMESTAMP NULL,
    replied_by VARCHAR(100) NULL
);

-- Add indexes for better performance
CREATE INDEX idx_status ON contact_messages(status);
CREATE INDEX idx_created_at ON contact_messages(created_at);
CREATE INDEX idx_email ON contact_messages(email);

-- Insert sample data (optional)
-- INSERT INTO contact_messages (name, email, phone, message) VALUES 
-- ('Test User', 'test@example.com', '+90 555 123 4567', 'This is a test message');
