import { splitFile } from './chunks_csv.js';
import { checkDir } from './utils.js';
import { tmpDir, workerDir } from './constants/constants.js';
import { performance } from 'perf_hooks';
import fs from 'fs';
import pm2 from 'pm2';

// Generates file samples for the workers.
const generateEditedSamples = async () => {
  checkDir(tmpDir);
  checkDir(workerDir);
  for (let index = 0; index < process.env.instances - 1; index++) {
    checkDir(`${workerDir}${index}/`);
  }
  console.log('starting');
  performance.mark('START_SPLITING');
  splitFile();
  // waitForWorkers();
};

const waitForWorkers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  for (let index = 0; index < process.env.instances - 1; index++) {
    fs.readdir(`${workerDir}${index}/`, (err, files) => {
      //handling error
      if (files.length > 0) {
        return waitForWorkers();
      }
    });
  }
  performance.mark('JOB_DONE');
  performance.measure('DONE :)', 'START_SPLITING', 'JOB_DONE');
  //pm2.stop(process.env.pm_id);
};
export default generateEditedSamples;
