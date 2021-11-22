import csvFormat from './models/csvFormat.js';

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
  console.log('file parsed');
};

export default parseChunk;
