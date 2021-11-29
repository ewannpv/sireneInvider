import csvToJsonFormat from './models/csvFormat.js';
import fs from 'fs';
import dataModel from './models/dataModel.js';
import mongoose from 'mongoose';
import { mongoUrl } from './constants/constants.js';

// Processes the given file.
const processChunk = async (filename) => {
  console.log('Proccessing file:  ' + filename);
  const data = fs.readFileSync(filename);
  await parseChunk(data);

  //Delete the  file reading is done.
  fs.unlink(filename, (err) => {
    if (err) console.log(`Error while deleting: ${err}`);
  });
};

// Sends data to db.
const sendData = async (data) => {
  try {
    await dataModel.collection.insertMany(data, {
      ordered: false,
      bypassDocumentValidation: true,
    });
  } catch {
    //  Lost connection.
    console.log('Lost connection, reconnecting.');
    await mongoose.connect(mongoUrl, {});
    await sendData(data);
  }
};

// Returns a JSON object from the given data.
const parseChunk = async (data) => {
  let dataJSON = [];
  const lines = Buffer.from(data).toString().split('\n');
  lines.shift();
  let count = 0;
  for (let index = 0; index < lines.length; index += 1) {
    if (count > 2000) {
      await sendData(dataJSON);
      dataJSON = [];
      count = 0;
    }
    dataJSON.push(csvToJsonFormat(lines[index].split(',')));
    count++;
  }
  if (dataJSON.length) await sendData(dataJSON);
};

export default processChunk;
