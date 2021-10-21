import readline from 'readline';
import fs from 'fs';
import { csvFilePath, maxFileNumber, maxLinesPerFiles } from './constants/constants.js';

console.log(csvFilePath);
const lineNumber = 0;
const lineReader = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    output: process.stderr,
    console: false
});

let fileNumber = 0;
let currentFile = "";
let currentLine = 0;

const createNewFile = () => {
    if (fileNumber++ >= maxFileNumber)
        return lineReader.close();

    fs.writeFile(`src/data/sample/sample-${fileNumber}.csv`, currentFile, (err) => {
        if (err) throw err;
        console.log('File is created successfully.');
    });

    currentFile = "";
}

const readCurrentLine = (line) => {
    currentFile += line.toString();
    currentLine++;
    if (currentLine % maxLinesPerFiles == 1)
        createNewFile();
}

const closeLineReader = () => {
    createNewFile();
}

lineReader.on('line',
    (line) => readCurrentLine(line)).on('close'
        , (lineno) => closeLineReader());
