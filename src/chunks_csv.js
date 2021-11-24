import fs from 'fs';
import { workerDir, chunkSize, csvFilePath } from './constants/constants.js';
import { createNewFile } from './utils.js';
import { performance } from 'perf_hooks';

let currentWorker = 1;
let currentFile = 0;

// Splites the file into smaller files.
export const splitFile = () => {
  fs.open(csvFilePath, 'r', (err, fd) => {
    if (err) console.log(`split file 12: ${err}`);
    const buffer = Buffer.alloc(chunkSize);
    let tailBuffer = Buffer.alloc(0);
    const readNextChunk = () => {
      fs.read(fd, buffer, 0, chunkSize, null, (err2, nread) => {
        if (err2) console.log(`split file 17: ${err2}`);

        if (nread === 0) {
          fs.close(fd, (err3) => {
            if (err3) console.log(`split file 21: ${err3}`);
          });
          performance.mark('END_SPLITING');
          performance.measure('SPLIT_TIME', 'START_SPLITING', 'END_SPLITING');
          console.log('Split is done.');
          return;
        }

        let data;
        if (nread < chunkSize) data = buffer.slice(0, nread);
        else data = buffer;

        const slicedData = data.slice(0, data.lastIndexOf('\n'));

        if (currentWorker >= process.env.instances - 1) currentWorker = 0;
        const filename = `${workerDir}${currentWorker}/${currentFile}.csv`;
        createNewFile(Buffer.concat([tailBuffer, slicedData]), filename);
        currentFile++;
        currentWorker++;

        tailBuffer = Buffer.from(data.slice(data.lastIndexOf('\n'), nread));
        readNextChunk();
      });
    };
    readNextChunk();
  });
};
