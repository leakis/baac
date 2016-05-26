/**
 * Created by Administrator on 2016/4/25.
 */
var fs= require('fs');

var filehelper= {
    readFile: function (filepath, callback) {
        fs.readFile(filepath, 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            callback(err, data);
        });
    },
    isExistDirectory: function (filepath,callback) {
        fs.exists(filepath, function(exists) {
            callback(exists);
        });
    },
//filepath����·��
    createDirectory: function (filepath,callback) {
        //���Ŀ¼�������򴴽���Ŀ¼
       this.isExistDirectory(filepath,function(isexist){
           if(!isexist)
           {
               fs.mkdir(filepath,777, function (err) {
                   callback(err);
               });
           }else
           {
               callback(null);
           }
       })
    }
}

//module.exports=readFile;
exports.filehelper=filehelper;