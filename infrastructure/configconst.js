/**
 * Created by Administrator on 2016/4/25.
 */
var configs={
    tplpath:'e:\\MyNode\\baac\\resources\\template\\',
    sqlconnectionstring:'',
    dbconfig :{
        user: 'sa',
        password: 'Sa123456',
        server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
        database: 'test',
        //parseJSON:true,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 3000
        },
        options: {
            encrypt: false // Use this if you're on Windows Azure
        }
    }
}


module.exports=configs;
