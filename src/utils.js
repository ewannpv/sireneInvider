import fs from 'fs';
import { jsonDir } from './constants/constants.js';

export const checkDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

export const createNewFile = (file, path) => {
  fs.writeFile(path, file, (err) => {
    if (err) throw err;
  });
};

export const saveJson = (chunkFile, chunkJson) => {
  const filename = `${jsonDir}/${chunkFile}.json`;
  createNewFile(JSON.stringify(chunkJson), filename);
};
