import fs from 'fs';
import readline from 'readline';
import { csvInformationsNeeded, csvHeaderFilePath } from './constants/constants.js'

export const generateNewHeader = () => {
  let csvHeader = "";
  let separator = ',';
  let index = 0

  for (index; index < csvInformationsNeeded.length - 1; index++)
    csvHeader += csvInformationsNeeded[index] + separator
  csvHeader += csvInformationsNeeded[index] + '\n';

  return csvHeader;
}

export const generateNewHeaderIndex = async (newHeader) => {
  const headerNeededList = newHeader.split(',');
  const headerIndex = [];
  const lineReader = readline.createInterface({
    input: fs.createReadStream(csvHeaderFilePath),
    output: process.stdout,
    console: false
  });

  let headerList = [];

  for await (const line of lineReader) {
    headerList = line.toString().split(',');
    for (let i = 0; i < headerNeededList.length; i++) {
      for (let j = 0; j < headerList.length; j++) {
        if (headerList[j] == headerNeededList[i])
          headerIndex[i] = j;
      }
    }
    return headerIndex;
  }
}

const generateNewCSV = async (filePath, header, headerIndex) => {
  let currentFile = header;
  const headerLen = header.split(',').length;

  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    console: false
  });

  for await (const line of lineReader) {
    const newLine = generateNewDataLine(line, headerLen, headerIndex);
    currentFile += newLine;
  }
  return currentFile;
}


const generateNewDataLine = (line, headerLen, headerIndex) => {
  const elements = line.toString().split(',');
  let newLine = "";
  let index = 0

  for (index; index < headerLen - 2; index++) {
    const element = elements[headerIndex[index]];

    if (element != null && element.length > 0)
      newLine += element + ',';
    else {
      return '';
    }
  }
  const element = headerIndex[index];
  if (element == null || element.length == 0) return '';
  return newLine += element + '\n';
}


const createNewFile = (file) => {
  fs.writeFile(`edited.csv`, file, (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

// const newHeader = generateNewHeader();
// const headerIndex = await generateNewHeaderIndex(newHeader);
// createNewFile(await generateNewCSV('src/data/sample/sample-2.csv', newHeader, headerIndex));
