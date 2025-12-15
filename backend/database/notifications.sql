CREATE TABLE notifications(
  notification_id serial PRIMARY KEY, 
  user_id INTEGER REFERENCES users(user_id) NOT NULL, 
  room_id INTEGER NOT NULL REFERENCES rooms(room_id) NOT NULL,
  invite_text VARCHAR(50), 
  is_read BOOLEAN DEFAULT false, 
  handled BOOLEAN DEFAULT false, 
  sent_at TIMESTAMP DEFAULT NOW()
  );