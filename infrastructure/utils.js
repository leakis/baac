/**
 * Created by lea on 2016-05-15.
 */
var utils={
    convertDbType2Code:function(t)
    {
        var str = "string";
        if (t == "nvarchar")
        {
            str = "string";
        }
        else if (t =="varchar")
        {
            str = "string";
        }
        else if (t == "int")
        {
            str = "int";
        }
        else if (t == "bigint")
        {
            str = "long";
        }
        else if (t == "tinyint")
        {
            str = "byte";
        }
        else if (t == "date")
        {
            str = "DateTime";
        }
        else if (t == "datetime")
        {
            str = "DateTime";
        }
        else if (t == "float")
        {
            str = "float";
        }
        else if (t == "bit")
        {
            str = "bool";
        }
        return str;
    },
    sqlcombin:function(name,t)
    {
        var sql='';
        if(t=='string')
        {
            sql+='if(!String.IsNullOrEmpty('+name+'))\n'
            sql+='{\n';
            sql+='sql+=" AND '+name+'=@'+name+' ";\n';
            sql+='}\n';
        }else if(t=='int'||t=='long')
        {
            sql+='if('+name+'>=0)\n'
            sql+='{\n';
            sql+='sql+=" AND '+name+'=@'+name+' ";\n';
            sql+='}\n';
        }
        else if(t=='DateTime')
        {
            sql+='if('+name+'!=null)\n'
            sql+='{\n';
            sql+='sql+=" AND '+name+'=@'+name+' ";\n';
            sql+='}\n';
        }
        return sql;
    },
    paramcombin: function (names,iscount) {
        var para='List<SqlParameter> plist = new List<SqlParameter>();\n';
        para+='plist.Add(new SqlParameter("@GameId'+'", (long)gameId));\n';
        if(iscount)
        {
            para+='plist.Add(new SqlParameter("@PageSize'+'", pageSize));\n';
            para+='plist.Add(new SqlParameter("@Skip'+'", skip));\n';
        }
        for(var i in names)
        {
            para+='plist.Add(new SqlParameter("@'+names[i]+'", '+names[i]+'));\n';
        }
        para+=' var para =plist.ToArray();\n';
        return para;
    }
}


exports.utils=utils;