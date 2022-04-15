const { showFile, downloadFile } = require('../controllers/showController.js');

const router = require('express').Router();

router.get('/:uuid', showFile);

router.get('/download/:uuid', downloadFile);

module.exports = router;