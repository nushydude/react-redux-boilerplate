const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');


// we will move this to a config file later,
// and we should not commit it to github
const SecretWord = 'abc213';

var UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


// instance methods
UserSchema.methods.toJSON = function() {
  var userInstance = this;
  var userInstanceObj = userInstance.toObject();

  return _.pick(userInstanceObj, ['_id', 'email']);
}

// create an instance method
UserSchema.methods.generateAuthToken = function() {
  // we are not using the fat arrow functions here, because
  // they do not bind this.

  // 'this' in this case is a particular user instance.
  var userInstance = this;

  var access = 'auth';

  // create the token using jwt by passing the userId and the secretWord
  var token = jwt.sign({
    _id: userInstance._id.toHexString(),
    access
  }, SecretWord).toString();

  // push this token into the tokens array
  userInstance.tokens.push({ access, token });

  // save the user and then return the token
  return userInstance.save().then(doc => {
    return token;
  });
}

// remove the token from a user
UserSchema.methods.removeToken = function(token) {
  var userInstance = this;

  // $pull method lets us remove an entry from an array
  return userInstance.update({
    $pull: {
      tokens: { token }
    }
  })
}


// model methods
// model methods are defined using statics property of the schema
UserSchema.statics.findByToken = function(token) {
  var UserModel = this; // this is the UserModel, not an instance, because this is a model method
  var decoded; // to store the return value from jwt.verify

  // jwt.verify will return an error if something goes wrong,
  // so we have to use try-catch
  try {
    decoded = jwt.verify(token, SecretWord);
  } catch(e) {
    return Promise.reject();
  }

  // find a user with a token stored in the tokens array
  // decodeds will have the '_id' and 'access' properties
  return UserModel.findOne({
    _id: decoded._id,
    'tokens.token': token, // to search inside the tokens array
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function(email, password) {
  var UserModel = this;

  // find a user with the email
  return UserModel.findOne({ email }).then(user => {
    // if we don't find a user, there is nothing else to do
    if (!user) {
      return Promise.reject();
    }

    // if we find a user, then we have to match password.
    // bcrypt uses callbacks; the following code will let us
    // wrap it with promises
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}





// middleware to hash the password before saving
// it to the database.
UserSchema.pre('save', function(next) {
  var userInstance = this;

  // only hash the password if the password is modified
  if (userInstance.isModified('password')) {
    // generate a salt
    // we are using 10 as the number of rounds
    // the more the rounds, the slower it is, because it takes
    // longer to generate the salt which means bruteforce attacks
    // less effective.
    // also, because of the salt, the hash will be different for
    // same password (salt will be different each time)
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err);
      }

      // generate the hash from the pasword and the salt
      bcrypt.hash(userInstance.password, salt, (err, hash) => {
        if (err) {
          next(err);
        }

        // store the hash instead of the plain password in the database
        userInstance.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});




// create the User
var User = mongoose.model('User', UserSchema);

module.exports = {
  User,
};
