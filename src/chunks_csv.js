import fs from 'fs';
import { chunkSize, csvFilePath, tmpDir } from './constants/constants.js';
import { createNewFile } from './utils.js';
import { performance } from 'perf_hooks';
import sendMessage from './send_message.js';

let currentFile = 0;

// Splites the file into smaller files.
export const chunksCSV = () => {
  performance.mark('START_SPLITING');
  const fd = fs.openSync(csvFilePath, 'r');
  const buffer = Buffer.alloc(chunkSize);
  let tailBuffer = Buffer.alloc(0);

  const readNextChunk = () => {
    const nread = fs.readSync(fd, buffer, 0, chunkSize, null);

    if (nread === 0) {
      fs.closeSync(fd);

      performance.mark('END_SPLITING');
      performance.measure('SPLIT_TIME', 'START_SPLITING', 'END_SPLITING');
      console.log('Split is done.');
      return;
    }

    let data;
    if (nread < chunkSize) data = buffer.slice(0, nread);
    else data = buffer;

    const slicedData = data.slice(0, data.lastIndexOf('\n'));

    const filename = `${tmpDir}${currentFile}.csv`;
    createNewFile(Buffer.concat([tailBuffer, slicedData]), filename).then(() =>
      sendMessage(filename)
    );
    currentFile++;
    tailBuffer = Buffer.from(data.slice(data.lastIndexOf('\n'), nread));
    readNextChunk();
  };
  readNextChunk();
};
