var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('cds', { title: 'Basic Decision Support System'});
});

module.exports = router;
