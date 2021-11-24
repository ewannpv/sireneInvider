import { workerDir } from './constants/constants.js';
import processChunk from './chunks_processing.js';
import fs from 'fs';
import pm2 from 'pm2';

// import { performance } from 'perf_hooks';

let iteration = 1;

// Setups workers.
const setupWorkers = () => {
  //performance.mark('START_WORKER');
  processFolder();
};

const processFolder = async () => {
  console.log('Waiting files');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const index = process.env.pm_id - 1;
  fs.readdir(`${workerDir}${index}/`, (err, files) => {
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
      pm2.stop(process.env.pm_id);
      return;
    }
    console.log(`iteration ${iteration++}, files ${files.length}`);
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      processChunk(`${workerDir}${index}/`, file);
    });
  });
  processFolder();
};

export default setupWorkers;
