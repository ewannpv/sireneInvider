import { MongoClient } from 'mongodb';
import { mongoUrl } from './constants/constants.js';
var _db;
var _bulk;
export const connectToServer = (callback) => {
  MongoClient.connect(
    mongoUrl,
    { useNewUrlParser: true },
    function (err, client) {
      if (err) throw err;
      _db = client.db('sirene_invider');
      _bulk = _db.collection('sirene').initializeUnorderedBulkOp();
      console.log(`MongoDB Connected: ${mongoUrl}`);
      return callback(err);
    }
  );
};

export const getDb = () => {
  return _db;
};

export const getBulk = () => {
  return _bulk;
};
