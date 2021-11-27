import { chunksCSV } from './chunks_csv.js';
import { tmpDir } from './constants/constants.js';
import { checkDir } from './utils.js';
import pm2 from 'pm2';
import { mongoUrl } from './constants/constants.js';
import mongoose from 'mongoose';
import dataModel from './models/dataModel.js';
import { performance } from 'perf_hooks';
import fs from 'fs';

let startTime;

const setupMainWorker = async () => {
  // Cleans the db.
  console.log('Cleaning database..');
  await mongoose.connect(mongoUrl, {});
  await dataModel.deleteMany();

  startTime = Date.now();
  // Check if tmpDir exists.
  checkDir(tmpDir);

  // Start chunking the CSV.
  console.log('Start spliting..');
  chunksCSV();

  // Wait for workers.
  await waitForWorkers();

  performance.mark('DONE_SENDING');
  performance.measure('EXECUTION_TIME', 'START_SPLITING', 'DONE_SENDING');
  pm2.stop(0);
};

// Wait workers to finish operations.
const waitForWorkers = async () => {
  let number, files;
  do {
    // wait 5 seconds.
    await new Promise((resolve) => setTimeout(resolve, 5000));

    number = await dataModel.countDocuments();
    const time = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${time} sec] number of documents added: ${number}`);

    // Check if all chunks have been processed.
    files = fs.readdirSync(tmpDir).length;
  } while (files > 0);
};

export default setupMainWorker;
