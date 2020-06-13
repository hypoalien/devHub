const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile Model
const Profile = require("../../models/Profile");

//Load profile Model
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({ mesg: "profile Works" }));

// @route   GET api/profile/test
// @desc    Get current user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get feilds
    profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (req.body.handle) profileFeilds.handle = req.body.handle;
    if (req.body.company) profileFeilds.company = req.body.company;
    if (req.body.website) profileFeilds.website = req.body.website;
    if (req.body.location) profileFeilds.location = req.body.location;
    if (req.body.bio) profileFeilds.bio = req.body.bio;
    if (req.body.status) profileFeilds.status = req.body.status;
    if (req.body.githubusername)
      profileFeilds.githubusername = req.body.githubusername;

    //Split skills into comma seperated array
    if (typeof req.body.skills !== "undefined") {
      profileFeilds.skills = req.body.skills.split(",");
    }
    //social
    profileFeilds.social = {};

    if (req.body.youtube) profileFeilds.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFeilds.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFeilds.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFeilds.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFeilds.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );
      } else {
        //Create

        //Check if handle exists
        Profile.findOne({ handle: profileFeilds.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //Save Profile
          new Profile(profileFeilds)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
