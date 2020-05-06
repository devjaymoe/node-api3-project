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

router.get('/:id', (req, res) => {
  const id = req.params.id
  Users.getById(id)
    .then(user => {
      if (user){
          res.status(200).json(user)
      } else {
          res.status(200).json({ message: 'no user by that id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The users information could not be retrieved.'
      });
    })
});

router.get('/:id/posts', (req, res) => {
  const id = req.params.id
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

router.delete('/:id', (req, res) => {
  const id = req.params.id
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

router.post('/', (req, res) => {
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

router.post('/:id/posts', (req, res) => {
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

router.put('/:id', (req, res) => {
  const id = req.params.id
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
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
