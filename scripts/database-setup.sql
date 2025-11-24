-- ==============================================
-- JOKIPOSTER DATABASE SETUP - COMPLETE SCRIPT
-- ==============================================
-- Run this entire script in Supabase SQL Editor

-- ==============================================
-- STEP 1: CREATE TABLES
-- ==============================================

-- Create poster_orders table
CREATE TABLE IF NOT EXISTS poster_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  service VARCHAR(100) NOT NULL,
  package VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  dimensions VARCHAR(100),
  colors VARCHAR(100),
  deadline DATE NOT NULL,
  additional_info TEXT,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STEP 2: CREATE ADMIN USER
-- ==============================================

-- Delete existing admin user if exists and insert new one
DELETE FROM admin_users WHERE email = 'admin@jokiposter.com';
INSERT INTO admin_users (email, password, role) 
VALUES ('admin@jokiposter.com', 'admin123', 'admin');

-- ==============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_poster_orders_status ON poster_orders(status);
CREATE INDEX IF NOT EXISTS idx_poster_orders_created_at ON poster_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_poster_orders_deadline ON poster_orders(deadline);

-- ==============================================
-- STEP 4: CREATE TRIGGER FUNCTION
-- ==============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for poster_orders
DROP TRIGGER IF EXISTS update_poster_orders_updated_at ON poster_orders;
CREATE TRIGGER update_poster_orders_updated_at
    BEFORE UPDATE ON poster_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS
ALTER TABLE poster_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 6: CREATE SECURITY POLICIES
-- ==============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on poster_orders" ON poster_orders;
DROP POLICY IF EXISTS "Allow admin access on poster_orders" ON poster_orders;
DROP POLICY IF EXISTS "Allow admin access on admin_users" ON admin_users;

-- Create policies for public access to orders (for form submission)
CREATE POLICY "Allow public insert on poster_orders" ON poster_orders
    FOR INSERT WITH CHECK (true);

-- Create policies for admin access
CREATE POLICY "Allow admin access on poster_orders" ON poster_orders
    FOR ALL USING (true);

CREATE POLICY "Allow admin access on admin_users" ON admin_users
    FOR ALL USING (true);

-- ==============================================
-- VERIFICATION QUERIES (Optional - for checking)
-- ==============================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('poster_orders', 'admin_users');

-- Check admin user
-- SELECT id, email, role, created_at FROM admin_users;

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('poster_orders', 'admin_users');

-- ==============================================
-- SETUP COMPLETE! 🎉
-- ==============================================
-- Your database is now ready to use.
-- Default admin login:
-- Email: admin@jokiposter.com
-- Password: admin123
-- 
-- Next steps:
-- 1. Test connection: http://localhost:3000/api/test-connection
-- 2. Login to dashboard: http://localhost:3000/login
-- 3. Change default password after first login!
-- ==============================================