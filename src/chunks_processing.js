import { csvSampleDir } from './constants/constants.js';
import csvFormat from './models/csvFormat.js';
import { createNewFile } from './utils.js';

const parseChunk = (data) => {
  console.log('check parseChunk');
  const file = '';
  const lines = data.toString().split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    file.push(csvFormat(lines[index].split(',')));
  }
  createNewFile(file, csvSampleDir + Math.random() * (50 - 5) + 5);
};

export default parseChunk;
