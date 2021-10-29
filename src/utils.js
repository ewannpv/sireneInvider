import fs from "fs";

export const checkDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

export const createNewFile = (file, path) => {
  fs.writeFile(path, file, (err) => {
    if (err) throw err;
    console.log("File is created successfully.");
  });
};

// console.log(numFilesinDir(src/data/sample/));
