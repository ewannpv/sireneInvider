import { csvSampleDir } from './src/constants/constants.js';
import { checkDir, createNewFile } from './src/utils.js';
import splitFile from './src/chunks_csv.js';
import parseChunk from './src/chunks_processing.js';
import pm2 from 'pm2';

const generateEditedSamples = async () => {
  checkDir(csvSampleDir);
  splitFile(false);
};

const handlePacket = (packet) => {
  console.log('handlePacket');
  parseChunk(packet.data.data.data);
};

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  if (process.env.pm_id === '0') {
    generateEditedSamples();
  } else {
    process.on('message', (packet) => handlePacket(packet));
  }
});
