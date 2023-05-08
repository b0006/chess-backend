conn = new Mongo();
// TODO: get MONGODB_DB_NAME from .env
db = conn.getDB('chess');

// INIT THE FIRST PROFILE AT DATABASE
db.users.insert({
  username: 'test',
  email: 'test@mail.ru',
  password: '$2b$08$Z6TwysYYO0KeZ3k0bY/MA.rCMtC0eFxzBWsb2lAa6wnPC7xwjGOmu', // 13820003
});
