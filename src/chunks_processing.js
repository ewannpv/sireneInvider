import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import dataModel from './models/dataModel.js';

// Processes the given file.
const processChunk = (folder, chunkFile) => {
  if (!fs.existsSync(`${folder}${chunkFile}`)) {
    return;
  }

  if (!fs.existsSync(`${folder}${chunkFile}`)) return;

  const data = fs.readFileSync(`${folder}${chunkFile}`);
  const dataParsed = parseChunk(data);
  //Delete the  file when processing is done.
  fs.unlink(`${folder}${chunkFile}`, (err) => {
    if (err) console.log(`Delete: ${err}`);
  });

  dataModel
    .insertMany(dataParsed)
    .then(function () {
      console.log('Data inserted');
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Returns a JSON object from the given data.
const parseChunk = (data) => {
  let dataJSON = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  let count = 0;
  for (let index = 0; index < lines.length; index += 1, count += 1) {
    dataJSON.push(csvToJsonFormat(lines[index].split(',')));
  }
  return dataJSON;
};

export default processChunk;
