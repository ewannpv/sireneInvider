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
  startTime = Date.now();
  // Check if tmpDir exists.
  checkDir(tmpDir);

  // Start chunking the CSV.
  console.log('Start spliting..');
  chunksCSV();

  // Wait for workers.
  waitForWorkers();
};

// Wait workers to finish operations.
const waitForWorkers = async () => {
  await mongoose.connect(mongoUrl, {});

  let number;
  fs.watch(tmpDir, async () => {
    const files = fs.readdirSync(tmpDir).length;
    const time = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${time} sec] remaining files: ${files}`);

    // Check if all chunks have been processed.
    if (files == 0) {
      performance.mark('DONE_SENDING');
      performance.measure('EXECUTION_TIME', 'START_SPLITING', 'DONE_SENDING');
      number = await dataModel.countDocuments();
      console.log(`final number of document: ${number}`);
      pm2.stop(0);
    }
  });
};

export default setupMainWorker;
