import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import { mongoUrl } from './constants/constants.js';
import { MongoClient } from 'mongodb';

// Processes the given file.
const processChunk = async (folder, chunkFile) => {
  if (!fs.existsSync(`${folder}${chunkFile}`)) {
    return;
  }

  const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
  const db = client.db('sirene_invider');

  if (!fs.existsSync(`${folder}${chunkFile}`)) return;

  const data = fs.readFileSync(`${folder}${chunkFile}`);
  db.collection('sirene').insertMany(parseChunk(data), {}, (err) => {
    if (err) console.log(err);
  });

  //Delete the  file when processing is done.
  fs.unlink(`${folder}${chunkFile}`, (err) => {
    if (err) console.log(`Delete: ${err}`);
  });
};

// Returns a JSON object from the given data.
const parseChunk = (data) => {
  let dataJSON = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  let count = 0;
  for (let index = 0; index < lines.length; index += 1, count += 1) {
    dataJSON.push(csvToJsonFormat(lines[index].split(',')));
  }
  return dataJSON;
};

export default processChunk;
