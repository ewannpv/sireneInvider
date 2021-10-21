import fs from 'fs';
import readline from 'readline';
import { csvInformationsNeeded, csvFilePath } from './constants/constants.js'

export const generateNewHeader = async () => {
  let csvHeader = "";
  let separator = ',';
  let index = 0

  for (index; index < csvInformationsNeeded.length - 1; index++)
    csvHeader += csvInformationsNeeded[index] + separator
  csvHeader += csvInformationsNeeded[index] + '\n';
  return csvHeader;
}

const getFirstLine = async (filePath) => {
  const readable = fs.createReadStream(filePath);
  const reader = readline.createInterface({ input: readable });
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  return line;
}

export const generateNewHeaderIndex = async (newHeader) => {
  const headerNeededList = newHeader.split(',');
  const headerIndex = [];

  let headerList = [];

  const line = await getFirstLine(csvFilePath);
  headerList = line.toString().split(',');
  for (let i = 0; i < headerNeededList.length; i++) {
    for (let j = 0; j < headerList.length; j++) {
      if (headerList[j] == headerNeededList[i])
        headerIndex[i] = j;
    }
  }
  return headerIndex;

}

export const generateNewCSV = async (filePath, header, headerIndex) => {
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
    let element = elements[headerIndex[index]];
    if (element == null || element.length == 0)
      element = '';
    newLine += element + ',';

  }
  let element = headerIndex[index];
  if (element == null || element.length == 0) element = '';
  return newLine += element + '\n';
}

// const newHeader = generateNewHeader();
// const headerIndex = await generateNewHeaderIndex(newHeader);
// createNewFile(await generateNewCSV('src/data/sample/sample-2.csv', newHeader, headerIndex), data/filtred.csv);
