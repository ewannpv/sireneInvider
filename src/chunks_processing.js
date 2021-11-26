import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import dataModel from './models/dataModel.js';

// Processes the given file.
const processChunk = async (filename) => {
  const data = fs.readFileSync(filename);
  parseChunk(data);

  //Delete the  file reading is done.
  fs.unlink(filename, (err) => {
    if (err) console.log(`Error while deleting: ${err}`);
  });
};

// Sends data to db.
const sendData = async (data) => {
  dataModel.insertMany(data, { ordered: false });
};

// Returns a JSON object from the given data.
const parseChunk = async (data) => {
  let dataJSON = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  let count = 0;
  for (let index = 0; index < lines.length; index += 1) {
    dataJSON.push(csvToJsonFormat(lines[index].split(',')));
    count++;

    if (count == 100) {
      sendData(dataJSON);
      dataJSON = [];
      count = 0;
    }
  }
  if (dataJSON.length) sendData(dataJSON);
};

export default processChunk;
