import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import { mongoUrl } from './constants/constants.js';
import { MongoClient } from 'mongodb';

// Processes the given file.
const processChunk = (folder, chunkFile) => {
  if (!fs.existsSync(`${folder}${chunkFile}`)) {
    return;
  }

  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
    const db = client.db('sirene_invider');

    if (!fs.existsSync(`${folder}${chunkFile}`)) return;

    let data = fs.readFileSync(`${folder}${chunkFile}`);
    data = parseChunk(data);
    //Delete the  file when processing is done.
    fs.unlink(`${folder}${chunkFile}`, (err) => {
      if (err) console.log(`Delete: ${err}`);
    });
    db.collection('sirene').insertMany(data);
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
