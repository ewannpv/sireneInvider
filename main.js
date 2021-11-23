import { mongoUrl, workerDir } from './src/constants/constants.js';
import { checkDir } from './src/utils.js';
import { splitFile } from './src/chunks_csv.js';
import pm2 from 'pm2';
import fs from 'fs';
import processChunk from './src/chunks_processing.js';
import { MongoClient } from 'mongodb';
import { performance, PerformanceObserver } from 'perf_hooks';

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry);
  });
});

perfObserver.observe({ entryTypes: ['measure'], buffer: true });

// Generates file samples for the workers.
const generateEditedSamples = async () => {
  checkDir(workerDir);
  for (let index = 0; index < process.env.instances - 1; index++) {
    checkDir(`${workerDir}${index}/`);
  }

  // Wait for the end of pm2 init.
  // TODO: Wait until message instead.
  await new Promise((resolve) => setTimeout(resolve, 10000));
  performance.mark('START_SPLITING');
  splitFile();
};

// Setups workers.
const setupWorkers = () => {
  let mongodb;
  MongoClient.connect(
    mongoUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        return console.log(err);
      }

      mongodb = client.db('sirene_invider');
      console.log(`MongoDB Connected: ${mongoUrl}`);
    }
  );

  const index = process.env.pm_id - 1;
  checkDir(`${workerDir}${index}/`);
  fs.watch(`${workerDir}${index}/`, (event, filename) => {
    if (fs.existsSync(`${workerDir}${index}/${filename}`)) {
      processChunk(mongodb, `${workerDir}${index}/`, filename);
    }
    // If dir is empty,stop the worker.
    else if (fs.readdirSync(workerDir).length === 0) {
      console.log(`Killing worker ${process.env.pm_id}`);
      pm2.stop(process.env.pm_id);
    }
  });
};

pm2.connect((err) => {
  if (err) throw err;
  if (process.env.pm_id === '0') {
    // Main  worker.
    generateEditedSamples();
  } else {
    // Other workers.
    setupWorkers();
  }
});
