var $ = require('stringformat')
var filehelper= require('../infrastructure/filehelper');
var configconst=require('../infrastructure/configconst');
var htmlfilepath=configconst.tplpath;
var fullhtmlfilepath=htmlfilepath+'view.htm';
var myutils=require('../infrastructure/utils');
//filehelper.readFile(fullhtmlfilepath,function(err,data){
//    if(err)
//    {
//        console.log(err);
//    }else
//    {
//        //console.log(data);
//    }
//})

//var tableservice = require('../service/tableservice');
//tableservice.dbetc.databaseList(function(err,dblist){
//    for(var item in dblist)
//    {
//        console.log(dblist[item]);
//    }
//})
//tableservice.dbetc.tableList('users',function(err,recordset){
//    console.log(recordset);
//});

//$.extendString('coolFormat')
//console.log("Hello, {0}!".coolFormat("World"))
//
//var mt= myutils.utils.convertDbType2Code("datetime")
//var msql=myutils.utils.sqlcombin('username','string');
//var msql2=myutils.utils.paramcombin('age');
//console.log(msql)
//console.log(msql2)
//
//filehelper.filehelper.createDirectory(htmlfilepath+'a',function(){
//});
//var fs=require('fs');
//fs.writeFile(htmlfilepath+'a.txt','hello world','utf-8',function(err){
//    console.log(err);
//});

//var templateservice=require('../service/templateservice');
//templateservice.templateservice.writeServiceTemplate('aaa','users',['a'])

