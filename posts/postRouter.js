const express = require('express');
const router = express.Router();
const Post = require('./postDb.js');

router.use(express.json());

router.get('/', (req, res) => {
  Post.get()
    .then(posts => {
      const [check] = posts
      if (check){
          res.status(200).json(posts)
      } else {
          res.status(200).json({ message: 'no posts'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The posts information could not be retrieved.'
      });
  })
});

router.get('/:id', (req, res) => {
  const id = req.params.id
  Post.getById(id)
    .then(post =>{
      if(post){
        res.status(200).json(post)
      } else {
        res.status(200).json({ message: 'post with that id does not exist'})
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Error retrieving post'})
    })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Post.remove(id)
    .then(deleted =>{
      res.status(200).json({ message: 'post deleted', deleted })
    })
    .catch(err => {
      res.status(500).json({ message: 'Error retrieving post', err})
    })
});

router.put('/:id', (req, res) => {
  const id = req.params.id
  const change = req.body
  if(change.text && typeof change.text === 'string'){
    Post.update(id, change)
      .then(post => {
        console.log(post)
        res.status(200).json({message: 'Post updated', post})
      })
      .catch(err => res.status(500).json({message: 'Error updating post', err}))
  } else {
    res.status(400).json({message: 'Provide updated text'})
  }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
};

module.exports = router;
