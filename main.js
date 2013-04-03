var express = require("express");
var io = require("socket.io");

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server,'127.0.0.1');

  

var PORT = 3600;


server.listen(PORT, function (request,response){
console.log('LISTENING ON PORT: '+ PORT);

});

app.configure(function(){
 app.set('vie options',{
    layout: false
 });

 io.configure(function(){
 io.disable('log');
 });
 
 app.use(express.static(__dirname + '/static'));

});


app.get('/',function (request,response)
{
  response.render('main.jade');
});

require('./io')(io);







