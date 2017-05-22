const { User } = require('./../models/user');

// define an authenticate middleware which can be used with
// all the authenticated routes
const authenticate = (req, res, next) => {
  // extract the token from the request
  const token = req.header('x-auth');

  // create a model method
  User.findByToken(token).then(user => {
    if (!user) {
      // let the catch block handle this error
      return Promise.reject();
    }

    // we set the following properties to the req object,
    // which can be accessed from the middleware/routes
    // down the line
    req.user = user;
    req.token = token;

    // since this is a middleware, we need to call next() to go into the
    // next middleware/route
    next();
  }).catch(e => {
    // send 'unauthorized'
    // we do not want to call next() because we need to stop here
    res.status(401).send();
  })
};

module.exports = {
  authenticate
};
