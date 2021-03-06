const express = require('express');

const router = express.Router();

//auth middleware verify that the user is authenticated before sending requests
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const isOwner = require('../middlewares/isOwner');

const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, isOwner, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, isOwner, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.setLikeStatus);

module.exports = router;