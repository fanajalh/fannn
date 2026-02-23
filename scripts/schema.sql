-- =====================================================
-- SCHEMA POSTGRESQL UNTUK PROJECT JOKIPOSTER (FANAJAH)
-- Database: Supabase (PostgreSQL)
-- Generated: 2026-02-22
-- =====================================================

-- =====================================================
-- 1. TABEL: admin_users (Profil Administrator)
-- Digunakan oleh: /api/auth/login, middleware.ts
-- Relasi: email terhubung ke Supabase Auth users
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    role        VARCHAR(50)  NOT NULL DEFAULT 'admin',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index untuk lookup login
CREATE INDEX idx_admin_users_email ON admin_users(email);

COMMENT ON TABLE admin_users IS 'Tabel profil admin. Login via Supabase Auth, lalu cek role di sini.';

-- =====================================================
-- 2. TABEL: poster_orders (Pesanan Desain Poster)
-- Digunakan oleh: /api/orders, /api/orders/[id],
--                 /api/orders/export, /api/analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS poster_orders (
    id               BIGSERIAL PRIMARY KEY,
    order_number     VARCHAR(50)   NOT NULL UNIQUE,
    
    -- Data Kontak Pelanggan
    name             VARCHAR(255)  NOT NULL,
    email            VARCHAR(255)  NOT NULL,
    phone            VARCHAR(50),
    company          VARCHAR(255),
    
    -- Detail Layanan
    service          VARCHAR(100)  NOT NULL,           -- poster-event, poster-edukasi, social-media, print-flyer, lainya
    package          VARCHAR(50)   NOT NULL,            -- basic, professional, enterprise
    title            VARCHAR(500),
    description      TEXT,
    dimensions       VARCHAR(100),                      -- A3, 1080x1080, Vector, dsb
    colors           VARCHAR(255),
    deadline         DATE,
    additional_info  TEXT,
    
    -- Harga & Status
    total_price      INTEGER       NOT NULL DEFAULT 0,  -- Dalam Rupiah
    status           VARCHAR(50)   NOT NULL DEFAULT 'pending',  -- pending, in_progress, completed, cancelled
    
    -- Timestamp
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes untuk query dashboard & analytics
CREATE INDEX idx_poster_orders_status     ON poster_orders(status);
CREATE INDEX idx_poster_orders_created_at ON poster_orders(created_at DESC);
CREATE INDEX idx_poster_orders_service    ON poster_orders(service);
CREATE INDEX idx_poster_orders_email      ON poster_orders(email);

COMMENT ON TABLE poster_orders IS 'Pesanan desain poster dari pelanggan. Notifikasi email + WhatsApp saat order baru masuk.';

-- =====================================================
-- 3. TABEL: suggestions (Kotak Saran / Feedback)
-- Digunakan oleh: /api/suggestions, /api/admin/suggestions,
--                 /api/admin/suggestions/[id]
-- =====================================================
CREATE TABLE IF NOT EXISTS suggestions (
    id          BIGSERIAL PRIMARY KEY,
    nama        VARCHAR(255),                          -- Nama pengirim (opsional)
    user_email  VARCHAR(255),                          -- Email pengirim (opsional)
    category    VARCHAR(100)  NOT NULL,                -- Kategori saran
    saran       TEXT          NOT NULL,                -- Isi saran
    response    TEXT,                                  -- Balasan admin
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending',  -- pending, reviewed
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_suggestions_status     ON suggestions(status);
CREATE INDEX idx_suggestions_created_at ON suggestions(created_at DESC);
CREATE INDEX idx_suggestions_category   ON suggestions(category);

COMMENT ON TABLE suggestions IS 'Kotak saran dari pengunjung. Admin bisa reply via /api/admin/suggestions/[id].';

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Wajib diaktifkan di Supabase agar data aman
-- =====================================================

-- >> poster_orders
ALTER TABLE poster_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
    ON poster_orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
    ON poster_orders FOR SELECT
    USING (true);

CREATE POLICY "Service role can update orders"
    ON poster_orders FOR UPDATE
    USING (true);

CREATE POLICY "Service role can delete orders"
    ON poster_orders FOR DELETE
    USING (true);

-- >> suggestions
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert suggestions"
    ON suggestions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can read suggestions"
    ON suggestions FOR SELECT
    USING (true);

CREATE POLICY "Service role can update suggestions"
    ON suggestions FOR UPDATE
    USING (true);

CREATE POLICY "Service role can delete suggestions"
    ON suggestions FOR DELETE
    USING (true);

-- >> admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin_users"
    ON admin_users FOR SELECT
    USING (true);

-- =====================================================
-- 5. TRIGGER: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_poster_orders_updated_at
    BEFORE UPDATE ON poster_orders
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- =====================================================
-- 6. SEED DATA: Admin User Awal
-- Pastikan email ini sudah terdaftar di Supabase Auth!
-- =====================================================
INSERT INTO admin_users (email, role)
VALUES ('arfan.7ovo@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;
