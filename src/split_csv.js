import readline from 'readline';
import fs from 'fs';

const fileName = "./data/StockEtablissement_utf8.csv";
const lineNumber = 0;
const lineReader = readline.createInterface({
    input: fs.createReadStream(fileName),
    output: process.stderr,
    console: false
});

let fileNumber = 0;
let currentFile = "";
const maxFileNumber = 10;
let currentLine = 0;

const createNewFile = () => {
    if (fileNumber++ >= maxFileNumber)
        return lineReader.close();

    fs.writeFile(`./data/sample/sample-${fileNumber}`, currentFile, (err) => {
        if (err) throw err;
        console.log('File is created successfully.');
    });

    currentFile = "";
}

const readCurrentLine = (line) => {
    currentFile += line.toString();
    currentLine++;
    if (currentLine % 101 == 1)
        createNewFile();
}

const closeLineReader = () => {
    createNewFile();
}

lineReader.on('line',
    (line) => readCurrentLine(line)).on('close'
        , (lineno) => closeLineReader());
