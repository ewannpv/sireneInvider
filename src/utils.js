import fs from 'fs';

export const numOfFiles = (dirPath) => {
  return fs.readdirSync(dirPath).length;
}

export const filesList = (dirPath) => {
  return fs.readdirSync(dirPath);
}

export const checkDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

export const createNewFile = (file, path) => {
  fs.writeFile(path, file, (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

// console.log(numFilesinDir(src/data/sample/));
