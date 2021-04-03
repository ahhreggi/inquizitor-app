DROP TABLE IF EXISTS quiz_ratings CASCADE;

CREATE TABLE quiz_ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL,
  comment VARCHAR(255)
);