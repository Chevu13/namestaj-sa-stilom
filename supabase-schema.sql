-- ============================================================
-- Nameštaj sa Stilom — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PRODUCTS
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
  availability TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock','out_of_stock','on_order')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDERS
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
  status TEXT NOT NULL DEFAULT 'nova' CHECK (status IN ('nova','u_obradi','poslato','isporuceno','otkazano')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website','instagram','telefon','salon')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);

-- PUBLIC INSERT FOR ORDERS (website checkout)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- PUBLIC READ OWN ORDERS (by order_number for confirmation page)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- ADMIN FULL ACCESS (use service role key in server-side admin routes)
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(
  'cat-ugaone-001',
  'Ugaone garniture',
  'ugaone-garniture',
  'Luksuzne ugaone garniture za vaš dnevni boravak. Komfor i stil u savršenoj kombinaciji.',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
),
(
  'cat-bracni-001',
  'Bračni kreveti',
  'bracni-kreveti',
  'Elegantni bračni kreveti od prirodnih materijala. Savršen odmor svake noći.',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
),
(
  'cat-razvlacenje-001',
  'Kreveti na razvlačenje',
  'kreveti-na-razvlacenje',
  'Praktični kreveti na razvlačenje — idealni za manje prostore i goste.',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
)
ON CONFLICT (slug) DO NOTHING;

-- Products — Ugaone garniture
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured) VALUES
(
  'prod-001',
  'Milano Ugaona Garnitura',
  'milano-ugaona-garnitura',
  'Luksuzna ugaona garnitura Milano odlikuje se čistim linijama i vrhunskim materijalima. Izrađena od visokokvalitetne tkanine u toplim tonovima, ova garnitura je savršen izbor za moderan dnevni boravak. Duboke sedišne jastuke i udobni nasloni čine je idealnom za opuštanje.',
  189900,
  'cat-ugaone-001',
  'Tkanina (antilop), Hrastovi nožici',
  '290 x 185 cm, Visina sedišta: 45 cm',
  'Svetlosivi antilop',
  'in_stock',
  true
),
(
  'prod-002',
  'Roma Kožna Garnitura',
  'roma-kozna-garnitura',
  'Roma kolekcija predstavlja spoj italijanskog dizajna i srpske izrade. Prirodna koža u toploj braon nijansi daje prostoru sofisticirani izgled. Unutrašnjost od visoko-gustinskih pena garantuje dugotrajan komfor.',
  245000,
  'cat-ugaone-001',
  'Prirodna koža, Metalni nožici',
  '320 x 200 cm, Visina sedišta: 42 cm',
  'Cognac braon',
  'in_stock',
  true
),
(
  'prod-003',
  'Venezia Modularni Sistem',
  'venezia-modularni-sistem',
  'Venezia modularni sistem pruža neograničene mogućnosti prilagođavanja. Komponente možete slobodno kombinovati i premeštati prema vašim potrebama. Savršen za veće prostore koji traže fleksibilnost u aranžiranju.',
  312000,
  'cat-ugaone-001',
  'Velur tkanina, Drveni okvir',
  'Po izboru, moduli od 80-160 cm',
  'Tamnozeleni velur',
  'on_order',
  false
),
(
  'prod-004',
  'Scandic Kompaktna Ugaona',
  'scandic-kompaktna-ugaona',
  'Za manje prostore sa velikim stilom. Scandic ugaona garnitura donosi skandinavski minimalizam u vaš dom. Lagana konstrukcija i svetle boje čine prostoriju vizualno većom.',
  156000,
  'cat-ugaone-001',
  'Tkanina (šenilom), Bukovi nožici',
  '240 x 165 cm, Visina sedišta: 46 cm',
  'Bela krem',
  'in_stock',
  false
);

-- Products — Bračni kreveti
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured) VALUES
(
  'prod-005',
  'Aurora Tapecirani Krevet',
  'aurora-tapecirani-krevet',
  'Aurora bračni krevet sa tapeciranim uzglavljem donosi eleganciju hotela u vaš dom. Visoko uzglavlje u baršunastoj tkanini stvara dramatičan vizualni efekat i pruža udobno oslanjanje pri čitanju.',
  98500,
  'cat-bracni-001',
  'Baršunasta tkanina, Hrastovo drvo',
  '180 x 200 cm (madrac se kupuje posebno)',
  'Petrol plava',
  'in_stock',
  true
),
(
  'prod-006',
  'Natura Masivni Krevet',
  'natura-masivni-krevet',
  'Natura krevet izrađen je od masivnog hrastovog drveta sa minimalnim tretmanom — prirodna struktura drveta dolazi do izražaja. Svaki krevet je jedinstven. Kombinujte sa lanom ili prirodnim tekstilom za potpuno organsko okruženje.',
  134000,
  'cat-bracni-001',
  'Masivni hrast, Uljani premaz',
  '160 x 200 cm ili 180 x 200 cm',
  'Prirodni hrast',
  'in_stock',
  true
),
(
  'prod-007',
  'Elegante Platform Krevet',
  'elegante-platform-krevet',
  'Elegante platform krevet sa niskim profilom i čistim linijama stvara modernu atmosferu. Bez nožica direktno na podu — minimalistički pristup koji je i dalje luksuzno udoban.',
  87000,
  'cat-bracni-001',
  'MDF, Finska bela boja',
  '160 x 200 cm',
  'Mat bela',
  'in_stock',
  false
);

-- Products — Kreveti na razvlačenje
INSERT INTO products (id, name, slug, description, price, category_id, material, dimensions, color, availability, featured) VALUES
(
  'prod-008',
  'Dual Comfort Krevet-Sofa',
  'dual-comfort-krevet-sofa',
  'Dual Comfort je savršeno rešenje za višenamenske prostore. Danju funkcioniše kao elegantna trosjed sofa, noću se razvlači u udoban bračni krevet. Mehanizam razvlačenja je tih i jednostavan. Presvlaka je skidljiva i periva.',
  76500,
  'cat-razvlacenje-001',
  'Antilop tkanina, Metalni mehanizam',
  'Sofa: 215 x 95 cm / Krevet: 215 x 155 cm',
  'Sivi antilop',
  'in_stock',
  true
),
(
  'prod-009',
  'Studio Click Krevet',
  'studio-click-krevet',
  'Studio Click mehanizam je najbrži i najtišiji sistem razvlačenja na tržištu. Jednim pokretom sofa se pretvara u krevet. Idealan za studentske stanove, garsonjere i gostinske sobe.',
  54900,
  'cat-razvlacenje-001',
  'Mikrofibra, Hromovane noge',
  'Sofa: 195 x 88 cm / Krevet: 195 x 145 cm',
  'Tamno siva',
  'in_stock',
  false
),
(
  'prod-010',
  'Loft Krevet sa Ladicom',
  'loft-krevet-sa-ladicom',
  'Loft model dolazi sa ugradbenom ladicom ispod sedišta — idealno mesto za posteljinu. Čist skandinavski dizajn sa drvenim nogicama. Razvlači se unazad za jednostavno korišćenje.',
  68000,
  'cat-razvlacenje-001',
  'Velur tkanina, Hrastove noge',
  'Sofa: 220 x 90 cm / Krevet: 220 x 160 cm',
  'Maslinasto zelena',
  'in_stock',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Product Images (using Unsplash URLs)
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES
-- Milano
('prod-001', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Milano ugaona garnitura', 0),
('prod-001', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80', 'Milano detalj', 1),
-- Roma
('prod-002', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900&q=80', 'Roma kožna garnitura', 0),
('prod-002', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80', 'Roma detalj', 1),
-- Venezia
('prod-003', 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&q=80', 'Venezia modularni sistem', 0),
-- Scandic
('prod-004', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&q=80', 'Scandic kompaktna ugaona', 0),
-- Aurora
('prod-005', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', 'Aurora tapecirani krevet', 0),
('prod-005', 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=900&q=80', 'Aurora detalj', 1),
-- Natura
('prod-006', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80', 'Natura masivni krevet', 0),
('prod-006', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=900&q=80', 'Natura detalj', 1),
-- Elegante
('prod-007', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80', 'Elegante platform krevet', 0),
-- Dual Comfort
('prod-008', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80', 'Dual comfort krevet-sofa', 0),
('prod-008', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Dual comfort razvucen', 1),
-- Studio Click
('prod-009', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Studio click krevet', 0),
-- Loft
('prod-010', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', 'Loft krevet sa ladicom', 0)
ON CONFLICT DO NOTHING;
