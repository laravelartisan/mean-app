var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',(req,res,next) => {
  let newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });

  User.addUser(newUser,(err,user)=>{
    if(err){
      res.json({success:false,msg:'Registration Failed'});
    }else{
      res.json({success:true,msg:'Registration Successful'});
    }
  });
});

router.post('/authenticate',(req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;
  res.send(password);
  User.getUserByUsername(username,(err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const  token = jwt.sign(user, config.secret, {
          expiresIn: 604800
            });
        res.json({
          success: true,
         token: 'Jwt-'+token,
          user :{
            id : user._id,
            name: user.name,
            username:user.username,
            email:user.email
          }
        });
      }else{
        return res.json({success: false, msg: 'Wrong Password'});
      }
    });
  });
});


module.exports = router;
