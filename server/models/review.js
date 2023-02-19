const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    dateVisited: { type: String },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    recAreaRef: { type: mongoose.Schema.ObjectId, ref: 'RecArea' },
    campgroundRef: { type: mongoose.Schema.ObjectId, ref: 'Campground' },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
