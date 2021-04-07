DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(20),
  coverphoto_url VARCHAR(255)
);