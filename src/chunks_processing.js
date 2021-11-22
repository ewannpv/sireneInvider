import csvFormat from './models/csvFormat.js';
import fs from 'fs';

// Processes the given file.
const processChunk = (mongodb, folder, chunkFile) => {
  const data = fs.readFileSync(`${folder}${chunkFile}`);
  const chunkJson = parseChunk(data);

  //saveJson(chunkFile, chunkJson);
  mongodb.collection('sirene').insert(chunkJson);
};

// Returns a JSON object from the given data.
const parseChunk = (data) => {
  var dateJson = {
    data: [],
  };
  const lines = Buffer(data).toString().split('\n');
  lines.shift();
  for (let index = 0; index < lines.length; index += 1) {
    dateJson.data.push(csvFormat(lines[index].split(',')));
  }
  return dateJson;
};

export default processChunk;
