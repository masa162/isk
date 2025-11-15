-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT, -- JSON array stored as text
  audio_url TEXT,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Index for published articles
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);

-- Index for category
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
