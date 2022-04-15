const { uploadFile, sendMail } = require('../controllers/fileController.js');

const router = require('express').Router();

router.post('/', uploadFile)

router.get('/send', sendMail);

module.exports = router;