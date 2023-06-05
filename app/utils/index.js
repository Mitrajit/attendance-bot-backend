const path = require('path');
const fs = require('fs');

const parseBase64 = (base64) => {
  const base64Parts = base64.split(';base64,');
  const mimetype = base64Parts[0];
  const buffer = Buffer.from(base64Parts[1], 'base64');

  return { mimetype, buffer };
};

const removeTrainedImages = () => {
  const trainingPath = path.join(__dirname, '../../data/train');
  fs.readdirSync(trainingPath).forEach((file) => {
    fs.unlinkSync(path.join(trainingPath, file));
  });
};

module.exports = {
  parseBase64,
  removeTrainedImages,
};
