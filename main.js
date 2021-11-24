import { PerformanceObserver } from 'perf_hooks';
import pm2 from 'pm2';
import generateEditedSamples from './src/splitter.js';
import setupWorkers from './src/worker.js';

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`perf: ${entry.name}, duration: ${entry.duration}`);
  });
});

perfObserver.observe({ entryTypes: ['measure'], buffer: true });

pm2.connect((err) => {
  if (err) console.log(`pm2 connect: ${err}`);
  if (process.env.pm_id === '0') {
    // Main  worker.
    generateEditedSamples();
  } else {
    // Other workers.
    setupWorkers();
  }
});
