const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.get('', (req, res, next) => {
    Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
      });
    });
  });
  
  router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
      if(post) {
        res.status(200).json({message: 'fetched the post', post: post});
      } else {
        res.status(404).json({message: 'Post not found'});
      }
    });
  });
  
  router.post('', (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully',
        postId: createdPost._id
      });
    });
  });
  
  router.put('/:id', (req, res, next) => {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({ _id: req.params.id}, post)
    .then(result => {
      res.status(200).json({message: 'Update Successful'});
    });
  });
  
  router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Post deleted!'});
    });
  });

  module.exports = router;