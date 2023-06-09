const fs = require('fs');
const path = require('path');

const { save, registerFace, recogniseFace } = require('../services/register');

const attendance = require('../../data/attendance.json');

const register = async (req, res) => {
  try {
    // Get images from request form data
    const { img0, img1, img2, img3, img4, name } = req.body;

    // Save the images in data/train
    save(img0, 'train/img0');
    save(img1, 'train/img1');
    save(img2, 'train/img2');
    save(img3, 'train/img3');
    save(img4, 'train/img4');

    // Run the python script to train the model
    await registerFace(name);

    // Save the model in data/faces
    return res.status(200).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Please try again. Internal server error' });
  }
};

const recognise = async (req, res) => {
  try {
    // Get image from request form data
    const { img } = req.body;

    // Run the python script to recognise the face
    save(img, 'recognise/img');

    // Return the name of the person
    const data = await recogniseFace();
    if (data.name) {
      if (data.name === 'Unknown')
        throw new Error('Face not found in database.');
      else {
        // If data.name already present in attendance.json
        if (attendance[data.name]){
        data.name = `${data.name} is marked already as present.`
          return res.status(200).json(data);
        }
        // Mark data.name as present in attendance.json
        attendance[data.name] = true;
        fs.writeFileSync(
          path.join(__dirname, '../../data/attendance.json'),
          JSON.stringify(attendance)
        );
        data.name = `${data.name} is marked as present.`
        return res.status(200).json(data);
      }
    }
    throw new Error(data);
  } catch (err) {
    console.log(err);
    if (err.message === 'Face not found in database.')
      return res.status(400).json({ message: err.message });
    res.status(500).json(err);
  }
};

module.exports = {
  register,
  recognise,
};
