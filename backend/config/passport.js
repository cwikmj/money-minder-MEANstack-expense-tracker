const passport = require('passport')
const userModel = require('../models/user')
const { decrypt } = require('../middleware/hash')
const JwtStrategy = require('passport-jwt').Strategy


const jwtExtractor = (req) => {
  let token = null
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    token = decrypt(token)
  }
  return token
}


const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
}


const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userModel.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use('jwt', jwtLogin)
