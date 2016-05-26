/**
 * Created by Administrator on 2016/4/27.
 */
$(function () {
    $("#dblist").on('change',function () {
        var dbname = $("#dblist").val();
        $.ajax({
            url: "/tables",
            data: {dbname: dbname},
            type: "get",
            success: function (data) {
                $("#tablelist").empty();
                for(var i in data) {
                    $("#tablelist").append("<option value="+data[i]+">"+data[i]+"</option>");
                    if(i==0)
                    {
                        getcols(data[i]);
                    }
                }
            },
            error: function () {
                alert("系统忙");
            }
        });
    });
        $("#tablelist").on('change',function () {
            var tbname = $("#tablelist").val();
            getcols(tbname);
        });
        $("#save").on('click',function () {
            var cols = [];
            var tbname = $("#tablelist").val();
            var dbname = $("#dblist").val();
            $("#collist option:selected").each(function(){ //遍历全部option
              var col=new Object();
                col.ColumnName=$(this).val();
                col.ColumnType=$(this).attr("data-type");
                cols.push(col);
            });
            var d={"table":tbname,"cols":cols,dbname:dbname};
            $.ajax({
                url: "/initsearch",
                contentType: "application/json",
                data: JSON.stringify(d),
                type: "post",
                success: function (data) {
                   console.log(data);
                },
                error: function () {
                    alert("系统忙");
                }
            });
        })
})

function getcols(tbname)
{
    var dbname = $("#dblist").val();
    $.ajax({
        url: "/columns",
        data: {table: tbname,dbname:dbname},
        type: "get",
        success: function (data) {
            $("#collist").empty();
            for(var i in data) {
                $("#collist").append('<option value="'+data[i].ColumnName+'" data-type="'+data[i].DataType+'">'+data[i].ColumnName+'</option>');
            }
        },
        error: function () {
            alert("系统忙");
        }
    });
}

