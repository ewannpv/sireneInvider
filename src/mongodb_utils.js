import { MongoClient } from 'mongodb';
import { mongoUrl } from './constants/constants.js';
var _db;

export const connectToServer = (callback) => {
  MongoClient.connect(
    mongoUrl,
    { useNewUrlParser: true },
    function (err, client) {
      _db = client.db('sirene_invider');
      console.log(`MongoDB Connected: ${mongoUrl}`);
      return callback(err);
    }
  );
};

export const getDb = () => {
  return _db;
};
