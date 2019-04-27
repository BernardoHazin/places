const pubsub = require('../PubSub')

module.exports = {
  registerUser: async (parent, args, { models }) => {
    return models.User.create(args)
      .then(({ email }) => email)
      .catch(err => new Error('Unable to register'))
  }
}
