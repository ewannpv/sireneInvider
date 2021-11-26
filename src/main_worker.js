import { chunksCSV } from './chunks_csv.js';
import { tmpDir } from './constants/constants.js';
import { checkDir } from './utils.js';
import pm2 from 'pm2';
import { mongoUrl } from './constants/constants.js';
import mongoose from 'mongoose';
import dataModel from './models/dataModel.js';

const setupMainWorker = async () => {
  // Cleans the db.
  mongoose.connect(mongoUrl, {});
  await dataModel.deleteMany({});

  // Check if tmpDir exists.
  checkDir(tmpDir);

  // Start chunking the CSV.
  chunksCSV();

  // Wait for workers.
  await waitForWorkers();

  console.log('done');
  pm2.stop(0);
};

// Wait workers to finish operations.
const waitForWorkers = async () => {
  let number1, number2;
  do {
    number1 = await dataModel.countDocuments();
    console.log('number of documents:' + number1);

    // wait 10 seconds.
    await new Promise((resolve) => setTimeout(resolve, 20000));

    number2 = await dataModel.countDocuments();
    console.log('number of documents:' + number2);
  } while (number1 + number2 >= 0);
};

export default setupMainWorker;
