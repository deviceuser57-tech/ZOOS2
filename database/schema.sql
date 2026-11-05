-- ==============================================================================
-- Schema Migration: ZOSS Smart Electronics
-- Master Architectural Blueprint (PostgreSQL / Supabase)
-- Supports: Omnichannel Retail, Dropshipping, X-Mall POS, Serial Warranty Tracking
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'inventory_manager', 'cashier');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE electronics_category AS ENUM (
        'phone_accessories',
        'earphones',
        'smartwatches',
        'chargers_cables',
        'gaming_gear',
        'smart_home'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE device_brand AS ENUM (
        'apple',
        'samsung',
        'huawei',
        'xiaomi',
        'google',
        'universal'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_fulfillment_type AS ENUM (
        'courier_delivery',
        'click_and_collect_xmall'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending_supplier',
        'dispatched_supplier',
        'in_transit',
        'out_for_delivery',
        'ready_for_pickup',
        'delivered',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE serial_status AS ENUM (
        'in_stock',
        'reserved',
        'sold',
        'rma_defective',
        'transferred'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE price_request_status AS ENUM (
        'pending',
        'approved',
        'rejected'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Core Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(64) UNIQUE NOT NULL,
    barcode VARCHAR(64) UNIQUE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    category electronics_category NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL CHECK (price_usd >= 0),
    original_price_usd NUMERIC(10, 2) CHECK (original_price_usd >= price_usd),
    supplier_cost_usd NUMERIC(10, 2) NOT NULL CHECK (supplier_cost_usd >= 0),
    supplier_name VARCHAR(128) NOT NULL,
    supplier_platform VARCHAR(64) DEFAULT 'AliExpress',
    supplier_sku VARCHAR(128),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5.0),
    reviews_count INT DEFAULT 0 CHECK (reviews_count >= 0),
    image_url TEXT NOT NULL,
    secondary_images JSONB DEFAULT '[]'::jsonb,
    badge_ar VARCHAR(64),
    badge_en VARCHAR(64),
    is_winning_product BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    delivery_days_min INT DEFAULT 3,
    delivery_days_max INT DEFAULT 7,
    warranty_months INT DEFAULT 12,
    source_type VARCHAR(32) DEFAULT 'dropshipping_direct',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants (Color, Capacity, Specs)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name_ar VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    color_hex VARCHAR(16) NOT NULL CHECK (color_hex ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
    model_compatibility VARCHAR(128),
    extra_price_usd NUMERIC(10, 2) DEFAULT 0.00,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INT DEFAULT 50 CHECK (stock_quantity >= 0),
    serial_tracking_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brand Compatibility Matrix (Device Linking)
CREATE TABLE IF NOT EXISTS brand_compatibilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    brand device_brand NOT NULL,
    model_name VARCHAR(128) NOT NULL,
    year_introduced INT,
    notes VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_prod_device UNIQUE (product_id, brand, model_name)
);

-- 6. Product Serials & IMEI Tracking (Warranty & POS Validation)
CREATE TABLE IF NOT EXISTS product_serials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    serial_number VARCHAR(128) UNIQUE NOT NULL,
    imei VARCHAR(64) UNIQUE,
    batch_number VARCHAR(64),
    status serial_status DEFAULT 'in_stock',
    location_id VARCHAR(64) DEFAULT 'loc-warehouse',
    warranty_months INT DEFAULT 12,
    activated_at TIMESTAMPTZ,
    warranty_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Inventory Locations & Multi-Location Stocks
CREATE TABLE IF NOT EXISTS inventory_locations (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS location_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id VARCHAR(64) NOT NULL REFERENCES inventory_locations(id) ON DELETE RESTRICT,
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    usable INT GENERATED ALWAYS AS (on_hand - reserved) STORED,
    reorder_level INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_location_prod UNIQUE (product_id, location_id)
);

-- 8. Customer Orders (Omnichannel & Dropshipping)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(64) NOT NULL,
    customer_email VARCHAR(128),
    city VARCHAR(64) NOT NULL,
    shipping_address TEXT NOT NULL,
    fulfillment_type order_fulfillment_type NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    total_usd NUMERIC(10, 2) NOT NULL CHECK (total_usd >= 0),
    supplier_cost_usd NUMERIC(10, 2) NOT NULL CHECK (supplier_cost_usd >= 0),
    profit_usd NUMERIC(10, 2) GENERATED ALWAYS AS (total_usd - supplier_cost_usd) STORED,
    currency VARCHAR(8) DEFAULT 'SAR',
    status order_status DEFAULT 'pending_supplier',
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    supplier_tracking_number VARCHAR(64),
    supplier_name VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    serial_id UUID REFERENCES product_serials(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_usd NUMERIC(10, 2) NOT NULL CHECK (unit_price_usd >= 0)
);

-- 10. POS Sales Records (X-Mall Offline Cashier Counter)
CREATE TABLE IF NOT EXISTS pos_sales (
    id VARCHAR(64) PRIMARY KEY,
    receipt_number VARCHAR(64) UNIQUE NOT NULL,
    cashier_name VARCHAR(128) NOT NULL,
    total_usd NUMERIC(10, 2) NOT NULL CHECK (total_usd >= 0),
    payment_method VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id VARCHAR(64) NOT NULL REFERENCES pos_sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    serial_id UUID REFERENCES product_serials(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_usd NUMERIC(10, 2) NOT NULL CHECK (unit_price_usd >= 0)
);

-- 11. Dynamic Pricing Requests (With Maker-Checker Approval Workflow)
CREATE TABLE IF NOT EXISTS price_change_requests (
    id VARCHAR(64) PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    old_price_usd NUMERIC(10, 2) NOT NULL,
    new_price_usd NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    status price_request_status DEFAULT 'pending'
);

-- 12. Security & Compliance Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(64) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    role user_role NOT NULL,
    target VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_brand_compat_model ON brand_compatibilities(brand, model_name);
CREATE INDEX IF NOT EXISTS idx_serials_number ON product_serials(serial_number);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_location_stocks_lookup ON location_stocks(product_id, location_id);

-- 14. Trigger: Update Product Timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_products_timestamp ON products;
CREATE TRIGGER trigger_update_products_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ==============================================================================
-- End of Schema Migration File
-- ==============================================================================
