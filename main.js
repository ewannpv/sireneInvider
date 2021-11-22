import { workerDir } from './src/constants/constants.js';
import { checkDir } from './src/utils.js';
import splitFile from './src/chunks_csv.js';
import pm2 from 'pm2';
import fs from 'fs';

const generateEditedSamples = async () => {
  checkDir(workerDir);
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
    fs.watch(`${workerDir}${index}/`, (eventType, filename) => {
      console.log(filename);
    });
  }
});
