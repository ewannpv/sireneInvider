import { MongoClient } from 'mongodb';
import { mongoUrl } from './constants/constants';

let _db;

export const connect = async () => {
  let db = await MongoClient.connect(mongoUrl);
  _db = db.collection('sirene');
};

export const insertMany = async (data) => {
  await _db.insertMany(data);
};
