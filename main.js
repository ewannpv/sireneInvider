import { PerformanceObserver } from 'perf_hooks';
import pm2 from 'pm2';
import generateEditedSamples from './src/splitter';
import setupWorkers from './src/worker';

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry);
  });
});

perfObserver.observe({ entryTypes: ['measure'], buffer: true });

pm2.connect((err) => {
  console.log(err);
  if (process.env.pm_id === '0') {
    // Main  worker.
    generateEditedSamples();
  } else {
    // Other workers.
    setupWorkers();
  }
});
