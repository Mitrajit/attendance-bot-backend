const { save, registerFace, recogniseFace } = require('../services/register');

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
    res.status(500).json({ message: 'Please try again. Internal server error' });
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
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  recognise,
};
