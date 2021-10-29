import fs from 'fs';
import pm2 from 'pm2';
import { csvSampleDir, chunkSize, csvFilePath } from './constants/constants';
import packet from './models/packet';
import { createNewFile } from './utils';

let currentWorker = 1;
let currentFile = 0;

const sendDataToWorker = (data) => {
  if (currentWorker >= process.env.instances) currentWorker = 1;
  pm2.sendDataToProcessId(packet(currentWorker, data));
  currentWorker += 1;
};

const splitFile = (saveLocaly) => {
  fs.open(csvFilePath, 'r', (err, fd) => {
    if (err) throw err;
    const buffer = Buffer.alloc(chunkSize);
    let tailBuffer = Buffer.alloc(0);
    function readNextChunk() {
      fs.read(fd, buffer, 0, chunkSize, null, (err2, nread) => {
        if (err2) throw err;

        if (nread === 0) {
          fs.close(fd, (err3) => {
            if (err3) throw err;
          });
          return;
        }

        let data;
        if (nread < chunkSize) data = buffer.slice(0, nread);
        else data = buffer;

        const slicedData = data.slice(0, data.lastIndexOf('\n'));
        if (saveLocaly) {
          const filename = `${csvSampleDir}${currentFile}.csv`;
          createNewFile(Buffer.concat([tailBuffer, slicedData]), filename);
          currentFile += 1;
        } else {
          sendDataToWorker(Buffer.concat([tailBuffer, slicedData]));
        }
        tailBuffer = Buffer.from(data.slice(data.lastIndexOf('\n'), nread));
        readNextChunk();
      });
    }
    readNextChunk();
  });
};

export default splitFile;
