/**
 * Created by Administrator on 2016/4/26.
 */
var sql = require('mssql');
var $=require('stringformat');
var config=require('../infrastructure/configconst');
var myutils=require('../infrastructure/utils');
var filehelper= require('../infrastructure/filehelper');
var fs=require('fs');
$.extendString('coolFormat');
var dbetc={
    databaseList:function(callback) {
        var connection=new sql.Connection(config.dbconfig);
        connection.connect().then(function(){
            var sqlRequest=new sql.Request(connection);
            sqlRequest.query('select name from sys.databases where database_id > 4',function(err,recordset)
                {
                    var dblist=[];
                    if(!err)
                    {
                        for(var i in recordset)
                        {
                            dblist.push(recordset[i].name);
                        }
                    }
                    callback(err,dblist);
                    connection.close();
                }
            );
        })
    },
    tableList:function(dbname,callback)
    {
        config.dbconfig.database=dbname;
        var connection=new sql.Connection(config.dbconfig);
        connection.connect().then(function(){
            var sqlRequest=new sql.Request(connection);
            var sqlstr="SELECT Name FROM {0}.dbo.SysObjects Where XType='U' ORDER BY Name".coolFormat(dbname);
            sqlRequest.query(sqlstr,function(err,recordset)
                {
                    var tablelist=[];
                    if(err)
                    {
                        console.log(err);
                    }
                    else {
                        for(var i in recordset)
                        {
                            tablelist.push(recordset[i].Name);
                        }
                    }
                    callback(err, tablelist);
                    connection.close();
                }
            );
        })
    },
    columnList:function(tbname,dbname,callback)
    {
        config.dbconfig.database=dbname;
        config.dbconfig.options.database=dbname;
        //console.log(config.dbconfig);
        var connection=new sql.Connection(config.dbconfig);
        connection.connect().then(function(){
            var sqlRequest=new sql.Request(connection);
            var sqlstr="select col.name as ColumnName,col.max_length as DataLength,col.is_nullable as IsNullable,t.name as DataType,ep.value as Description,(";
            sqlstr+= "select top 1 ind.is_primary_key from sys.index_columns ic left join sys.indexes ind on ic.object_id=ind.object_id and ic.index_id=ind.index_id";
            sqlstr+=" and ind.name like 'PK_%' where ic.object_id=obj.object_id and ic.column_id=col.column_id ) as IsPrimaryKey";
            sqlstr+="  from sys.objects obj";
            sqlstr+="  inner join sys.columns col";
            sqlstr+="  on obj.object_id=col.object_id";
            sqlstr+="  left join sys.types t";
            sqlstr+="  on t.user_type_id=col.user_type_id";
            sqlstr+="  left join sys.extended_properties ep";
            sqlstr+=" on ep.major_id=obj.object_id";
            sqlstr+="  and ep.minor_id=col.column_id";
            sqlstr+=" and ep.name='MS_Description'";
            sqlstr+="  where obj.name='{0}'".coolFormat(tbname);
            sqlRequest.query(sqlstr,function(err,recordset)
                {
                    var columnlist=[];
                    //console.log(recordset);
                    if(err)
                    {
                        console.log(err);
                    }
                    else {
                        for(var i in recordset)
                        {
                            var model=new Object();
                            model.ColumnName =recordset[i].ColumnName;
                            model.DataLength =recordset[i].DataLength;
                            model.IsNullable = recordset[i].IsNullable;
                            model.DataType = recordset[i].DataType;
                            model.Description = recordset[i].Description;
                            model.IsPrimaryKey = recordset[i].IsPrimaryKey;
                            columnlist.push(model);
                        }
                    }
                    callback(err, columnlist);
                    connection.close();
                }
            );
        })
    },
    initSearchCount: function (table, cols) {
        var methodparam='';
        var colnames=[];
        var searchsql='string sql="select Count(1) from '+table+' where 1=1 And GameId=@GameId";\n';
        for(var i in cols)
        {
            var mt= myutils.utils.convertDbType2Code(cols[i].ColumnType)
            methodparam+=',';
            methodparam+=mt;
            methodparam+=' ';
            methodparam+=cols[i].ColumnName;
            colnames.push(cols[i].ColumnName);
            searchsql+=myutils.utils.sqlcombin(cols[i].ColumnName,mt)+'\n';
        }
        var outputstr='public  int '+'Get'+table+'TotalCount'+'(GameId gameId'+methodparam+')\n';
        outputstr+='{\n\n';
        outputstr+=searchsql;
        outputstr+=myutils.utils.paramcombin(colnames);
        outputstr+=' int result = (int)SqlHelper.ExecuteScalar(SqlHelper.CenterConnString, CommandType.Text, sql, para);\n';
        outputstr+=' return result;\n';
        outputstr+='}\n';
        return outputstr;
    },
    initSearch: function (table, cols) {
        var methodparam='';
        var colnames=[];
        var searchsql='string sql="SELECT * FROM(SELECT ROW_NUMBER() OVER ( ORDER BY {{pk}} DESC ) AS RowNUM, * FROM  (SELECT	 * from '+table+' where 1=1 AND GameId=@GameId";\n';
        for(var i in cols)
        {
            var mt= myutils.utils.convertDbType2Code(cols[i].ColumnType)
            methodparam+=',';
            methodparam+=mt;
            methodparam+=' ';
            methodparam+=cols[i].ColumnName;
            colnames.push(cols[i].ColumnName);
            searchsql+=myutils.utils.sqlcombin(cols[i].ColumnName,mt)+'\n';
        }
        searchsql+='sql+=" ) tmp ) tmp1  WHERE   RowNUM BETWEEN ( @pageIndex - 1 ) * @pageSize + 1 AND     @pageIndex * @pageSize";\n';
        var outputstr='public  List<'+table+'AdminModel> '+'Get'+table+'List'+'(GameId gameId,int page,int pageSize'+methodparam+')\n';
        outputstr+='{\n\n';
        outputstr+=searchsql;
        outputstr+=myutils.utils.paramcombin(colnames,true);
        outputstr+=' DataSet ds = SqlHelper.ExecuteDataset(SqlHelper.CenterConnString, CommandType.Text, sql, para);\n';
        outputstr+='List<'+table+'> result = SqlCommonHelper.ToList<'+table+'>(ds.Tables[0]);\n';
        outputstr+=' result = result ?? new List<'+table+'>();\n';
        outputstr+='var modellist = AutoMapper.To<List<{{table}}>, List<{{table}}AdminModel>>(result);\n';
        outputstr+=' return modellist;\n';
        outputstr+='}\n';
        return outputstr;
    },
    initAdminModel:function(table, cols){
        var colnames=[];
        var outputstr='';
        outputstr+='using System;\n';
        outputstr+='using System.Collections.Generic;\n';
        outputstr+= 'using System.Linq;\n';
        outputstr+='using System.Text;\n\n';
        outputstr+='namespace FOApp.Admin.AdminService.Model\n';
        outputstr+='{\n';
        outputstr+='public  class '+table+'AdminModel\n';
        outputstr+='{\n';
        for(var i in cols)
        {
            var mt= myutils.utils.convertDbType2Code(cols[i].ColumnType)
            outputstr+='public '
            outputstr+=mt;
            outputstr+=' ';
            outputstr+=cols[i].ColumnName;
            outputstr+=' {get;set;}';
            colnames.push(cols[i].ColumnName);
            outputstr+='\n';
        }
        outputstr+='}\n\n';
        outputstr+='}\n';
        var codepath = config.zippath + table;
        console.log(codepath);
        filehelper.filehelper.createDirectory(codepath, function (err) {
            if(!err) {
                var codefilepath = codepath + '/' + table + 'AdminModel.cs';
                fs.writeFile(codefilepath, outputstr, 'utf-8', function (err) {
                });
            }
        })
        return outputstr;
    },
    initAutoMapper:function(alltbs){
        var colnames=[];
        var outputstr='';
        outputstr+='public class AdminAutoMapper\n';
        outputstr+='{\n';
        outputstr+= 'static AdminAutoMapper()\n';
        outputstr+='{\n';
        for(var i in alltbs)
        {
            outputstr+='Mapper.CreateMap<'
            outputstr+=alltbs[i];
            outputstr+='AdminModel,';
            outputstr+=alltbs[i];
            outputstr+='>();\n';
            outputstr+='Mapper.CreateMap<'
            outputstr+=alltbs[i];
            outputstr+=',';
            outputstr+=alltbs[i];
            outputstr+='AdminModel>();\n';
        }
        outputstr+=' public static T2 To<T1, T2>(T1 t)\n';
        outputstr+= '{\n'
        outputstr+='    return Mapper.Map<T1, T2>(t);\n';
        outputstr+= '}\n';
        outputstr+='}\n\n';
        outputstr+='}\n';
        var codepath = config.zippath;
        filehelper.filehelper.createDirectory(codepath, function (err) {
            if(!err) {
                var codefilepath = codepath + '/' + 'AdminAutoMapper.cs';
                fs.writeFile(codefilepath, outputstr, 'utf-8', function (err) {
                });
            }
        })
        return outputstr;
    },
    initnormallist: function (tbname) {
        var outputstr='';
        outputstr+= 'public int Get'+tbname+'TotalCount(GameId gameId)\n'
        outputstr+= '{\n';
        outputstr+= 'Expression<Func<'+tbname+', bool>> predicate = a => a.GameId == (long)gameId;\n';
        outputstr+= 'int totalCount = 0;\n';
        outputstr+= 'totalCount = context.'+tbname+'.Where(predicate).Count();\n';
        outputstr+= 'return totalCount;\n';
        outputstr+='}\n';
        outputstr+='public List<'+tbname+'AdminModel> Get'+tbname+'List(GameId gameId,int skip, int pageSize)\n';
        outputstr+= '{\n';
        outputstr+= '{List<'+tbname+'> list = null;\n';
        outputstr+= 'Expression<Func<'+tbname+', bool>> predicate = a => a.GameId == (long)gameId;\n'
        outputstr+='list =  context.'+tbname+'.Where(predicate).OrderByDescending(a => a.{{orderby}}).Skip(skip).Take(pageSize).ToList();\n'
        outputstr+='var modellist = AutoMapper.To<List<{{table}}>, List<{{table}}AdminModel>>(list);\n';
        outputstr+='return modellist;\n';
        outputstr+='}\n';
        return outputstr;
    }
}


exports.dbetc=dbetc;
