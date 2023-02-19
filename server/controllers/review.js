const Review = require('../models/review');
const Campground = require('../models/campground');
const RecArea = require('../models/recArea');
const User = require('../models/user');

Number.prototype.roundToHalf = function () {
  return Math.round(this * 2) / 2;
};

function findSiteAndCreateReview(siteCollection, siteId, review, req, res) {
  siteCollection
    .findById(siteId)
    .populate('reviews')
    .then((site) => {
      Review.create(review)
        .then((review) => {
          site.reviews.push(review);
          const avgRatingFloat = site.reviews.reduce((total, review, i, array) => {
            return total + review.rating / array.length;
          }, 0);
          site.avgRating = avgRatingFloat.roundToHalf();
          site.save();
          res.status(201).send({ message: 'Review successfully posted.' });
          return review;
        })
        .then((review) => {
          User.findById(review.user)
            .then((user) => {
              const reviewCollection =
                siteCollection === Campground ? 'campgroundReviews' : 'recAreaReviews';
              user[reviewCollection].push(review);
              return user.save();
            })
            .then((user) => console.log(user));
        })
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
}

function createReview(req, res) {
  const siteCollection = req.url.includes('campgrounds') ? Campground : RecArea;
  const siteId = req.params.siteId;
  req.body.user = req.currentUser._id;
  siteCollection === Campground
    ? (req.body.campgroundRef = siteId)
    : (req.body.recAreaRef = siteId);
  const review = req.body;
  findSiteAndCreateReview(siteCollection, siteId, review, req, res);
}

function editReview(req, res) {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review) return res.status(404).send({ message: 'Review not found' });
      if (!review.user.equals(req.currentUser._id))
        return res.status(401).send({ message: "You can't edit someone else's review" });
      review.set(req.body);
      return review.save();
    })
    .then((updatedReview) => res.status(201).send(updatedReview));
}

function deleteReview(req, res) {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review) return res.status(404).send({ message: 'Not found' });
      if (!review.user.equals(req.currentUser._id) && !req.currentUser.isAdmin)
        return res.status(401).send({ message: "You can't delete someone else's review." });
      return review.remove();
    })
    .then((deletedReview) => res.status(200).send(deletedReview));
}

function readAllForUser(req, res) {
  Review.find({ user: req.user })
    .populate('comments')
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => console.log(err));
}

function getReview(req, res) {
  Review.findById(req.params.id)
    .then((review) => res.status(200).send(review))
    .catch((err) => console.log(err));
}

module.exports = { createReview, readAllForUser, editReview, deleteReview, getReview };
