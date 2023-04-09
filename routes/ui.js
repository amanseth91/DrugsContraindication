var express = require('express');
var router = express.Router();
var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anirudh95",
    database: "project"
});


router.get('/', function(req, res) {
        res.render('ui',{title:"User Interface"});
});


module.exports = router;