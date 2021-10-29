import { csvSampleDir } from './src/constants/constants';
import { createNewFile, checkDir } from './src/utils';
import splitFile from './src/chunks_csv';

const generateEditedSamples = async () => {
  checkDir(csvSampleDir);
  splitFile(false);
};

const handlePacket = (packet) => {
  checkDir(csvSampleDir);
  createNewFile('', csvSampleDir + packet.data.index);
};

if (process.env.pm_id === '0') {
  generateEditedSamples();
} else {
  process.on('message', (packet) => handlePacket(packet));
}
