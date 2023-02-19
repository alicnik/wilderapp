const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  ridbCampgroundId: { type: String },
  ridbRecAreaId: { type: String },
  name: { type: String },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  address1: { type: String },
  address2: { type: String },
  avgRating: { type: Number },
  city: { type: String },
  state: { type: String },
  accessible: { type: Boolean },
  longitude: { type: Number },
  latitude: { type: Number },
  attributes: [
    {
      name: String,
      value: String,
      description: String,
    },
  ],
  media: [
    {
      title: String,
      url: String,
    },
  ],
  reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.model('Campground', campgroundSchema);
