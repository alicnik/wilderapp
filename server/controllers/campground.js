const Campground = require('../models/campground');
const RecArea = require('../models/recArea');

function index(req, res) {
  Campground.find().then((campgrounds) => {
    // campgrounds.length = 25
    res.send(campgrounds);
  });
}

function getOneSpot(req, res) {
  Campground.findById(req.params.id)
    .populate('reviews')
    .then((campground) => {
      if (!campground) return res.status(404).send({ message: 'Campground not found.' });
      res.send(campground);
    });
}

function campgroundsByRecArea(req, res) {
  RecArea.findById(req.params.id)
    .then((recArea) => {
      if (!recArea) return res.status(404).send({ message: 'Campground not found' });
      Campground.find({ ridbRecAreaId: recArea.ridbRecAreaId })
        .then((campgrounds) => res.send(campgrounds))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => console.log(err));
}

module.exports = {
  index,
  getOneSpot,
  campgroundsByRecArea,
};
