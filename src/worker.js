import { mongoUrl, workerDir } from './constants/constants.js';
import processChunk from './chunks_processing.js';
import fs from 'fs';
import pm2 from 'pm2';
import mongoose from 'mongoose';
import dataModel from './models/dataModel.js';

// import { performance } from 'perf_hooks';

let iteration = 1;

// Setups workers.
const setupWorkers = async () => {
  //performance.mark('START_WORKER');
  mongoose.connect(mongoUrl, {});
  dataModel.count({}, function (err, count) {
    console.log('Number of users at start: ', count);
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));
  processFolder();
};

const processFolder = async () => {
  const index = process.env.pm_id - 1;
  await fs.readdir(`${workerDir}${index}/`, (err, files) => {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    if (!files.length) {
      console.log(`Done in ${iteration++} iterations`);
      // performance.mark('END_WORKER');
      // performance.measure(
      //   'START_WORKER',
      //   'END_WORKER',
      //   `WORKER_${process.env.pm_id}`
      // );
      dataModel.count({}, function (err, count) {
        console.log('Number of users at the end: ', count);
      });
      pm2.stop(process.env.pm_id);
      return;
    }
    console.log(`iteration ${iteration++}, files ${files.length}`);

    for (let index = 0; index < files.length; index++) {
      processChunk(`${workerDir}${index}/`, files[index]);
    }
  });
  processFolder();
};

export default setupWorkers;
