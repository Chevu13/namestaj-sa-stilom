-- ============================================================
-- Nameštaj sa Stilom — KOMPLETNA SUPABASE SCHEMA
-- Pokreni ovo u Supabase SQL Editoru (Project → SQL Editor → New query)
-- ============================================================

-- ── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  material TEXT,
  dimensions TEXT,
  color TEXT,
  availability TEXT NOT NULL DEFAULT 'in_stock'
    CHECK (availability IN ('in_stock','out_of_stock','on_order')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  notes TEXT,
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'nova'
    CHECK (status IN ('nova','u_obradi','poslato','isporuceno','otkazano')),
  source TEXT NOT NULL DEFAULT 'website'
    CHECK (source IN ('website','instagram','telefon','salon')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── AUTO-UPDATE updated_at ───────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Javni čitanje kataloga
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (true);

CREATE POLICY "public_read_product_images" ON product_images
  FOR SELECT USING (true);

-- Javno kreiranje porudžbine (checkout)
CREATE POLICY "public_insert_orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_insert_order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Javno čitanje porudžbine (confirmation page)
CREATE POLICY "public_read_orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "public_read_order_items" ON order_items
  FOR SELECT USING (true);

-- Admin sve operacije (anon key u demo; u produkciji koristiti service_role)
CREATE POLICY "admin_all_categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_product_images" ON product_images
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_order_items" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- ── SEED: KATEGORIJE ─────────────────────────────────────────

INSERT INTO categories (id, name, slug, description, image_url)
VALUES
  (
    'c0a80000-0000-0000-0000-000000000001',
    'Ugaone garniture',
    'ugaone-garniture',
    'Luksuzne ugaone garniture za vaš dnevni boravak. Komfor i stil u savršenoj kombinaciji.',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
  ),
  (
    'c0a80000-0000-0000-0000-000000000002',
    'Bračni kreveti',
    'bracni-kreveti',
    'Elegantni bračni kreveti od prirodnih materijala. Savršen odmor svake noći.',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
  ),
  (
    'c0a80000-0000-0000-0000-000000000003',
    'Kreveti na razvlačenje',
    'kreveti-na-razvlacenje',
    'Praktični kreveti na razvlačenje — idealni za manje prostore i goste.',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── SEED: PROIZVODI ──────────────────────────────────────────

-- UGAONE GARNITURE
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured)
VALUES
(
  'p0000000-0000-0000-0000-000000000001',
  'Milano Ugaona Garnitura',
  'milano-ugaona-garnitura',
  'Luksuzna ugaona garnitura Milano odlikuje se čistim linijama i vrhunskim materijalima. Izrađena od visokokvalitetne tkanine u toplim tonovima, ova garnitura je savršen izbor za moderan dnevni boravak. Duboke sedišne jastuke i udobni nasloni čine je idealnom za opuštanje.',
  189900,
  'c0a80000-0000-0000-0000-000000000001',
  'Tkanina (antilop), Hrastovi nožici',
  '290 × 185 cm, Visina sedišta: 45 cm',
  'Svetlosivi antilop',
  'in_stock',
  true
),
(
  'p0000000-0000-0000-0000-000000000002',
  'Roma Kožna Garnitura',
  'roma-kozna-garnitura',
  'Roma kolekcija predstavlja spoj italijanskog dizajna i srpske izrade. Prirodna koža u toploj braon nijansi daje prostoru sofisticirani izgled. Unutrašnjost od visoko-gustinskih pena garantuje dugotrajan komfor.',
  245000,
  'c0a80000-0000-0000-0000-000000000001',
  'Prirodna koža, Metalni nožici',
  '320 × 200 cm, Visina sedišta: 42 cm',
  'Cognac braon',
  'in_stock',
  true
),
(
  'p0000000-0000-0000-0000-000000000003',
  'Venezia Modularni Sistem',
  'venezia-modularni-sistem',
  'Venezia modularni sistem pruža neograničene mogućnosti prilagođavanja. Komponente možete slobodno kombinovati i premeštati prema vašim potrebama. Savršen za veće prostore koji traže fleksibilnost u aranžiranju.',
  312000,
  'c0a80000-0000-0000-0000-000000000001',
  'Velur tkanina, Drveni okvir',
  'Po izboru — moduli od 80 do 160 cm',
  'Tamnozeleni velur',
  'on_order',
  false
),
(
  'p0000000-0000-0000-0000-000000000004',
  'Scandic Kompaktna Ugaona',
  'scandic-kompaktna-ugaona',
  'Za manje prostore sa velikim stilom. Scandic ugaona garnitura donosi skandinavski minimalizam u vaš dom. Lagana konstrukcija i svetle boje čine prostoriju vizualno većom.',
  156000,
  'c0a80000-0000-0000-0000-000000000001',
  'Tkanina (šenil), Bukovi nožici',
  '240 × 165 cm, Visina sedišta: 46 cm',
  'Bela krem',
  'in_stock',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- BRAČNI KREVETI
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured)
VALUES
(
  'p0000000-0000-0000-0000-000000000005',
  'Aurora Tapecirani Krevet',
  'aurora-tapecirani-krevet',
  'Aurora bračni krevet sa tapeciranim uzglavljem donosi eleganciju hotela u vaš dom. Visoko uzglavlje u baršunastoj tkanini stvara dramatičan vizualni efekat i pruža udobno oslanjanje pri čitanju.',
  98500,
  'c0a80000-0000-0000-0000-000000000002',
  'Baršunasta tkanina, Hrastovo drvo',
  '180 × 200 cm (madrac kupuje se posebno)',
  'Petrol plava',
  'in_stock',
  true
),
(
  'p0000000-0000-0000-0000-000000000006',
  'Natura Masivni Krevet',
  'natura-masivni-krevet',
  'Natura krevet izrađen je od masivnog hrastovog drveta sa minimalnim tretmanom — prirodna struktura drveta dolazi do izražaja. Svaki krevet je jedinstven. Kombinujte sa lanom ili prirodnim tekstilom.',
  134000,
  'c0a80000-0000-0000-0000-000000000002',
  'Masivni hrast, Uljani premaz',
  '160 × 200 cm ili 180 × 200 cm',
  'Prirodni hrast',
  'in_stock',
  true
),
(
  'p0000000-0000-0000-0000-000000000007',
  'Elegante Platform Krevet',
  'elegante-platform-krevet',
  'Elegante platform krevet sa niskim profilom i čistim linijama stvara modernu atmosferu. Bez nožica direktno na podu — minimalistički pristup koji je i dalje luksuzno udoban.',
  87000,
  'c0a80000-0000-0000-0000-000000000002',
  'MDF, Finska bela boja',
  '160 × 200 cm',
  'Mat bela',
  'in_stock',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- KREVETI NA RAZVLAČENJE
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured)
VALUES
(
  'p0000000-0000-0000-0000-000000000008',
  'Dual Comfort Krevet-Sofa',
  'dual-comfort-krevet-sofa',
  'Dual Comfort je savršeno rešenje za višenamenske prostore. Danju funkcioniše kao elegantna trosjed sofa, noću se razvlači u udoban bračni krevet. Mehanizam razvlačenja je tih i jednostavan.',
  76500,
  'c0a80000-0000-0000-0000-000000000003',
  'Antilop tkanina, Metalni mehanizam',
  'Sofa: 215 × 95 cm / Krevet: 215 × 155 cm',
  'Sivi antilop',
  'in_stock',
  true
),
(
  'p0000000-0000-0000-0000-000000000009',
  'Studio Click Krevet',
  'studio-click-krevet',
  'Studio Click mehanizam je najbrži i najtišiji sistem razvlačenja. Jednim pokretom sofa se pretvara u krevet. Idealan za studentske stanove, garsonjere i gostinske sobe.',
  54900,
  'c0a80000-0000-0000-0000-000000000003',
  'Mikrofibra, Hromovane noge',
  'Sofa: 195 × 88 cm / Krevet: 195 × 145 cm',
  'Tamno siva',
  'in_stock',
  false
),
(
  'p0000000-0000-0000-0000-000000000010',
  'Loft Krevet sa Ladicom',
  'loft-krevet-sa-ladicom',
  'Loft model dolazi sa ugradbenom ladicom ispod sedišta — idealno mesto za posteljinu. Čist skandinavski dizajn sa drvenim nogicama. Razvlači se unazad za jednostavno korišćenje.',
  68000,
  'c0a80000-0000-0000-0000-000000000003',
  'Velur tkanina, Hrastove noge',
  'Sofa: 220 × 90 cm / Krevet: 220 × 160 cm',
  'Maslinasto zelena',
  'in_stock',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ── SEED: SLIKE PROIZVODA ────────────────────────────────────

INSERT INTO product_images (product_id, url, alt, sort_order)
VALUES
  -- Milano
  ('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Milano ugaona garnitura', 0),
  ('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80', 'Milano detalj', 1),
  -- Roma
  ('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900&q=80', 'Roma kožna garnitura', 0),
  ('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80', 'Roma detalj', 1),
  -- Venezia
  ('p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&q=80', 'Venezia modularni sistem', 0),
  -- Scandic
  ('p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&q=80', 'Scandic kompaktna ugaona', 0),
  -- Aurora
  ('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', 'Aurora tapecirani krevet', 0),
  ('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=900&q=80', 'Aurora detalj', 1),
  -- Natura
  ('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80', 'Natura masivni krevet', 0),
  ('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=900&q=80', 'Natura detalj', 1),
  -- Elegante
  ('p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80', 'Elegante platform krevet', 0),
  -- Dual Comfort
  ('p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80', 'Dual comfort krevet-sofa', 0),
  ('p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Dual comfort razvučen', 1),
  -- Studio Click
  ('p0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Studio click', 0),
  -- Loft
  ('p0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Loft krevet sa ladicom', 0)
ON CONFLICT DO NOTHING;

-- ── PROVJERA ─────────────────────────────────────────────────

SELECT 'categories' AS tabela, COUNT(*) AS ukupno FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_images', COUNT(*) FROM product_images;
