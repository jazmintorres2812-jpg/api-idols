CREATE TABLE IF NOT EXISTS idols (
  id BIGSERIAL PRIMARY KEY,
  stage_name VARCHAR(120) NOT NULL,
  real_name VARCHAR(160),
  group_name VARCHAR(120),
  country VARCHAR(80) NOT NULL,
  gender VARCHAR(30),
  debut_date DATE,
  agency VARCHAR(160),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_idols_group_name ON idols (group_name);
CREATE INDEX IF NOT EXISTS idx_idols_country ON idols (country);
CREATE UNIQUE INDEX IF NOT EXISTS idx_idols_stage_name_unique ON idols (stage_name);

INSERT INTO idols (stage_name, real_name, group_name, country, gender, debut_date, agency) VALUES
('Jungkook', 'Jeon Jung-kook', 'BTS', 'Corea del Sur', 'masculino', '2013-06-13', 'BIGHIT MUSIC'),
('IU', 'Lee Ji-eun', NULL, 'Corea del Sur', 'femenino', '2008-09-18', 'EDAM Entertainment'),
('Lisa', 'Lalisa Manobal', 'BLACKPINK', 'Tailandia', 'femenino', '2016-08-08', 'YG Entertainment'),
('Momo', 'Hirai Momo', 'TWICE', 'Japón', 'femenino', '2015-10-20', 'JYP Entertainment'),
('Miyawaki Sakura', 'Sakura Miyawaki', 'LE SSERAFIM', 'Japón', 'femenino', '2022-05-02', 'SOURCE MUSIC'),
('Jackson Wang', 'Wang Jia-er', 'GOT7', 'Hong Kong', 'masculino', '2014-01-16', 'TEAM WANG')
ON CONFLICT (stage_name) DO NOTHING;
