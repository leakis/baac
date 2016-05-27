/**
 * Created by zhengxianxiang.lion on 2016/5/24.
 */
var configconst=require('../infrastructure/configconst');
var filehelper= require('../infrastructure/filehelper');
var htmlfilepath=configconst.tplpath;
var tableservice=require('./tableservice');
var myutils=require('../infrastructure/utils');
var fs=require('fs');
var tplService={
    writeAll:function(tbname)
    {

    },
    getHtmlTemplate:function(callback){
        var fullhtmlfilepath=htmlfilepath+'view.htm';
        filehelper.filehelper.readFile(fullhtmlfilepath,callback);
    },
    getControllerTemplate:function(callback){
        var fullhtmlfilepath=htmlfilepath+'controller.txt';
        filehelper.filehelper.readFile(fullhtmlfilepath,callback);
    },
    getServiceTemplate:function(callback){
        var fullhtmlfilepath=htmlfilepath+'service.txt';
        filehelper.filehelper.readFile(fullhtmlfilepath,callback);
    },
    writeHtmlTemplate:function(str,tbname,cols,alltbs)
    {
        //var searchfrom='';
        var hiddensearch='hidden';
        var searchiv='';
        var searchvar='';
        var searchvar_pa='location.href="http://"+host + "/##/'+tbname+'list?v=1"';
        for(var i in cols)
        {
            hiddensearch='';
            var mt= myutils.utils.convertDbType2Code(cols[i].ColumnType);
            searchiv+='<span class="searspan">\n';
            searchiv+='<label>'+cols[i].ColumnName+'</label>\n';
            if(mt=='bool')
            {
             searchiv+='<input name="'+cols[i].ColumnName+'" type="checkbox" />\n';
                searchvar+='var sea_'+cols[i].ColumnName+'= $("input[name=\''+cols[i].ColumnName+'\']").is(":checked");\n';
            }
            else
            {
                searchiv+=' <input type="text"  placeholder="请输入'+cols[i].ColumnName+'" name="'+cols[i].ColumnName+'" class="nav-search-input" id="nav-search-'+cols[i].ColumnName+'" autocomplete="off" />\n';
                searchvar+='var sea_'+cols[i].ColumnName+'= $("[name=\''+cols[i].ColumnName+'\']").val();\n';
            }
            if(mt=='long'||mt=='int')
            {
                searchvar+='if(sea_'+cols[i].ColumnName+'==\'\')\n';
                searchvar+='{\n';
                 searchvar+='sea_'+cols[i].ColumnName+'=0;\n';
                searchvar+='}\n';
            }
            searchiv+='</span>\n';
            searchvar_pa+='+"&'+cols[i].ColumnName+'="+sea_'+cols[i].ColumnName;
           // methodp+=cols[i].ColumnName;
        }
        searchvar+='\n   var href = location.href;\n';
        searchvar+=' var host=location.host;\n';
        searchvar+=searchvar_pa;
        var pk='';
        var trth = "";
        var trtd = "";
        var formc = "";
        var js_get = "";
        var js_set = "";
        var js_create = "";

        for(var i in alltbs)
        {
            trth+='<th class="bg-primary">'+alltbs[i].Description+'</th>\n';
            trtd+='<td>@item.'+alltbs[i].ColumnName+'</td>\n';
            if (!alltbs[i].IsPrimaryKey)
            {
                formc+='<div class="input-group">\n';
                formc+='<span class="input-group-addon  lblwidth" >'+alltbs[i].Description+'</span>\n';
                formc+='<input type="text" class="form-control" id="in_'+alltbs[i].ColumnName+'" style="width: 400px;" placeholder="请输入'+alltbs[i].Description+'" aria-describedby="basic-addon1">\n';
                formc+='</div>\n';
                js_get+='$("#in_'+alltbs[i].ColumnName+'").val(data.'+alltbs[i].ColumnName+');\n';
                js_set+='data.'+alltbs[i].ColumnName+' = $("#in_'+alltbs[i].ColumnName+'").val();\n';
                js_create+='$("#in_'+alltbs[i].ColumnName+'").val("");\n';
            }
            else
            {
                pk = alltbs[i].ColumnName;
                js_set+='data.'+alltbs[i].ColumnName+' = $("#hd_id").val();\n';
            }

        }

        trtd+='<td>\n';
        trtd+='<button class="btn btn-xs btn-info" data-toggle="modal" data-target="#exampleModal" onclick="get('+pk+')">\n';
        trtd+='<i class="ace-icon fa fa-pencil bigger-120" title="编辑"></i>\n';
        trtd+='</button>\n';
        trtd+='<button class="btn btn-xs btn-danger" onclick="deletedata(@item.'+pk+',1)">\n';
        trtd+='<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>\n';
        trtd+='</button>\n';
        trtd+='</td>\n';


        str=str.replace(/\{\{hiddensearch}}/g,hiddensearch);
        str=str.replace(/\{\{table}}/g,tbname);
        str=str.replace(/\{\{db}}/g,configconst.dbconfig.database);
        str = str.replace(/\{\{trth}}/g, trth);
        str = str.replace(/\{\{trtd}}/g, trtd);
        str = str.replace(/\{\{formc}}/g, formc);
        str = str.replace(/\{\{js-get}}/g, js_get);
        str = str.replace(/\{\{js-set}}/g, js_set);
        str = str.replace(/\{\{js-create}}/g, js_create);
        str = str.replace(/\{\{search_iv}}/g, searchiv);
        str = str.replace(/\{\{search_var}}/g, searchvar);
        var codepath = configconst.zippath  + tbname;
        filehelper.filehelper.createDirectory(codepath, function (err) {
            if(!err)
            {
                var codefilepath=codepath+'/'+tbname+'_view.txt';
                fs.writeFile(codefilepath,str,'utf-8',function(err){
                });
            }
        })

    },
    writeControllerTemplate:function(str,tbname,cols,alltbs)
    {
        var methodparam='';
        var methodp='';
        for(var i in cols)
        {
            var mt= myutils.utils.convertDbType2Code(cols[i].DataType)
            methodparam+=mt;
            methodparam+=' ';
            methodparam+=cols[i].ColumnName;
            methodparam+=',';
            methodp+=',';
            methodp+=cols[i].ColumnName;
        }
        var pk='';
        for(var i in alltbs)
        {
            if(alltbs[i].IsPrimaryKey)
            {
                pk=alltbs[i].ColumnName;
            }
        }
        //
        str=str.replace(/\{\{table}}/g,tbname);
        str=str.replace(/\{\{db}}/g,configconst.dbconfig.database);
        str=str.replace(/\{\{table_l}}/g,tbname.toLocaleLowerCase());
        str=str.replace(/\{\{search_pa}}/g,methodparam);
        str=str.replace(/\{\{search_p}}/g,methodp);
        str=str.replace(/\{\{pk}}/g,pk);
        var codepath = configconst.zippath  + tbname;
        filehelper.filehelper.createDirectory(codepath, function (err) {
            if(!err)
            {
                var codefilepath=codepath+'/'+tbname+'_controller.txt';
                fs.writeFile(codefilepath,str,'utf-8',function(err){
                });
            }
        })
        //


    },
    writeServiceTemplate:function(str,tbname,cols,alltbs)
    {
        str=str.replace(/\{\{db}}/g,configconst.dbconfig.database);
        str=str.replace(/\{\{table_l}}/g,tbname.toLocaleLowerCase())
        var codepath = configconst.zippath  + tbname;
        filehelper.filehelper.createDirectory(codepath, function (err) {
            if(!err)
            {

                var codefilepath=codepath+'/'+tbname+'_service.txt';
                if(cols&&cols.length>0)
                {
                  var searchlist= tableservice.dbetc.initSearch(tbname,cols);
                  var searchcount= tableservice.dbetc.initSearchCount(tbname,cols);
                   str= str.replace('{{search_count}}',searchcount);
                    str=str.replace('{{search_list}}',searchlist);
                }
                else
                {
                  var normallist=tableservice.dbetc .initnormallist(tbname);
                    str=str.replace('{{search_count}}',normallist);
                    str=str.replace('{{search_list}}','');
                }
                var pk='';
                for(var i in alltbs)
                {
                    if(alltbs[i].IsPrimaryKey)
                    {
                        pk=alltbs[i].ColumnName;
                    }
                }
                str=str.replace(/\{\{table}}/g,tbname);
                str=str.replace(/\{\{pk}}/g,pk);
                str=str.replace(/\{\{orderby}}/g,pk);
               fs.writeFile(codefilepath,str,'utf-8',function(err){
               });
            }
        })


    }

}

exports.templateservice=tplService;
