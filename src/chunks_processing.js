import csvFormat from './models/csvFormat.js';
import fs from 'fs';

// Processes the given file.
const processChunk = async (mongodb, chunkFile) => {
  while (!fs.existsSync(chunkFile)) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  fs.existsSync;
  const data = fs.readFileSync(chunkFile);
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
