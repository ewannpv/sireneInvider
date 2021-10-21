import fs from 'fs';

export const numFilesinDir = (dirPath) => {

  filenames = fs.readdirSync(dirPath);
  return filenames.lenght - 1;

}

export const createNewFile = (file, path) => {
  fs.writeFile(path, file, (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

numFilesinDir('./data/sample');