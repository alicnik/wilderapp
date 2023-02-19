const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const recAreaSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  address1: { type: String },
  address2: { type: String },
  website: { type: String },
  avgRating: { type: Number },
  city: { type: String },
  state: { type: String },
  longitude: { type: Number },
  latitude: { type: Number },
  lastUpdated: { type: String },
  ridbRecAreaId: { type: String },
  reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
  media: [
    {
      url: { type: String },
      title: { type: String },
    },
  ],
  campgrounds: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }],
});

recAreaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('RecArea', recAreaSchema);
