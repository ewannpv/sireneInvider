import { jsonDir, workerDir } from './src/constants/constants.js';
import { checkDir } from './src/utils.js';
import splitFile from './src/chunks_csv.js';
import pm2 from 'pm2';
import fs from 'fs';
import processChunk from './src/chunks_processing.js';

// Generates file samples for the workers.
const generateEditedSamples = async () => {
  // Wait for the end of pm2 init.
  // TODO: Wait until message instead.
  await new Promise((resolve) => setTimeout(resolve, 10000));
  checkDir(workerDir);
  checkDir(jsonDir);
  for (let index = 0; index < process.env.instances - 1; index++) {
    checkDir(`${workerDir}${index}/`);
  }
  splitFile();
};

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  console.log(process.env.instances);
  if (process.env.pm_id === '0') {
    generateEditedSamples();
  } else {
    const index = process.env.pm_id - 1;
    fs.watch(`${workerDir}${index}/`, (_eventType, filename) => {
      processChunk(`${workerDir}${index}/`, filename);
    });
  }
});
