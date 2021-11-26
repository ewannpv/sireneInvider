import fs from 'fs';

export const checkDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

export const createNewFile = async (file, path) => {
  return fs.writeFileSync(path, file);
};
