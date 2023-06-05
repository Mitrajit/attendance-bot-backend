const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const { parseBase64, removeTrainedImages } = require('../utils');

const save = (data, name) => {
  try {
    // Parse base64 image
    const { mimetype, buffer } = parseBase64(data);

    // Save the image in data/train
    const path = `data/${name}.${mimetype.split('/')[1]}`;

    fs.writeFileSync(path, buffer, 'base64');

    return { message: 'Image saved successfully' };
  } catch (err) {
    console.log(err);
    return { message: 'Internal server error' };
  }
};

const registerFace = (name) =>
  new Promise((resolve, reject) => {
    const trainingPath = path.join(__dirname, '../../data/train');
    const pyProcess = spawn('python3', [
      path.join(__dirname, '../scripts/train.py'),
      trainingPath,
      name,
    ]);

    pyProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    pyProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    pyProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ message: 'Model trained successfully' });
      } else {
        reject({ message: 'Internal server error' });
      }
      // delete all files from data/train
      removeTrainedImages();
    });
  });

const recogniseFace = () =>
  new Promise((resolve, reject) => {
    const pyProcess = spawn('python3', [
      path.join(__dirname, '../scripts/recognise.py'),
      path.join(__dirname, '../../data/recognise/img.jpeg'),
    ]);

    pyProcess.stdout.on('data', (data) => {
      const name = data.toString();
      return resolve({
        message: 'Face recognised successfully',
        name: name.split('/').slice(-1)[0].trim(),
      });
    });

    pyProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    pyProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ message: 'Face not found in database.' });
      } else {
        reject({ message: 'Internal server error' });
      }
    });
  });
module.exports = {
  save,
  registerFace,
  recogniseFace,
};
