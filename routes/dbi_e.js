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
    con.query('select * from interaction',function(err,rows)     {

        if(err)
            console.log("Error Selecting : %s ",err );

        res.render('dbi_e',{page_title:"Interactions - Node.js",data:rows});
    });

});

module.exports = router;