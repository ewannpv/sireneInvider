import { mongoUrl, workerDir } from './src/constants/constants.js';
import { checkDir } from './src/utils.js';
import { splitFile } from './src/chunks_csv.js';
import pm2 from 'pm2';
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
      if (err) throw err;

      mongodb = client.db('sirene_invider');
      console.log(`MongoDB Connected: ${mongoUrl}`);
    }
  );

  process.on('message', (packet) => {
    processChunk(mongodb, packet.data.filename);
  });
};

pm2.connect((err) => {
  if (err) throw err;
  if (process.env.pm_id === '0') {
    generateEditedSamples();
  } else {
    setupWorkers();
  }
});
