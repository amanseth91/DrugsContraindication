var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var MongoClient = require('mongodb').MongoClient;

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "anirudh95",
    database: "project"
});

var dt,dt_len;
var source = require('./cdss');

function setValue(value) {
    dt = value;
    dt_len = dt.length;
}
var tr1 = source.trn;

/* GET home page. */
router.get('/', function(req, res) {
    con.query('select trdnm from trade',function (err,rows) {
        if(err)
            console.log('Error selection: %s',err);
        //console.log(rows);
        setValue(rows);
        //console.log(source.trn);
        res.render('index', { title: 'Drug-Contraindication Checker' ,dts:rows});
    });
});



router.post('/creategnm',function (req,res) {
    var count;
    con.query('select gid from generic',function (err,resp) {
        if(err)
            console.log("Error Selecting : %s ",err );
        count  = resp.length;
        count++;
        con.query("insert into generic values('"+count+"','"+req.body.gname+"')", function (err) {
            if(err)
                console.log("Error Selecting : %s ",err );
        });
    });
    res.redirect('back');
    //console.log(query.sql);
});

router.post('/createtnm',function (req,res) {
    var count;
    con.query('select tid from trade',function (err,resp) {
        if(err)
            console.log("Error Selecting : %s ",err );
        count  = resp.length + 2;
        count++;
        con.query("insert into trade values('"+count+"','"+req.body.tname+"','"+req.body.gid+"')", function (err) {
            if(err)
                console.log("Error Selecting : %s ",err );
        });
    });
    res.redirect('back');
    //console.log(query.sql);
});

router.post('/createinteraction',function (req,res) {
    var count;
    con.query('select srno from interaction',function (err,resp) {
        if(err)
            console.log("Error Selecting : %s ",err );
        count  = resp.length;
        count++;
        con.query("insert into interaction values('"+count+"','"+req.body.med1+"','"+req.body.med2+"','"+req.body.level+"','"+req.body.msg+"')", function (err) {
            if(err)
                console.log("Error Selecting : %s ",err );
        });
    });
    res.redirect('back');
    //console.log(query.sql);
});

router.get('/deleteg/:id',function (req,res) {
    var id = req.params.id;

    con.query("delete from generic  where gid = ? ",[id], function(err) {
        if(err)
            console.log("Error deleting : %s ",err );
        res.redirect('back');
    });
});

router.get('/deletet/:id',function (req,res) {
    var id = req.params.id;

    con.query("delete from trade  where tid = ? ",[id], function(err) {
        if(err)
            console.log("Error deleting : %s ",err );
        res.redirect('back');
    });
});

router.get('/deletei/:id',function (req,res) {
    var id = req.params.id;


    con.query("delete from interaction  where srno = ? ",[id], function(err) {
        if(err)
            console.log("Error deleting : %s ",err );
        res.redirect('back');
    });
});

router.get('/contra',function (req,res) {
    var d1 = req.query.s1;
    var d2 = req.query.s2;
    var result=[];
    var arr =[];
    function setValue2(value) {
        arr = value;
    }
    var level = 'Zero';
    var msg = 'No Interaction';
    var g1,g2,contra,r1,r2;
    g1 = con.query(("select gennm from generic g, trade t where g.gid=t.gid and t.trdnm='"+d1+"'"));
    g1.on("result",function (row) {
        result.push(row);
        //console.log(result[0].gennm);
        r1 = result[0].gennm;
        g2 = con.query(("select gennm from generic g, trade t where g.gid=t.gid and t.trdnm='"+d2+"'"));
        g2.on("result",function (row) {
            result.push(row);
            //console.log(result[1].gennm);
            r2 = result[1].gennm;
            /*contra = con.query(("select msg,level from interaction where med1='"+r1+"' and med2='"+r2+"' or med1='"+r2+"' and med2='"+r1+"'"));
             contra.on("result",function (row3) {
             setValue2(row3);
             console.log(arr);
             res.render('index2',{title: 'DC Checker', dts:dt,len:dt_len, data:arr, lvl1:level, msg1:msg, drug1:d1, drug2:d2});
             });*/
            contra = con.query("select msg,level from interaction where med1='"+r1+"' and med2='"+r2+"' or med1='"+r2+"' and med2='"+r1+"'",function (err,row3) {
                var str = JSON.stringify(row3);
                setValue2(JSON.parse(str));
                //console.log(arr);
                if(arr.length>0){
                    /*console.log(arr);
                     console.log(arr[0].level);
                     console.log(arr[0].msg);*/
                    res.render('index2',{title: 'Drug-Contraindication Checker', dts:dt,len:dt_len, data2:arr[0].msg,data1:arr[0].level, lvl1:level, msg1:msg, drug1:d1, drug2:d2});
                }else {
                    res.render('index3',{title: 'Drug-Contraindication Checker', dts:dt,len:dt_len, lvl1:level, msg1:msg, drug1:d1, drug2:d2});
                }
            });
        });
    });
});


var igender, idrug, iage, iwt, iprega, ibfeed, iallr;
var tage, twt, n, mean, ageNo, wtNo, tht;

function setclass(num,type){
    if(type==1){
        if(num>=1 && num<=10){
            iage = "child";
            n = 8;
            mean = (2+10)/2;
            ageNo = 0;
        }
        if(num>=11 && num<=17){
            iage = "adolescene";
            n = 6;
            mean = (11+17)/2;
            ageNo = 1;
        }
        if(num>=18 && num<=40){
            iage = "young Adult";
            n = 22;
            mean = (18+40)/2;
            ageNo = 2;
        }
        if(num>=41 && num<=65){
            iage = "adult";
            n = 25;
            mean = (41+65)/2;
            ageNo = 3;
        }
        if(num>=66){
            iage = "senior";
            n = 35;
            mean = (66+100)/2;
            ageNo = 4;
        }
        console.log(iage);
    }
    else if(type==0){
        if(num<=18.5){
            iwt = "underweight";
            wtNo = 0;
        }
        if(num>18.5 && num<=24.9){
            iwt = "healthy";
            wtNo = 1;
        }
        if(num>24.9 && num<=29.9){
            iwt = "overweight";
            wtNo = 2;
        }
        if(num>29.9 && num<=39.9){
            iwt = "obese";
            wtNo = 3;
        }
        if(num>40){
            iwt = "morbidly Obese";
            wtNo = 4;
        }
        //console.log(iwt);
    }
}
function getcount(input){
    var i1 = [];
    i1 = input.split(",");
    //console.log(i1.length);
    return i1.length;
}


function calcprob(dgender, dage, dwt, type){
    var genc = getcount(dgender);
    var agec = getcount(dage);
    var wtc = getcount(dwt);
    var gy, ay, wy, yes, pyes;
    var gn, an, wn, no, pno;
    var tot = 50;
    gy = ay = wy = yes = gn = an = wn = no = 0;

    yes = genc*agec*wtc;
    gy = agec*wtc;
    if(dage.includes(iage))
        ay = genc*wtc;
    if(dwt.includes(iwt))
        wy = genc*agec;

    pyes = (gy/yes)*(ay/yes)*(wy/yes)*(yes/tot);
    console.log("gy="+gy+" ay="+ay+" wy="+wy+" yes="+yes+" pyes="+pyes);

    no = tot-yes;
    gn = 25 - gy;
    an = 10 - ay;
    wn = 10 - wy;

    pno = (gn/no)*(an/no)*(wn/no)*(no/tot);
    console.log("gn="+gn+" an="+an+" wn="+wn+" no="+no+" pno="+pno);

    if(type==1)
        return pyes;
    else if(type==2)
        return pno;
    else if(type==3)
        return gy;
    else if(type==4)
        return ay;
    else if(type==5)
        return wy;
    else
        return 0;
}

function getMatrix(MD){
    var mat = [];
    for(var x1 = 0; x1 < 100; x1++){
        mat[x1] = [];
        for(var y1 = 0; y1 < 100; y1++){
            mat[x1][y1] = x*y;
        }
    }

    var x=2,y=1;
    mat[2][0] = 2;
    for(var i=1;i<5;i++)
        mat[2][i] = 1;
    if(MD>0){
        x = 1;y=2;
    }
    mat[0][0] = mat[1][0] = x;
    mat[3][0] = mat[4][0] = y;
    for(var k=1;k<5;k++){
        for(var j=0;j<2;j++){
            mat[j][k] = y;
        }
        for(var m=3;m<5;m++){
            mat[m][k] = x;
        }
    }
    //console.log(mat[ageNo][wtNo]);
    return mat[ageNo][wtNo];
}

function updateAgeClass(MD)
{
    if(MD<0)
        ageNo = ageNo-1;
    else
        ageNo = ageNo+1;
    var ret=null;
    if(ageNo<=0)
        ret = "child";
    else if(ageNo==1)
        ret = "adolescene";
    else if(ageNo==2)
        ret = "young Adult";
    else if(ageNo==3)
        ret = "adult";
    else if(ageNo>=4)
        ret = "senior";
    return ret;
}



router.get('/cdss2',function (req,res) {
    igender = req.query.gn;
    tage = req.query.age;
    twt = req.query.weight;
    tht = req.query.height;
    itht = req.query.height;
    idrug = req.query.sdrug;
    iprega = req.query.pregnt;
    ibfeed = req.query.brstf;
    iallr = req.query.allr;


    setclass(tage,1);
    var temp = Math.floor(tht);
    var temp1 = tht-temp;
    temp = temp*12;
    temp1 = temp1*10;
    tht = temp + temp1;
    tht = (tht*0.025);
    var bmi = twt/(tht*tht);
    setclass(bmi,0);

    console.log(idrug+" "+iwt);

    MongoClient.connect("mongodb://localhost:27017/project", function(err, db) {
        if (err) {
            return console.dir(err);
        }
        var collection = db.collection('drugs');
        collection.find({"Trade name":idrug}).toArray(function(err, results){
            var dgender = results[0].Gender.toString();
            var dage = results[0].Age.toString();
            var dpr = results[0].Pregnancy.toString();
            var dbf = results[0].Bfeeding.toString();
            var dallr = results[0].Allergy.toString();
            var dg = results[0]["Generic name"].toString();

            console.log(dg);
            if(iallr.length==0){
                iallr = 'none';
            }

            if(igender=='M' || iprega=='undefined' || iprega=='Pregnant' || ibfeed=='undefined' || ibfeed=='Breastfeeding'){
                iprega = 'no';
                ibfeed = 'no';
            }

            console.log(iallr+" "+iprega+" "+ibfeed);
            if(dgender.includes(igender)==false){
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Gender Mismatch",cf: "100%", tr:tr1, ht:itht, allr:iallr ,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                return;
            }
            if("female"===(igender)){
                if("not allowed"===(dpr) && "yes"===(iprega)){
                    res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Pregnancy",cf: "100%", tr:tr1, ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                    return;
                }
                else if("not allowed"===dbf && "yes"===ibfeed){
                    res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Bfeeding",cf: "100%", tr:tr1, ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                    return;
                }
            }

            if(dallr.includes(iallr)){
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed",cf: "100%", tr:tr1, ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                return;
            }

            if(dage.includes(iage)){
                console.log("true");
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Allowed",cf: "100%", tr:tr1, ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                return;
            }
            var MD = (tage - mean)/n;
            /*var fMD = MD;
             if(MD<0)
             fMD = MD - 2*MD;*/
            if(MD>=0.333){
                var mat_wt = getMatrix(MD);
                var newThrshld = MD*mat_wt;
                if(newThrshld>0.666){
                    var nage = updateAgeClass(MD);
                    console.log(nage);
                    if(dage.includes(nage)) {
                        var cf1 = newThrshld*100;
                        cf3 = cf1+"%";
                        res.render('cdss2', {title: 'Clinical Decision Support System', ans: "Allowed->new age and wt match ",cf:cf3, tr: tr1, ht: itht, allr: iallr, gen: igender, ag: tage, prg: iprega, dg: idrug, wt: twt, bf: ibfeed
                        });
                    }
                    else{
                        var cf4 = newThrshld*100;
                        cf6 = cf4+"%";
                        res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->new age doesn't match",cf:cf6,tr:tr1 ,ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                    }
                }
                else{
                    var cf2 = 1-newThrshld;
                    cf1 = cf2*100;
                    cf3 = cf1+"%";
                    res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->new thrd is less",cf:cf3,tr:tr1 ,ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                }
            }
            else{
                var cf7 = 1-MD;
                cf5 = cf7*100;
                cf3 = cf5+"%";
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->thrd is less",cf:cf3,tr:tr1 , ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
            }
        });
    });
});

router.get('/getvar',function (req,res) {

    var gender = req.query.gn,
        age = req.query.age,
        preg = req.query.pregnt,
        drug = req.query.sdrug,
        weight = req.query.wht,
        smoke = req.query.smo,
        alcohol = req.query.alco,
        breastfeeding = req.query.brstf;

    MongoClient.connect("mongodb://localhost:27017/drug", function(err, db) {
        if (err) {
            return console.dir(err);
        }
        var collection = db.collection('info');
        var count,pycount,ycount,gen1, ag1, wght1, p1, smok1, alcoh1, bf1, d1;
        var pncount,ncount,gen, ag, wght, p, smok, alcoh, bf, d;

        collection.count({}, function (err, rs) {
            if (err) {
                console.log(err)
            }
            count = rs;
            console.log('Total docs: '+count);
            collection.count({"Output": "yes"}, function (err, rs) {
                if (err) {
                    console.log(err)
                }
                ycount = rs;
                pycount = rs/count;
                console.log("Yes count: "+ycount);
                collection.count({"Gender": gender, "Output": "yes"}, function (err, rs) {
                    if (err) {
                        console.log(err)
                    }
                    console.log('Gender Yes: '+rs);
                    gen1 = rs / ycount;
                    collection.count({"Age": age, "Output": "yes"}, function (err, rs) {
                        if (err) {
                            console.log(err)
                        }
                        ag1 = rs / ycount;
                        console.log('Age Yes: '+rs);
                        collection.count({"Weight": weight, "Output": "yes"}, function (err, rs) {
                            if (err) {
                                console.log(err)
                            }
                            wght1 = rs / ycount;
                            console.log('Weight Yes: '+rs);
                            collection.count({"Pregnancy": preg, "Output": "yes"}, function (err, rs) {
                                if (err) {
                                    console.log(err)
                                }
                                p1 = rs / ycount;
                                console.log('Preg Yes: '+rs);
                                collection.count({"Smoker": smoke, "Output": "yes"}, function (err, rs) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    smok1 = rs / ycount;
                                    console.log('Smoker Yes: '+rs);
                                    collection.count({"Alcoholic": alcohol, "Output": "yes"}, function (err, rs) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        alcoh1 = rs / ycount;
                                        console.log('Alcoholic Yes: '+rs);
                                        collection.count({"Breastfeeding": breastfeeding, "Output": "yes"}, function (err, rs) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            bf1 = rs / ycount;
                                            console.log('Breastfeeding Yes: '+rs);
                                            collection.count({"Genericname": drug, "Output": "yes"}, function (err, rs) {
                                                if (err) {
                                                    console.log(err)
                                                }
                                                d1 = rs / ycount;
                                                console.log('Genericname Yes: '+rs);

                                                var yes = 1;

                                                collection.count({"Output": "no"}, function (err, rs) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    ncount = rs;
                                                    pncount = rs/count;
                                                    console.log("No count: "+ncount);
                                                    collection.count({"Gender": gender, "Output": "no"}, function (err, rs) {
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                        console.log('Gender No: '+rs);
                                                        gen = rs / ncount;
                                                        collection.count({"Age": age, "Output": "no"}, function (err, rs) {
                                                            if (err) {
                                                                console.log(err)
                                                            }
                                                            ag = rs / ncount;
                                                            console.log('Age No: '+rs);
                                                            collection.count({"Weight": weight, "Output": "no"}, function (err, rs) {
                                                                if (err) {
                                                                    console.log(err)
                                                                }
                                                                wght = rs / ncount;
                                                                console.log('Weight No: '+rs);
                                                                collection.count({"Pregnancy": preg, "Output": "no"}, function (err, rs) {
                                                                    if (err) {
                                                                        console.log(err)
                                                                    }
                                                                    p = rs / ncount;
                                                                    console.log('Preg No: '+rs);
                                                                    collection.count({"Smoker": smoke, "Output": "no"}, function (err, rs) {
                                                                        if (err) {
                                                                            console.log(err)
                                                                        }
                                                                        smok = rs / ncount;
                                                                        console.log('Smoker No: '+rs);
                                                                        collection.count({"Alcoholic": alcohol, "Output": "no"}, function (err, rs) {
                                                                            if (err) {
                                                                                console.log(err)
                                                                            }
                                                                            alcoh = rs / ncount;
                                                                            console.log('Alcoholic No: '+rs);
                                                                            collection.count({"Breastfeeding": breastfeeding, "Output": "no"}, function (err, rs) {
                                                                                if (err) {
                                                                                    console.log(err)
                                                                                }
                                                                                bf = rs / ncount;
                                                                                console.log('Breastfeeding No: '+rs);
                                                                                collection.count({"Genericname": drug, "Output": "no"}, function (err, rs) {
                                                                                    if (err) {
                                                                                        console.log(err)
                                                                                    }
                                                                                    d = rs / ncount;
                                                                                    console.log('Genericname No: '+rs);
                                                                                    result = [pycount,gen1, ag1, wght1, p1, smok1, alcoh1, bf1, d1];
                                                                                    for (var i = 0; i < result.length; i++) {
                                                                                        yes = yes * result[i];
                                                                                    }
                                                                                    resul = [pncount,gen, ag, wght, p, smok, alcoh, bf, d];
                                                                                    //console.log("pncount "+pncount+" gen "+gen+" age "+ag+" wght "+wght+" p "+p+" amok "+smok+" alcoh "+alcoh+" bf "+bf+" dj "+d+" max "+max);
                                                                                    var no = 1;
                                                                                    for (var j = 0; j < result.length; j++) {
                                                                                        no = no * resul[j];
                                                                                    }
                                                                                    console.log("P Yes: "+yes);
                                                                                    console.log("P No: "+no);

                                                                                    var cf=0,msg=0;

                                                                                    if(yes>no){
                                                                                        console.log("Yes");
                                                                                        cf = (yes/(yes+no))*100;
                                                                                        msg = null;
                                                                                        res.render('cds2', { title: 'Basic Decision Support System', ans:"yes", cf:cf, msg:msg, gen:gender, ag: age, prg:preg, dg:drug, wt:weight, sm:smoke, alc:alcohol, bf:breastfeeding});

                                                                                    }else{
                                                                                        console.log("No");
                                                                                        cf = (no/(yes+no))*100;
                                                                                        msg = null;
                                                                                        res.render('cds2', { title: 'Basic Decision Support System', ans:"no", cf:cf, msg:msg, gen:gender, ag: age, prg:preg, dg:drug, wt:weight, sm:smoke, alc:alcohol, bf:breastfeeding});

                                                                                    }

                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

/*router.get('/cdss2',function (req,res) {
    igender = req.query.gn;
    //console.log(igender);
    tage = req.query.age;
    twt = req.query.weight;
    tht = req.query.height;
    itht = req.query.height;
    idrug = req.query.sdrug;
    iprega = req.query.pregnt;
    //console.log(iprega);
    ibfeed = req.query.brstf;
    //console.log(ibfeed);
    iallr = req.query.allr;


    setclass(tage,1);
    var temp = Math.floor(tht);
    var temp1 = tht-temp;
    temp = temp*12;
    temp1 = temp1*10;
    tht = temp + temp1;
    tht = (tht*0.025);
    var bmi = twt/(tht*tht);
    setclass(bmi,0);

    console.log(idrug+" "+iwt);

    con.query("select gennm,gender,age,preg,bfeed,alrgy from cds c, nm t where c.gid=t.trdid and t.tradenm='"+idrug+"'", function(err, results) {
        if (err) {
            return console.dir(err);
        }
        var dgender = results[0]["gender"].toString();
        //console.log("Preg Res: "+results[0]["gender"]);
        var dage = results[0]["age"].toString();
        //console.log("Preg Res: "+results[0]["age"]);
        var dpr = results[0]["preg"].toString();
        //console.log("Preg Res: "+results[0]["preg"]);
        var dbf = results[0]["bfeed"].toString();
        //console.log("Preg Res: "+results[0]["bfeed"]);
        var dallr = results[0]["alrgy"].toString();
        //console.log("Preg Res: "+results[0]["alrgy"]);
        var dg = results[0]["gennm"].toString();
        //console.log("Preg Res: "+results[0]["gennm"]);

        console.log(dg);
        if(iallr.length==0){
            iallr = 'none';
        }

        if(igender=='male' || iprega=='Pregnant'){
            iprega = 'no';
        }

        if(igender=='male' || ibfeed=='Breastfeeding'){
            iprega = 'no';
        }

        console.log(iallr+" "+iprega+" "+ibfeed);
        if(dgender.includes(igender)==false){
            res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Gender Mismatch",cf: "100%", tr:tr1, ht:itht, allr:iallr ,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
            return;
        }
        if("female"===(igender)){
            if("no"===(dpr) && "yes"===(iprega)){
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Pregnancy",cf: "100%", tr:tr1, ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                return;
            }
            else if("no"===dbf && "yes"===ibfeed){
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not allowed -> Bfeeding",cf: "100%", tr:tr1, ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                return;
            }
        }

        if(dallr.includes(iallr)){
            res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed",cf: "100%", tr:tr1, ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
            return;
        }

        if(dage.includes(iage)){
            console.log("true");
            res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Allowed",cf: "100%", tr:tr1, ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
            return;
        }
        var MD = (tage - mean)/n;
        var fMD = MD;
         if(MD<0)
         fMD = MD - 2*MD;
        if(MD>=0.333){
            console.log(fMD);
            var mat_wt = getMatrix(MD);
            var newThrshld = MD*mat_wt;
            if(newThrshld>0.666){
                var nage = updateAgeClass(MD);
                console.log(nage);
                if(dage.includes(nage)) {
                    var cf1 = newThrshld*100;
                    cf3 = cf1+"%";
                    res.render('cdss2', {title: 'Clinical Decision Support System', ans: "Allowed->new age and wt match ",cf:cf3, tr: tr1, ht: itht, allr: iallr, gen: igender, ag: tage, prg: iprega, dg: idrug, wt: twt, bf: ibfeed
                    });
                }
                else{
                    var cf4 = newThrshld*100;
                    cf6 = cf4+"%";
                    res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->new age doesn't match",cf:cf6,tr:tr1 ,ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
                }
            }
            else{
                var cf2 = 1-newThrshld;
                cf1 = cf2*100;
                cf3 = cf1+"%";
                res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->new thrd is less",cf:cf3,tr:tr1 ,ht:itht, allr:iallr, gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
            }
        }
        else{
            var cf7 = 1-fMD;
            cf5 = cf7*100;
            cf3 = cf5+"%";
            res.render('cdss2', { title: 'Clinical Decision Support System', ans:"Not Allowed->thrd is less",cf:cf3,tr:tr1 , ht:itht, allr:iallr,gen:igender, ag: tage, prg:iprega, dg:idrug, wt:twt, bf:ibfeed});
        }
    });
});*/
module.exports = router;
