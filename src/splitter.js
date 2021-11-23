import { splitFile } from './chunks_csv.js';
import { checkDir } from './utils.js';
import { workerDir } from './constants/constants.js';
import { performance } from 'perf_hooks';

// Generates file samples for the workers.
const generateEditedSamples = async () => {
  checkDir(workerDir);
  for (let index = 0; index < process.env.instances - 1; index++) {
    checkDir(`${workerDir}${index}/`);
  }

  console.log('starting');
  performance.mark('START_SPLITING');
  splitFile();
};

export default generateEditedSamples;
