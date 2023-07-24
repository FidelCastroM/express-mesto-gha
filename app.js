const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');

const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b8b9a09585cc158bdbb60b',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running!');
});
