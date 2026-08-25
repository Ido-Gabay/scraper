-- ────────────────────────────────────────────────────────────────────────────
-- Supabase schema for the Admin Lead Dashboard
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Create businesses table
create table if not exists businesses (
  id           bigint primary key generated always as identity,
  slug         text not null unique,
  name         text not null,
  category     text not null,          -- e.g. 'קליניקה', 'צילום', etc.
  phone        text not null default '',
  address      text,
  rating       numeric(3,1) not null default 5,
  review_count integer not null default 0,
  status       text not null default 'new'
                 check (status in ('new','sent','negotiating','closed','irrelevant')),
  created_at   timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS) — open read/write for anon key (admin-only app)
alter table businesses enable row level security;

create policy "allow all for anon" on businesses
  for all using (true) with check (true);

-- 3. Index for fast filtering
create index if not exists businesses_status_idx  on businesses (status);
create index if not exists businesses_category_idx on businesses (category);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Seed data (generated from pages_data.json)
-- ────────────────────────────────────────────────────────────────────────────

insert into businesses (slug, name, category, phone, address, rating, review_count) values
  ('ha-marpea-dental-aesthetics',   'המרפאה - רפואת שיניים ואסתטיקה',          'קליניקה',      '051-270-3433', 'הנדיב 71, קומה 1, הרצליה',          5,   24),
  ('inspire-event-photography',     'אינספאייר צילום ארועים',                    'צילום',         '052-718-0227', 'מרכז רימונים, בני ברק',              4.9, 220),
  ('tamnahli-photography',          'תמונה''לי | טל אזגורי צלמת',               'צילום',         '054-540-8204', 'הלל 3, הרצליה',                      5,   15),
  ('nagariya-amit',                 'נגריית עמית בע"מ',                          'נגרות/ריהוט',   '03-904-4355',  'בר כוכבא 74, פתח תקווה',            4.7, 25),
  ('yaakov-hanagar',                'יעקב הנגר',                                 'נגרות/ריהוט',   '055-234-3775', 'בן ציון גליס 30, פתח תקווה',        4.2, 41),
  ('noam-chagoel-mashkanta',        'נועם חגואל — משכנתא בהתאמה אישית',         'פיננסי',        '050-670-9050', 'רחוב אריה שנקר 14, הרצליה',          5,   46),
  ('elad-blank-mashkanta',          'אלעד בלנק — יועץ משכנתאות',                'פיננסי',        '054-466-0139', 'ארלוזורוב 16, רעננה',                5,   122),
  ('yael-pinchas-personal-trainer', 'יעל פנחס — מאמנת כושר אישית',              'כושר',          '054-989-9305', 'ספורטק צפון, רוקח 41, תל אביב',     4.9, 39),
  ('dvir-wagner-personal-trainer',  'דביר וגנר — מאמן כושר אישי',               'כושר',          '052-309-0112', 'קרליבך 18, תל אביב',                 5,   32),
  ('hadar-hakosher-studio-tlv',     'חדר הכושר — סטודיו לאימונים אישיים',        'כושר',          '054-633-1087', 'נחמני 28, תל אביב',                  4.9, 59),
  ('toolbox-fitness-studio',        'Toolbox סטודיו כושר',                       'כושר',          '054-520-7177', 'ארלוזורוב 76, תל אביב',              4.8, 29),
  ('go-x-group-fitness',            'Go X — אימון כושר קבוצתי',                  'כושר',          '050-769-0677', 'פינסקר 37, תל אביב',                 4.9, 63)
on conflict (slug) do nothing;
