import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import { mongoUrl } from './constants/constants.js';
import { MongoClient } from 'mongodb';

// Processes the given file.
const processChunk = (folder, chunkFile) => {
  if (!fs.existsSync(`${folder}${chunkFile}`)) {
    return;
  }

  MongoClient.connect(
    mongoUrl,
    { useNewUrlParser: true },
    function (err, client) {
      if (err) throw err;
      if (!fs.existsSync(`${folder}${chunkFile}`)) {
        return;
      }

      const db = client.db('sirene_invider');
      const bulk = db.collection('sirene').initializeUnorderedBulkOp();
      const data = fs.readFileSync(`${folder}${chunkFile}`);
      parseChunk(bulk, data);

      // Execute the operations
      bulk.execute();

      //Delete the  file when processing is done.
      fs.unlink(`${folder}${chunkFile}`, (err) => {
        if (err) console.log(`Delete: ${err}`);
      });
    }
  );
};

// Returns a JSON object from the given data.
const parseChunk = (bulk, data) => {
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  let count = 0;
  for (let index = 0; index < lines.length; index += 1, count += 1) {
    bulk.insert(csvToJsonFormat(lines[index].split(',')));
  }
};

export default processChunk;
