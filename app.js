const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./utils/errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');
const { newUserValidation, userAuthValidation } = require('./middlewares/validations');

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', userAuthValidation, login);
app.post('/signup', newUserValidation, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

app.use(errors());

app.use(errorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running!');
});
