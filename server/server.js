const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const path =  require('path');

const { mongoose } = require('./db/mongoose');
const router = require('./router');

const app = express();

// set server port
const port = process.env.PORT || 3000;

// use middleware
// app.use(morgan('combined'));
app.use(bodyParser.json());

// this is from where all the api route handlers be called
// this should come up before the code below
router(app);

if (process.env.NODE_ENV !==  'production') {
  // webpack middleware stuff
  console.log('development mode');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('./../webpack.config');
  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  console.log('production mode');
  app.use(express.static(path.resolve(__dirname + '/../public')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
  });
}

// start server
app.listen(port, () => {
  console.log('Started on port:', port)
});


// needed for tests
module.exports = {
  app
};
