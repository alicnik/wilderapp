const router = require('express').Router();
const campgroundController = require('./controllers/campground');
const recAreaController = require('./controllers/recArea');
const userController = require('./controllers/user');
const reviewController = require('./controllers/review');
const commentController = require('./controllers/comment');

const secureRoute = require('./lib/secureRoute');

// CAMPGROUNDS

router.route('/campgrounds').get(campgroundController.index);

router.route('/campgrounds/:id').get(campgroundController.getOneSpot);

router.route('/campgrounds/:siteId/reviews').post(secureRoute, reviewController.createReview);

// REC AREAS

router.route('/recareas').get(recAreaController.index);

router.route('/recareas/:id').get(recAreaController.getOneSpot);

router.route('/queries/').get(recAreaController.paginate);

router.route('/recareas/states/:state').get(recAreaController.getByState);

router.route('/recareas/:id/campgrounds').get(campgroundController.campgroundsByRecArea);

router.route('/recareas/:siteId/reviews').post(secureRoute, reviewController.createReview);

// REVIEWS

router
  .route('/reviews/:id')
  .get(reviewController.getReview)
  .put(secureRoute, reviewController.editReview)
  .delete(secureRoute, reviewController.deleteReview);

router.route('/reviews/:id/comments').post(secureRoute, commentController.createComment);

router
  .route('/reviews/:reviewId/comments/:commentId')
  .delete(secureRoute, commentController.deleteComment)
  .put(secureRoute, commentController.editComment);

// USERS

router.route('/register').post(userController.register);

router.route('/login').post(userController.login);

router.route('/users').get(userController.getAllUsers);

router
  .route('/users/:id')
  .get(userController.getSingleUser)
  .put(secureRoute, userController.editUserProfile);

module.exports = router;
