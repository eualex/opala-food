CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  email TEXT, 
  password TEXT, 
  name TEXT, 
  gender TEXT
)
