const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb://3.6.132.221/mean', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to MongoDB...')
})
.catch(() => {
  console.log('Connection failed')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, x-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
