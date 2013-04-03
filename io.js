module.exports = function(io) {
    
    var mysql = require('./nodejs-mysql-native/lib/mysql-native')
    var db = createDatasource();
/*
    var recordSet = {
        cod_message:"",
        id_uid:"",
        message : "",
        date_msg: ""
    };*/
    global.jsonData ="";
   
    /* 
    global.strData = {
    x: 3,
    y: function() { console.log('Works.'); }
	};*/


	io.sockets.on('connection',function(socket){
	  	// console.log("Client connected");

	  	
	  	socket.on('set_nickname',function(nickname,callback){
	 		// console.log('Trying to set nickname ' +  nickname );
	 		
	 		var isAvailable = isNicknameAvailable(nickname);
			
	 		if (isAvailable)
	 		{

	 			socket.nickname = nickname;
                // CREAR INICIO DE SESSION DE CHAT
                

                db.query("SELECT COUNT(*) FROM ella_user_textchat WHERE id_alliance=1").on('row', function(r) { 
                    if (r==0)
                    	 db.query("INSERT INTO ella_user_textchat_message (id_uid, message, id_alliance, date_msg) VALUES ("+socket.nickname+",'<SESSION PUBLIC CHAT - ELLA INIT>', '1', NOW())");
                        	
                }); 


                //ACTUALIZAR LA LISTA DE USUARIOS/MENSAJES ACTIVOS A LOS NUEVOS INTEGRANTES
            	db.query("SELECT id_uid FROM ella_user_textchat WHERE id_alliance=1").on('row', function(r) { socket.emit('active_users', r)}); 
                
               	db.query("SELECT cod_message, id_uid, message, date_msg FROM ella_user_textchat_message WHERE id_alliance = 1 AND date_msg > (SELECT date_msg AS date_session FROM ella_user_textchat_message WHERE message = '<SESSION PUBLIC CHAT - ELLA INIT>' AND id_alliance = 1 ORDER BY date_msg DESC LIMIT 0,1) ORDER BY cod_message ASC").on('row', 
            	function(r) { 
                var cantRec = r.length;
                    
                    jsonData ="";
                    var str = "";
						                
	                for (var i=0; i < cantRec; ++i)
					{
					   // console.log(i+'->'+r[i]);
					   

					    /*cod_message:"",id_uid:"",message : "",date_msg: ""*/

					    switch (i) {
						    case 0:
						       str += '{"cod_message":"'+ r[i]+'",';
						       break
						    case 1:
						       str += '"id_uid":"'+ r[i]+'",';
						       break
						    case 2:
						       str += '"message":"'+ r[i]+'",';
						       break
						    case 3:
						       str += '"date_msg":"'+ r[i]+'"}';
						       break
						};
	                  
					};
					//console.log(str);
					jsonData += str+",";    
                   
				
            	});

               // console.log('Does this work?');
				//mytest.y();
				 //jsonData += "]";       
                                
				jsonData = jsonData.substr(0,jsonData.lastIndexOf(",")) 
				
				console.log("jsonData->"+"["+jsonData+"]");

                 
          	    socket.emit('active_msg', [
{"cod_message":"28", "id_uid":"1623", "message": "Quisque eget faucibus odio. Morbi mattis, tortor vitae porttitor varius, nunc.", "date_msg": "2012-11-23 17:10:20"}
,{"cod_message":"28", "id_uid":"1156", "message": "Quisque eget faucibus odio. Morbi mattis, tortor vitae porttitor varius, nunc.", "date_msg": "2012-11-23 17:10:20"}
,{"cod_message":"28", "id_uid":"42", "message": "Quisque eget faucibus odio. Morbi mattis, tortor vitae porttitor varius, nunc.", "date_msg": "2012-11-23 17:10:20"}
]);

                

                //REGISTRAR USUARIO ACTIVOS
                db.query("INSERT INTO ella_user_textchat (id_uid, id_alliance) VALUES ("+nickname+",'1')"); 
				


				console.log('USER CONNECTED: '+ nickname);
                sendAllMessageExceptYou(socket,nickname);

	 		};	
	 			
	        callback(isAvailable);

	  	});

	  	socket.on('message',function(message){

	  		// socket.broadcast // Le envia a todos los sockets conectados menos a el mismo.
	  		sendMessage(socket.nickname,message);
	  		db.query("INSERT INTO ella_user_textchat_message (id_uid, message, id_alliance, date_msg) VALUES ("+socket.nickname+",'"+message+"', '1', NOW())");
	  		
	  	});

  	
	  	socket.on('disconnect',function(){
	  		
	  		disconectUser(socket.nickname);
	  		
	  		db.query("DELETE FROM ella_user_textchat WHERE id_uid = "+socket.nickname+" AND id_alliance = 1"); 
			console.log('USER DISCONNECTED : '+ socket.nickname);

	  		
	  		
	  	});

	});

	var sendMessage = function(nickname,message)
	{
		// socket.emit // Le envia a todos los sockets conectados.
		io.sockets.emit('message',nickname,message);
	};


	var funcCallBack = function(strData)
	{
	   console.log("+++"+strData);
	};

	


	var disconectUser = function(nickname)
	{
		
		io.sockets.emit('user_disconect',nickname);
	};


	var sendAllMessageExceptYou = function(socket,nickname)
	{
		socket.broadcast.emit('user_connect',nickname);
	};


	var isNicknameAvailable = function(nickname)
	{
      var clients = io.sockets.clients();
      
      	for (var client in clients) {
      		if (clients.hasOwnProperty(client)){
      			client = clients[client];

      			if (client.nickname == nickname)
      				return false;
      		}	
      	};

      return true;

	};


	function createDatasource()
	{
	   var db = mysql.createTCPClient('173.254.70.126'); 
	   db.auto_prepare = true;
	   var auth = db.auth('practip2_ella', 'practip2_ella','U4GTUqIHdOdI');
	   db.set('row_as_hash', false);
	   return db;
	};

}