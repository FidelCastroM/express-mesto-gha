const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validationCard,
  validationcardID,
} = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationcardID, deleteCard);
router.put('/:cardId/likes', validationcardID, likeCard);
router.delete('/:cardId/likes', validationcardID, dislikeCard);

module.exports = router;
