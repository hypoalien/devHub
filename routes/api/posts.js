const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pasport = require("passport");

//Post model
const Post = require("../../models/Post");

//Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({ mesg: "posts Works" }));

// @route   POST api/posts/test
// @desc    Create post
// @access  Private
router.post(
  "/",
  pasport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      //If any errors, send status 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

module.exports = router;
