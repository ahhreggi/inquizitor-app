DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  body VARCHAR(250) NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);