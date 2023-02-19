const jwt = require('jsonwebtoken');
const secret =
  'campgrounds are the same as campsites and area 51 is a rec area but trump did not want you to know';

const User = require('../models/user');

function secureRoute(req, res, next) {
  const rawToken = req.headers.authorization;

  if (!rawToken) {
    return res.status(401).send({ message: 'Unauthorized: no user token attatched' });
  }

  const token = rawToken.replace('Bearer ', '');

  jwt.verify(token, secret, (err, tokenBody) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: 'Unauthorized: token error' });
    }

    const userId = tokenBody.sub;
    User.findById(userId)
      .then((user) => {
        if (!user) return res.status(401).send({ message: 'Unauthorized: user match error' });

        req.currentUser = user;

        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send({ message: 'Unauthorized' });
      });
  });
}

module.exports = secureRoute;
