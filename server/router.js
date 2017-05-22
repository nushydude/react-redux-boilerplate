const path =  require('path');

const { authenticate } = require('./middleware/authenticate');
const { createUser, getUser, loginUser, logoutUser } = require('./controllers/users');

module.exports = function(app) {
  app.post('/api/users', createUser);
  app.get('/api/users/me', authenticate, getUser);
  app.post('/api/users/login', loginUser);
  app.delete('/api/users/token', authenticate, logoutUser);
}
