import { generateNewHeader } from './src/extract_csv.js'

const newHeader;
const headerIndex;

const getHelpers = () => {
  newHeader = generateNewHeader();
  headerIndex = generateNewHeaderIndex(newHeader);
}

