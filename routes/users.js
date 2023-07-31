const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  userValidation,
  userIDValidation,
  userAvatarValidation,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:Id', userIDValidation, getUserById);
router.patch('/me', userValidation, updateUserInfo);
router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
