const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequest = require('../utils/errors/BadRequest');
const ErrorAccess = require('../utils/errors/ErrorAccess');
const NotFound = require('../utils/errors/NotFound');
const NotUnique = require('../utils/errors/NotUnique');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorAccess('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorAccess('Неправильные почта или пароль');
        }

        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });

        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });

        return res.send({ token });
      });
    })
    .catch(next);
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (error.name === 'MongoError' || error.code === 11000) {
        next(new NotUnique('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(error);
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
