import { csvSampleDir } from './constants/constants';
import csvFormat from './models/csvFormat';
import { createNewFile } from './utils';

const parseChunk = (data) => {
  const file = '';
  const lines = data.toString().split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    file.push(csvFormat(lines[index].split(',')));
  }
  createNewFile(file, csvSampleDir + Math.random() * (50 - 5) + 5);
};

export default parseChunk;
