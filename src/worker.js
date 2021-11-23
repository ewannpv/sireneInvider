import * as mongoUtil from './mongodb_utils.js';
import { checkDir } from './utils.js';
import { workerDir } from './constants/constants.js';
import processChunk from './chunks_processing.js';
import pm2 from 'pm2';
import fs from 'fs';

// Setups workers.
const setupWorkers = async () => {
  await mongoUtil.connectToServer(function (err) {
    if (err) console.log('11' + err);
  });
  const index = process.env.pm_id - 1;
  checkDir(`${workerDir}${index}/`);
  fs.watch(`${workerDir}${index}/`, (event, filename) => {
    if (fs.existsSync(`${workerDir}${index}/${filename}`)) {
      processChunk(`${workerDir}${index}/`, filename);
    }
    // If dir is empty,stop the worker.
    else if (fs.readdirSync(workerDir).length === 0) {
      console.log(`Killing worker ${process.env.pm_id}`);
      pm2.stop(process.env.pm_id);
    }
  });
};

export default setupWorkers;
