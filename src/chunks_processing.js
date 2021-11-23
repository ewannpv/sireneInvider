import csvFormat from './models/csvFormat.js';
import fs from 'fs';

// Processes the given file.
const processChunk = (mongodb, folder, chunkFile) => {
  const data = fs.readFileSync(`${folder}${chunkFile}`);
  const chunkJson = parseChunk(data);

  //saveJson(chunkFile, chunkJson);
  console.log(chunkJson.length);
  mongodb.collection('sirene').insertMany(chunkJson);
};

// Returns a JSON object from the given data.
const parseChunk = (data) => {
  var dateJson = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  for (let index = 0; index < lines.length; index += 1) {
    dateJson.push(csvFormat(lines[index].split(',')));
  }
  return dateJson;
};

export default processChunk;
