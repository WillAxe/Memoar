CREATE TABLE user_rooms(
  user_room_id serial PRIMARY KEY, 
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  room_id INTEGER REFERENCES rooms(room_id) ON DELETE CASCADE,
  joined_room TIMESTAMP DEFAULT NOW()
  );