var express = require('express');
var router = express.Router();
var tableservice = require('../service/tableservice');
var templateservice = require('../service/templateservice');
var fs = require('fs');
var archiver = require('archiver');
var configconst=require('../infrastructure/configconst');
var uuid=require('uuid');
var session = require('express-session');
var filehelper= require('../infrastructure/filehelper');
/* GET home page. */
router.get('/', function(req, res, next) {
    tableservice.dbetc.databaseList(function(err,dblist){
        res.render('index',{dblist: dblist});
    })
    // res.render('index', { title: 'Express' });
});

router.get('/tables', function(req, res, next) {
    var dbname= req.query.dbname;
    tableservice.dbetc.tableList(dbname,function(err,tablelist){
        res.send(tablelist);
    })
    // res.render('index', { title: 'Express' });
});

router.get('/columns', function(req, res, next) {
    var table= req.query.table;
    var dbname= req.query.dbname;
    tableservice.dbetc.columnList(table,dbname,function(err,columnlist){
        res.send(columnlist);
    })
    // res.render('index', { title: 'Express' });
});

router.post('/initsearch', function(req, res, next) {
    var table= req.body.table;
    var cols= req.body.cols;
    var dbname= req.body.dbname;
    var myuuid=uuid.v1();
    req.session.myuuid =myuuid;
    configconst.zippath='resources/zipfiles/'+myuuid+'/';

    filehelper.filehelper.createDirectory(configconst.zippath, function (err) {
        if (cols && cols.length > 0) {
            tableservice.dbetc.columnList(table, dbname, function (err, columnlist) {
                var mytblist=[];
                mytblist.push(table);
                tableservice.dbetc.initAutoMapper(mytblist);
                var outputstr = tableservice.dbetc.initAdminModel(table, columnlist);
                templateservice.templateservice.getServiceTemplate(function (err, str) {
                    templateservice.templateservice.writeServiceTemplate(str, table, cols, columnlist);
                });
                templateservice.templateservice.getControllerTemplate(function (err, str) {
                    templateservice.templateservice.writeControllerTemplate(str, table, cols, columnlist);
                });
                templateservice.templateservice.getHtmlTemplate(function (err, str) {
                    templateservice.templateservice.writeHtmlTemplate(str, table, cols, columnlist);
                });
                res.send('suc');
            })
        }
        else {
            tableservice.dbetc.tableList(dbname, function (err, tblist) {
                tableservice.dbetc.initAutoMapper(tblist);
                tblist.forEach(function (itbname) {
                    tableservice.dbetc.columnList(itbname, dbname, function (err, columnlist) {
                        var outputstr = tableservice.dbetc.initAdminModel(itbname, columnlist);
                        (function (itbname) {
                            templateservice.templateservice.getServiceTemplate(function (err, str) {
                                templateservice.templateservice.writeServiceTemplate(str, itbname, cols, columnlist);
                            });
                        })(itbname);

                        (function (itbname) {
                            templateservice.templateservice.getControllerTemplate(function (err, str) {
                                templateservice.templateservice.writeControllerTemplate(str, itbname, cols, columnlist);
                            });
                        })(itbname);

                        (function (itbname) {
                            templateservice.templateservice.getHtmlTemplate(function (err, str) {
                                templateservice.templateservice.writeHtmlTemplate(str, itbname, cols, columnlist);
                            });
                        })(itbname);
                    });
                })
                res.send('suc');

            })

        }
    });

});


router.get('/zip', function(req, res, next) {
    //zip the file;
    //creating archives
    var myuuid=req.session.myuuid;
    var output = fs.createWriteStream('public/'+myuuid+'.zip');
    var archive = archiver('zip');

    archive.on('error', function(err){
        throw err;
    });

    archive.pipe(output);
    archive.bulk([
        { src: ['resources/zipfiles/'+myuuid+'/**']}
    ]);
    archive.finalize();
    //end
     res.send(myuuid);
   // res.redirect('/tpl-archive.zip')
});

module.exports = router;
