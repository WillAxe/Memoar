CREATE TABLE Users(user_id serial PRIMARY KEY, user_name VARCHAR(255) NOT NULL, user_mail VARCHAR(255) NOT NULL UNIQUE, user_password VARCHAR(255) NOT NULL, user_birthday DATE NOT NULL, user_age INTEGER NOT NULL);

