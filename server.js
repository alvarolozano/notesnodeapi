var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var cors = require('cors');
const host = process.env.host;
const uname = process.env.uname;
const pass = process.env.pass;
const dbname = process.env.dbname;

fs = require('fs');



let config = {
  host    : host,
  user    : uname,
  password: pass,
  database: dbname
};


 
module.exports = config;

let mysql  = require('mysql');
let connection = mysql.createConnection(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

/*app.get('/',function(req,res){
    fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }  
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();
    });
      
});*/

app.get('/table',function(req,res){
let sql = `SELECT * FROM todo order by id desc`;
connection.query(sql, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
 var arr = results;

  /*for(i = 0; i < arr.length; i++) {
    out += "<h3>" +
    arr[i].TITLE +
    "</h3>" + "<p>" +
    arr[i].body +
    "</p><hr>";
}
    
      res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(out);  
        res.end();
    });*/
        res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(JSON.stringify(results) );
    });
    
});

app.post('/login',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var tit = req.body.title;
  var bd = req.body.body;
    
    console.log(req.body.title);
    console.log(req.body.body); 
    let stmt = `INSERT INTO todo(TITLE, body)  VALUES ?  `;
    let todos = [[tit, bd]];
  
    
    console.log(todos);
    
    console.log(stmt, [todos])
    
    connection.query(stmt, [todos] , (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  // get inserted rows
  console.log('Row inserted:' + results.affectedRows);
});
  
});


app.post('/remove',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var tit = req.body.target;

    
    console.log(req.body.title);
    console.log(req.body.body); 
    let stmt = `delete from todo where id = ?`;
    let todos = [[tit]];
  
    
    console.log(todos);
    
    console.log(stmt, [todos])
    
    connection.query(stmt, [todos] , (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  // get inserted rows
  console.log('Row removed:' + results.affectedRows);
});
  
});
app.listen(3000,function(){
  console.log("Started on PORT 3000");
})