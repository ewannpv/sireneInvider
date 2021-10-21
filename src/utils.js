import fs from 'fs';
import { csvSampleDir } from './constants/constants.js';

export const numFilesinDir = (dirPath) => {
  return fs.readdirSync(dirPath).length;
}

export const createNewFile = (file, path) => {
  fs.writeFile(path, file, (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}


console.log(numFilesinDir(csvSampleDir));