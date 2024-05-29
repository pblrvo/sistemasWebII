const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGODB_URI;
console.log(connectionString);
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

let dbConnection;

module.exports = {
  connectToDatabase: async () => {
    try {
      await client.connect();
      dbConnection = client.db();
      console.log("Successfully connected to database");
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  },

  getDb: function () {
    return dbConnection;
  }
};
