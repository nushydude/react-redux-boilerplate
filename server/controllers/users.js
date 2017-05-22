const _ = require('lodash');

const { User } = require('./../models/user');

const createUser = (req, res, next) => {
  // extract only the username and password from the body
  const userProps = _.pick(req.body, ['email', 'password']);

  // create a new userInstance based on the UserModel
  var userInstance = new User(userProps);

  console.log('Inside createUser');

  // save the user into the database
  userInstance.save()
  // save() will return the saved userInstance which is same as userInstance
  // so we omit the returned value and just use the userInstance which we
  // created above
  .then(() => userInstance.generateAuthToken())
  .then(token => {
    // we set the generated token to the x-auth header,
    // because the client needs this token to communicated with
    // the server from hereafter
    res.header('x-auth', token).send(userInstance);
  }).catch(e => {
    res.status(400).send(e);
  });
};




const getUser = (req, res, next) => {
  // this function will be called after the authenticate middleware
  // so we should have the user property set in the req object
  // if the user could be authenticated
  res.send(req.user);
};


const loginUser = (req, res, next) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
  .then(user => {
    return user.generateAuthToken()
      .then(token => res.header('x-auth', token).send(user));
  })
  .catch(e => res.status(400).send());
};



const logoutUser = (req, res, next) => {
  // get userInstance passed from the authenticate middleware
  const user = req.user;
  const token = req.token;

  user.removeToken(token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
};

module.exports = {
  createUser,
  getUser,
  loginUser,
  logoutUser,
};
