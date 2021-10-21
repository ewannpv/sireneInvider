import fs from 'fs';
import readline from 'readline';
import { csvInformationsNeeded } from './constants/constants.js'

const generateNewHeader = () => {
  let csvHeader = "";
  let separator = ',';
  let index = 0

  for (index; index < csvInformationsNeeded.length - 1; index++)
    csvHeader += csvInformationsNeeded[index] + separator
  csvHeader += csvInformationsNeeded[index];

  return csvHeader;
}

const generateNewCSV = (filePath, header) => {
  let currentFile = header;

  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    console: false
  });

  lineReader.on('line',
    (line) => currentFile += line.toString() + '\n');
  return currentFile;

}

// generateNewCSV('src/data/sample/sample-1.csv', generateNewHeader());


