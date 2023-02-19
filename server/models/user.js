const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden');
const bcrypt = require('bcrypt');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const masterKey = 'Wild2020';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^.+@[^.].*\.[a-z]{2,}$/.test(email);
        },
        message: 'Email must be valid.',
      },
    },
    password: { type: String, required: true, match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/ },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    homeState: { type: mongoose.SchemaTypes.Mixed },
    showWishList: { type: Boolean },
    showVisited: { type: Boolean },
    darkMode: { type: Boolean },
    campgroundWishList: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }],
    recAreaWishList: [{ type: mongoose.Schema.ObjectId, ref: 'RecArea' }],
    campgroundsVisited: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }],
    recAreasVisited: [{ type: mongoose.Schema.ObjectId, ref: 'RecArea' }],
    campgroundReviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
    recAreaReviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
    isAdmin: { type: Boolean },
    isVIP: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongooseHidden({ defaultHidden: { password: true } }));
userSchema.plugin(mongooseUniqueValidator);

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.virtual('adminKey').set(function setAdminKey(adminKey) {
  this._adminKey = adminKey;
});

userSchema.pre('validate', function checkPassword(next) {
  if (this._id) return next();
  if (this._passwordConfirmation !== this.password) {
    this.invalidate('passwordConfirmation', 'should match');
  }
  next();
});

userSchema.pre('validate', function checkAdminKey(next) {
  if (this._adminKey !== masterKey) {
    this.admin = false;
  } else {
    this.admin = true;
  }
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
