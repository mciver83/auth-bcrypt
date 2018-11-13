INSERT INTO users (name, email, password, is_admin)
VALUES (${name}, ${email}, ${hash}, ${isAdmin})
RETURNING *;