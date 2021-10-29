import { csvSampleDir } from './src/constants/constants.js';
import { checkDir, createNewFile } from './src/utils.js';
import splitFile from './src/chunks_csv.js';
import parseChunk from './src/chunks_processing.js';

const generateEditedSamples = async () => {
  checkDir(csvSampleDir);
  splitFile(false);
};

const handlePacket = (packet) => {
  console.log('handlePacket');
  parseChunk(packet.data.data);
};

if (process.env.pm_id === '0') {
  generateEditedSamples();
} else {
  console.log('Waiting for message');
  process.on('message', (packet) => handlePacket(packet));
}
