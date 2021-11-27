import processChunk from './chunks_processing.js';
import mongoose from 'mongoose';
import { mongoUrl } from './constants/constants.js';

let files = [];
let started = false;

export const nextFile = async () => {
  while (files.length > 0) {
    const nextFile = files.pop();
    await processChunk(nextFile);
  }
  console.log('Done.');
};

// Setups workers.
const setupWorkers = async () => {
  await mongoose.connect(mongoUrl, {});

  process.on('message', (message) => {
    const filename = message.data;
    files.push(filename);
    if (!started) {
      started = true;
      nextFile();
    }
  });
};

export default setupWorkers;
