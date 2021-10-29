import fs from "fs";
import {
  csvFilePath,
  csvSamplePrefix,
  chunkSize,
} from "./constants/constants.js";

let fileNumber = 0;

const createFile = (data) => {
  fs.writeFile(`${csvSamplePrefix}${fileNumber}.csv`, data, (err) => {
    if (err) throw err;
    fileNumber++;
  });
};

export const splitFile = () => {
  fs.open(csvFilePath, "r", function (err, fd) {
    if (err) throw err;
    let buffer = Buffer.alloc(chunkSize);
    let tailBuffer = Buffer.from("", "base64");
    function readNextChunk() {
      fs.read(fd, buffer, 0, chunkSize, null, function (err, nread) {
        if (err) throw err;

        if (nread === 0) {
          // done reading file, do any necessary finalization steps

          fs.close(fd, function (err) {
            if (err) throw err;
          });
          return;
        }

        var data;
        if (nread < chunkSize) data = buffer.slice(0, nread);
        else data = buffer;
        const sliced_data = data.slice(0, data.lastIndexOf("\n"));
        createFile(Buffer.concat([tailBuffer, sliced_data]));
        tailBuffer = Buffer.from(data.slice(data.lastIndexOf("\n"), nread));
        readNextChunk();
      });
    }
    readNextChunk();
  });
};

splitFile();
