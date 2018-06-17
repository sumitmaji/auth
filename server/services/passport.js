const passport = require('passport');
const User = require('../model/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local Strategy
const LocalOptions = {usernameField: 'email' };
const localLogin = new LocalStrategy(LocalOptions, function(email, password, done){
  //verify username and password, call done with the user
  //if it is the correct username and password
  //otherwise call done with false
  console.log('locallogin')
  User.findOne({email: email}, function(err, user){
    if(err){return done(err);}
    if(!user){return done(null, false);}

    //compare passwords
    user.comparePassword(password, function(err, isMatch){
      if(err){return done(err);}

      if(!isMatch){return done(null, false);}

      return done(null, user);

    });
  });
});

//setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //See if the userid in the payload exits in the db or not.
  //If it does, call done with that other
  //otherwise call done without user object

  User.findById(payload.sub, function(err, user){
      if(err){return done(err, false);}

      if(user){
        done(null, user);
      }else{
        done(null, false);
      }
  });
});


//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
