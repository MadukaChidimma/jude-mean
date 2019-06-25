const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");

// Register
router.post("/register", userController.register);

// Authentication
router.post("/authenticate", userController.authenticate);

//Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
module.exports = router;
