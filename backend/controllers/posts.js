const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId  // got from checkAuth middleware
    });
    //console.log(req.userData);
    //return res.status(200).json({});
    post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
  }

  exports.updatePost = (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Update Successful'});
      } else {
        res.status(401).json({message: 'Not Authorized'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update the post!'
      });
    });
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({message: 'Post deleted!'});
      } else {
        res.status(401).json({message: 'Not authorized'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t delete the post!'
      });
    });
  }

  exports.getPosts = (req, res, next) => {
    //console.log(req.query);
    const currentPage = +req.query.page;
    const pageSize = +req.query.pagesize;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery
      .then(posts => {
        fetchedPosts = posts;
        return Post.countDocuments();
      }).then(count => {
        //console.log(count);
        res.status(200).json({
          message: 'Posts fetched successfully!',
          posts: fetchedPosts,
          maxPosts: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Fetching posts failed!'
        });
      });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
    .then(postData => {
      if(postData) {
        res.status(200).json({
          message: 'fetched the post',
          post: {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
            // OR - A new gen feature of JS for above code is:-
            // ( note : aceess of post will not be the same. )
            // Eg : to access id -> post._doc.id OR to access title -> post._doc.title
            // ...postData,
            // id: postData._id  // only this field will be overwritten from _id to id
          }
        });
      } else {
        res.status(404).json({message: 'Post not found'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching a post failed!'
      });
    });
  }