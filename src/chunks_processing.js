import { csvSampleDir } from './constants/constants.js';
import csvFormat from './models/csvFormat.js';
import { createNewFile } from './utils.js';

const parseChunk = (data) => {
  console.log('check parseChunk');
  var obj = {
    data: [],
  };
  const lines = Buffer(data).toString().split('\n');
  lines.shift();
  console.log('lines ' + lines.length);
  for (let index = 0; index < lines.length; index += 1) {
    obj.data.push(csvFormat(lines[index].split(',')));
  }
  createNewFile(
    JSON.stringify(obj),
    csvSampleDir + Math.random() * (50 - 5) + 5
  );
};

export default parseChunk;
