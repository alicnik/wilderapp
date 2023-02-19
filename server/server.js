const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Router = require('./router');
const { port, dbURI } = require('./config/environment');
const path = require('path');
const dist = path.join(__dirname, 'dist');

mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    err ? console.log(err) : console.log('Mongoose connected');
  }
);

const expressServer = express();

expressServer.use((req, res, next) => {
  console.log(`Incoming ${req.method} to ${req.url}`);
  next();
});

expressServer.use(bodyParser.json());

expressServer.use('/api/', Router);

expressServer.listen(port);

module.exports = expressServer;

expressServer.use('/', express.static(dist));

expressServer.get('*', function (req, res) {
  res.sendFile(path.join(dist, 'index.html'));
});
