import fs from 'fs';
import { workerDir, chunkSize, csvFilePath } from './constants/constants.js';
import { createNewFile } from './utils.js';
import pm2 from 'pm2';
import { performance } from 'perf_hooks';
import { packet, signal } from './models/packet.js';

let currentWorker = 1;
let currentFile = 0;

// Splites the file into smaller files.
export const splitFile = () => {
  fs.open(csvFilePath, 'r', (err, fd) => {
    if (err) throw err;
    const buffer = Buffer.alloc(chunkSize);
    let tailBuffer = Buffer.alloc(0);
    const readNextChunk = () => {
      fs.read(fd, buffer, 0, chunkSize, null, (err2, nread) => {
        if (err2) throw err2;

        if (nread === 0) {
          fs.close(fd, (err3) => {
            if (err3) throw err3;
          });
          performance.mark('END_SPLITING');
          performance.measure('SPLIT_TIME', 'START_SPLITING', 'END_SPLITING');
          console.log('Split is done.');
          for (let index = 1; index < process.env.instances - 1; index++) {
            pm2.sendDataToProcessId(signal(index, 'stop'), (err6) => {
              if (err6) throw err6;
            });
          }
          return;
        }

        let data;
        if (nread < chunkSize) data = buffer.slice(0, nread);
        else data = buffer;

        const slicedData = data.slice(0, data.lastIndexOf('\n'));

        if (currentWorker >= process.env.instances - 1) currentWorker = 1;
        const filename = `${workerDir}${currentFile}.csv`;
        const file = Buffer.concat([tailBuffer, slicedData]);

        createNewFile(file, filename);
        pm2.sendDataToProcessId(packet(currentWorker, filename), (err6) => {
          if (err6) throw err6;
        });

        currentFile++;
        currentWorker++;

        tailBuffer = Buffer.from(data.slice(data.lastIndexOf('\n'), nread));
        readNextChunk();
      });
    };
    readNextChunk();
  });
};

export const sendLastdChuk = (folder) => {
  createNewFile('', `${folder}/end`);
};
