const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const secret =
  'campgrounds are the same as campsites and area 51 is a rec area but trump did not want you to know';
const defaultAvatarArray = [
  'https://i.ibb.co/DfJ5PWc/avatar-1.png',
  'https://i.ibb.co/HTq3qfD/avatar-2.png',
  'https://i.ibb.co/x38pzNJ/avatar-3.png',
  'https://i.ibb.co/Y8nck2y/avatar-4.png',
  'https://i.ibb.co/WF9Mxwb/avatar-5.png',
  'https://i.ibb.co/17LGhrB/avatar-6.png',
];

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function register(req, res) {
  req.body.avatar = defaultAvatarArray.randomElement();
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => res.status(400).send(error));
}

function login(req, res) {
  User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
    .then((user) => {
      if (!user) return res.status(404).send({ username: { message: 'User not found.' } });
      if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({ password: { message: 'Passwords do not match' } });
      }
      const token = jsonwebtoken.sign({ sub: user._id }, secret, { expiresIn: '12h' });
      res.status(202).send({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        showWishList: user.showWishList,
        showVisited: user.showVisited,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        isVIP: user.isVIP,
        bio: user.bio,
        campgroundWishList: user.campgroundWishList,
        recAreaWishList: user.recAreaWishList,
        campgroundsVisited: user.campgroundsVisited,
        recAreasVisited: user.recAreasVisited,
        homeState: user.homeState,
        darkModeOn: user.darkModeOn,
        token,
      });
    })
    .catch((error) => res.status(403).send(error));
}

function getSingleUser(req, res) {
  User.findById(req.params.id)
    .populate('recAreaReviews')
    .populate('campgroundReviews')
    .populate('campgroundWishList')
    .populate('recAreaWishList')
    .populate('campgroundsVisited')
    .populate('recAreasVisited')
    .populate({
      path: 'recAreaReviews',
      populate: { path: 'recAreaRef' },
    })
    .populate({
      path: 'campgroundReviews',
      populate: { path: 'campgroundRef' },
    })
    .then((user) => {
      if (!user) return res.status(404).send({ username: { message: 'User not found.' } });
      res.status(200).send(user);
    })
    .catch((error) => console.log(error));
}

function editUserProfile(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'User not found' });
      if (!user._id.equals(req.currentUser._id))
        return res.status(401).send({ message: "You can't edit someone else's profile" });
      const modelArrays = [
        'recAreaWishList',
        'campgroundWishList',
        'recAreasVisited',
        'campgroundsVisited',
      ];
      for (const key in req.body) {
        if (modelArrays.includes(key)) {
          if (user[key].includes(req.body[key])) {
            user[key].pull(req.body[key]);
          } else {
            user[key].push(req.body[key]);
          }
          delete req.body[key];
        }
      }
      user.set(req.body);
      user.save();
      return user;
    })
    .then((updatedUser) => {
      res.status(201).send(updatedUser);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

const getAllUsers = (req, res) => User.find().then((users) => res.status(200).send(users));

module.exports = {
  register,
  login,
  getAllUsers,
  getSingleUser,
  editUserProfile,
};
