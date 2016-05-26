var express = require('express');
var router = express.Router();
var tableservice = require('../service/tableservice');
var templateservice = require('../service/templateservice');
var adm_zip = require('adm-zip');
//var fs = require('fs');
//var archiver = require('archiver');
var configconst=require('../infrastructure/configconst');
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
    if(cols&&cols.length>0) {
        tableservice.dbetc.columnList(table, dbname, function (err, columnlist) {
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
            res.send('hello');
        })
    }
    else
    {
        tableservice.dbetc.tableList(dbname,function(err,tblist)
        {
            tableservice.dbetc.initAutoMapper(tblist);
            tblist.forEach(function (itbname) {
                tableservice.dbetc.columnList(itbname, dbname, function (err, columnlist) {
                        var outputstr = tableservice.dbetc.initAdminModel(itbname, columnlist);
                    (function(itbname){
                    templateservice.templateservice.getServiceTemplate(function (err, str) {
                        templateservice.templateservice.writeServiceTemplate(str, itbname, cols, columnlist);
                    });
                    })(itbname);

                     (function(itbname){
                    templateservice.templateservice.getControllerTemplate(function (err, str) {
                        templateservice.templateservice.writeControllerTemplate(str, itbname, cols, columnlist);
                    });
                        })(itbname);

                      (function(itbname){
                    templateservice.templateservice.getHtmlTemplate(function (err, str) {
                        templateservice.templateservice.writeHtmlTemplate(str, itbname, cols, columnlist);
                    });
                        })(itbname);
                });
                //zip the file;
                //creating archives
                //var zip = new adm_zip();
                //zip.addLocalFolder('E:\\MyNod','f:\\');
                //zip.writeZip('f:\\adm-archive.zip');
                //end
            })
           res.send('helloall');

        })

    }

});

module.exports = router;
