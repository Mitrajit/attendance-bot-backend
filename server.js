/* eslint-disable global-require */
//  This eslint exception was given to import only after specific things are loaded

// Npm packages
require('dotenv').config();
const express = require('express');
const fileUpload = require("express-fileupload");
const cors = require('cors');

// Routes
const routes = require('./app/routes');

// utils
const { removeTrainedImages } = require('./app/utils');
removeTrainedImages();

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));
app.use(cors());

// Routes
app.use('/api/v1', routes);
app.get('/', (req, res) => {
  res.send('AI API running');
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`PIPELINE IMPLEMENTED server started at port ${PORT}`)
);
