-- Database Migration: Add address field to contacts table
-- Execute this SQL command on your database to add the address field

ALTER TABLE contacts ADD COLUMN address TEXT NOT NULL DEFAULT '';

-- After running this migration, update the existing record with a default address if needed:
-- UPDATE contacts SET address = 'Varsayılan Adres' WHERE id = 1;

-- This migration adds the address field as TEXT type to handle longer addresses
-- The field is set as NOT NULL with empty string default to maintain data integrity