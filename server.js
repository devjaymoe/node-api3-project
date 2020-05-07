const express = require('express');
const server = express();
const UserRouter = require('./users/userRouter.js');
const PostRouter = require('./posts/postRouter.js')

server.use(express.json());
server.use(logger)

server.use('/users', UserRouter)
server.use('/posts', PostRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {

  const today = new Date().toLocaleDateString('en-US');
  console.log(`Date: ${today}, Request Method: ${req.method}, Url: ${req.url}`)

  next();
}

module.exports = server;
