import { generateNewHeader, generateNewCSV, generateNewHeaderIndex } from './src/extract_csv.js'
import { csvSampleDir, csvEditedDir } from './src/constants/constants.js';
import { filesList, createNewFile, checkDir } from './src/utils.js';
import { splitCSV } from './src/split_csv.js'
import fs from 'fs';

let _newHeader;
let _headerIndex;

const getHelpers = async () => {
  _newHeader = await generateNewHeader();
  _headerIndex = await generateNewHeaderIndex(_newHeader);
}


const samplesWatcher = async () => {
  const watcher = fs.watch(csvSampleDir, async (eventType, filename) => {
    const newFile = await generateNewCSV(csvSampleDir + filename, _newHeader, _headerIndex);
    createNewFile(newFile, csvEditedDir + filename);
  })
}

const generateEditedSamples = async () => {
  checkDir(csvSampleDir);
  checkDir(csvEditedDir);
  await getHelpers();
  samplesWatcher();
  splitCSV();
}

generateEditedSamples();