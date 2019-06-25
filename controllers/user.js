const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  register: (req, res, next) => {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    bcrypt
      .genSalt(10)
      .then(salt => {
        bcrypt
          .hash(newUser.password, salt)
          .then(hash => {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                if (user) {
                  return res.status(201).json({ message: "User created" , data: newUser});
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  },

  profile: (req, res, next) => {
    res.json({ user: req.user });
  },

  authenticate: (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });

          res.json({
            success: true,
            token: "JWT " + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        } else {
          return res.json({ success: false, msg: "Wrong Password" });
        }
      });
    });
  }
};
