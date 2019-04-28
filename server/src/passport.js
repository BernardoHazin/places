const passport = require('passport')
const { User } = require('./models')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { authentication } = require('./config')

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authentication.secret
    },
    async (playload, done) => {
      const user = playload.user
      if (user) {
        User.findOne({
          where: {
            email: user
          }
        })
          .then(fetched => {
            if (!fetched || fetched.blocked) {
              return done(new Error(), false)
            }
            return done(null, fetched, 'User')
          })
          .catch(err => {
            return done(err, false)
          })
      } else done(new Error(), false)
    }
  )
)

module.exports = passport
