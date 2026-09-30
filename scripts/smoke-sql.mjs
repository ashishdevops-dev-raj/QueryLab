import alasql from "alasql";

alasql("CREATE TABLE users (id INT, username STRING, role STRING, age INT)");
alasql("INSERT INTO users VALUES (1,'John','admin',20),(2,'Jane','user',30)");
alasql("CREATE TABLE posts (id INT, user_id INT, title STRING, body STRING, status STRING)");
alasql(
  "INSERT INTO posts VALUES (1,1,'Hello World','This is my first post','published'),(2,1,'Hello World','This is my second post','published'),(3,2,'Hello World','This is my third post','published')",
);
const rows = alasql(
  "SELECT u.id, u.username, u.role, p.title, p.body, p.user_id, p.status FROM users u JOIN posts p ON u.id = p.user_id",
);
console.log(JSON.stringify(rows, null, 2));
