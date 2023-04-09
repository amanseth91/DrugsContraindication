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

/* GET users listing. */
router.get('/', function(req, res) {
        con.query('select * from generic',function(err,rows)     {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('dbg_e',{page_title:"Generic Names - Node.js",data:rows});
        });

});


module.exports = router;
