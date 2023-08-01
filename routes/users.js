const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUser,
  validationAvatar,
  validationUserID,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserID, getUserById);
router.patch('/me', validationUser, updateUserInfo);
router.patch('/me/avatar', validationAvatar, updateUserAvatar);

module.exports = router;
