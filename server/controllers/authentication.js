const jwt = require('jwt-simple');
const User = require('../model/user');
const config = require('../config');

function tokenForUser(user){
  const timeStamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}
exports.signin = function(req, res, next){
  console.log('Signin')
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(422).send({error: 'You must provide email and password.'})
    }
    //See if user with given email exists
    User.findOne({email: email}, (err, existingUser) => {
      if(err){return next(err)}

      //If a user with given email does exists then return an console.error
      if(existingUser){
        return res.status(422).send({error: 'Email is in use'})
      }
      //If a user with given email doesnt exists then create and save the record
      const user = new User({
        email,
        password
      });

      //Respond to request indicating the user was created.
      user.save((err) => {
        if(err){return next(err);}

        res.json({token: tokenForUser(user)});
      })
    });
}
