import fs from 'fs';
import readline from 'readline';
import { csvFilePath, maxFileNumber, maxLinesPerFiles, csvSamplePrefix, csvSampleDir } from './constants/constants.js';

let fileNumber = 0;
let currentFile = "";
let currentLine = 0;
let lineReader;
export const splitCSV = () => {
    if (!fs.existsSync(csvSampleDir)) {
        fs.mkdirSync(csvSampleDir);
    }


    lineReader = readline.createInterface({
        input: fs.createReadStream(csvFilePath),
        output: process.stdout,
        console: false
    });

    lineReader.on('line',
        (line) => readCurrentLine(line)).on('close'
            , (lineno) => closeLineReader());
}

const createNewFile = () => {
    if (fileNumber++ >= maxFileNumber)
        return lineReader.close();

    fs.writeFile(`${csvSamplePrefix}${fileNumber}.csv`, currentFile, (err) => {
        if (err) throw err;
        console.log('File is created successfully.');
    });

    currentFile = "";
}

const readCurrentLine = (line) => {
    currentFile += line.toString() + '\n';
    currentLine++;
    if (currentLine % maxLinesPerFiles == 1)
        createNewFile();
}

const closeLineReader = () => {
    createNewFile();
}

splitCSV();