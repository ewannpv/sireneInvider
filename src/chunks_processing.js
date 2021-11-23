import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import * as mongoUtil from './mongodb_utils.js';

// Processes the given file.
const processChunk = (folder, chunkFile) => {
  const data = fs.readFileSync(`${folder}${chunkFile}`);
  const chunkJson = parseChunk(data);

  //saveJson(chunkFile, chunkJson);
  const mongodb = mongoUtil.getDb();
  mongodb.collection('sirene').insertMany(chunkJson);

  //Delete the  file when processing is done.
  fs.unlink(`${folder}${chunkFile}`, (err) => {
    if (err) console.log(err);
  });
};

// Returns a JSON object from the given data.
const parseChunk = (data) => {
  var dateJson = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  for (let index = 0; index < lines.length; index += 1) {
    dateJson.push(csvToJsonFormat(lines[index].split(',')));
  }
  return dateJson;
};

export default processChunk;
