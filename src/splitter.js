import { splitFile } from './src/chunks_csv.js';
import { checkDir } from './src/utils.js';
import { workerDir } from './src/constants/constants.js';
import { performance } from 'perf_hooks';

// Generates file samples for the workers.
const generateEditedSamples = async () => {
  checkDir(workerDir);
  for (let index = 0; index < process.env.instances - 1; index++) {
    checkDir(`${workerDir}${index}/`);
  }

  // Wait for the end of pm2 init.
  // TODO: Wait until message instead.
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('starting');
  performance.mark('START_SPLITING');
  splitFile();
};

export default generateEditedSamples;
