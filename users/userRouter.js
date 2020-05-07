const express = require('express');
const router = express.Router();
const Users = require('./userDb.js');
const Post = require('../posts/postDb.js');

router.use(express.json());

router.get('/', (req, res) => {  
  Users.get()
    .then(users => {
      const [check] = users
      if (check){
          res.status(200).json(users)
      } else {
          res.status(200).json({ message: 'no users'})
      }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'The users information could not be retrieved.'
        });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.user
  Users.getById(id)
    .then(user => {
      if (user){
          res.status(200).json(user)
      } else {
          res.status(400).json({ message: 'invalid user id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The users information could not be retrieved.'
      });
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.user
  Users.getUserPosts(id)
    .then(user => {
      const [check] = user
      if (check){
          res.status(200).json(user)
      } else {
          res.status(200).json({ message: 'no posts for that user by that id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The users information could not be retrieved.'
      });
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.user
  Users.remove(id)
    .then(message => {
      if (message){
          res.status(200).json({message: 'user deleted'})
      } else {
          res.status(200).json({ message: 'user not found'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The user\'s information could not be retrieved.'
      });
    })
});

router.post('/', validateUser, (req, res) => {
  const newUser = req.body
  if (newUser.name){
    Users.insert(newUser)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'There was an error while adding the user to the database'
        });
    })
  } else {
    res.status(400).json({
      message: "Provide a name for user"
    })
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const userPost = req.body
  if(userPost.text && userPost.user_id){
    Post.insert(userPost)
      .then(newPost => {
        res.status(201).json(newPost)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'There was an error while adding the post to the database',
            error
        });
    })
  } else {
    res.status(500).json({
      message: 'Provide contents to post'
    })
  }
});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.user
  const change = req.body
  if(change.name && typeof change.name === 'string'){
    Users.update(id, change)
      .then(response => {
        console.log(response)
        res.status(200).json({message: 'Name updated'})
      })
      .catch(err => res.status(500).json({message: 'Error updating user', err}))
  } else {
    res.status(400).json({message: 'Provide a new name'})
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const id = Number(req.params.id)
  if(id && typeof id === 'number'){
    req.user = id
    Users.getById(req.user)
    .then(user => {
      if (user){
          next();
      } else {
          res.status(400).json({ message: 'invalid user id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The users information could not be retrieved.'
      });
    })
  } else {
    res.status(406).json({ message: 'id not valid'})
  }
}

function validateUser(req, res, next) {
  const newUser = req.body
  if (Object.keys(newUser).length > 0){
    if(newUser.name){
      next();
    }
    else{
      res.status(400).json({
        message: 'Missing required name field'
      })
    }
  } else {
    res.status(400).json({
      message: 'Missing user data'
    })
  }
}

function validatePost(req, res, next) {
  const newPost = req.body
  if (Object.keys(newPost).length > 0){
    if(newPost.text){
      next();
    }
    else{
      res.status(400).json({
        message: 'Missing required text field'
      })
    }
  } else {
    res.status(400).json({
      message: 'Missing post data'
    })
  }
}

module.exports = router;
