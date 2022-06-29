const express = require('express');
const router = express.Router();
const {getAllUser} = require('./controller')

/* GET users listing. */
router.get('/users', getAllUser);

module.exports = router;