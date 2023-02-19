const port = process.env.PORT || 8000;

const env = process.env.NODE_ENV || 'development';

const dbURI =
  env === 'production' ? process.env.ATLASDB_URI : `mongodb://localhost/wildernessdb-${env}`;

const secret =
  'campgrounds are the same as campsites and area 51 is a rec area but trump did not want you to know';

module.exports = { port, dbURI, secret };
