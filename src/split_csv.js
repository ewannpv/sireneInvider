import fs from 'fs';
import readline from 'readline';
import { csvFilePath, maxFileNumber, maxLinesPerFiles, csvSamplePrefix } from './constants/constants.js';

let fileNumber = 0;
let currentFile = "";
let currentLine = 0;
let lineReader;
let skipCheck = false;
export const splitCSV = async () => {

    lineReader = readline.createInterface({
        input: fs.createReadStream(csvFilePath),
        output: process.stdout,
        console: false
    });

    for await (const line of lineReader) {
        readCurrentLine(line);
    }
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
    currentLine++;
    if (!skipCheck) {
        skipCheck = true;
        return;
    }

    currentFile += line.toString() + '\n';
    if (currentLine % maxLinesPerFiles == 1)
        createNewFile();
}

const closeLineReader = () => {
    createNewFile();
}

// splitCSV();