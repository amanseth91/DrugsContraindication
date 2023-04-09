var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var t;
var id=[];
function setValue1(value){
    t = value;
}
MongoClient.connect("mongodb://localhost:27017/project", function(err, db) {


    if (err) {
        return console.dir(err);
    }

    var coll = db.collection('drugs');


    coll.aggregate([{$match:{"Drug id":{$gt:0}}},{$group:{_id:"$Trade name"}}],function (er, res1) {
        setValue1(res1);

        var i=0;j=1;
        var k=2;m=3;
        res1.forEach(function (client) {
            id.push(client._id[i]);
            id.push(client._id[j]);
            if(client._id[k]!=undefined){
                id.push(client._id[k]);
            }
            if(client._id[m]!=undefined){
                id.push(client._id[m]);
            }
        });
    });
});

router.get('/', function(req, res) {
    res.render('cdss', { title: 'Clinical Decision Support System',tr:id});
});



module.exports = router;
module.exports.trn = id;