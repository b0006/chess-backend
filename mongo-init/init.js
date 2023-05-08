// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MongoClient } = require('mongodb');
const uri = 'mongodb://mongodb:27017/';
const client = new MongoClient(uri);

client.connect((err) => {
  if (!err) {
    console.log('connection created');
  }
  const newDB = client.db('chess');
  newDB.createCollection('test2'); // This line is important. Unless you create collection you can not see your database in mongodb .
  client.close();
});
