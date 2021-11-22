import csvFormat from './models/csvFormat.js';
import fs from 'fs';
import { jsonDir } from './constants/constants.js';
import { createNewFile } from './utils.js';

// Processes the given file.
const processChunk = (folder, chunkFile) => {
  const data = fs.readFileSync(`${folder}${chunkFile}`);
  const chunkJson = parseChunk(data);
  const filename = `${jsonDir}/${chunkFile}.json`;
  createNewFile(JSON.stringify(chunkJson), filename);
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
