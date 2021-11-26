import processChunk from './chunks_processing.js';
import mongoose from 'mongoose';
import { mongoUrl } from './constants/constants.js';

// Setups workers.
const setupWorkers = async () => {
  mongoose.connect(mongoUrl, {});

  process.on('message', (message) => {
    const filename = message.data;
    processChunk(filename);
  });
};

export default setupWorkers;
