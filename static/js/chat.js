$(function(){
		
	var getParameter = function (paramName) {
  		var searchString = window.location.search.substring(1),
      		i, val, params = searchString.split("&");

		for (i=0;i<params.length;i++) {
    		val = params[i].split("=");
    		if (val[0] == paramName) {
      			return unescape(val[1]);
    		}
  		}
  		return null;
	}


	var 
		$chat =$("#chat");
		$messages = $("#messages");
		$user_active = $("#colusers_activos");
		$mydata = $("#mydata");
		$uid = getParameter('uid');
		$users_online = $("#colusers_activos");

    //  $login = $("#login"),

	var socket = io.connect('/');


	socket.on('connect',function(){
		//console.log('Conneted with socket');
		init();
		

	});



	var init = function(){

     	setNickname($uid);	
     	socket.on('active_users', function (data) {
		   addUserConnect(data,'');		  
		 });


     	socket.on('active_msg', function (data) {
		   addMsgToUserConnect(data);		  
		 });
	};

/*
	var goScrollToElement = function (container, element) {
	   var container = $(container);
	   var element = $(element);


   		// Primero sacamos las dimenciones que nos interesan
  		 var posTop = container.scrollTop()
  		 var elTop = element.position().top - element.height();

  		 // Ejecutamos .animate sobre el contenedor, con la nueva pocion del scroll
   		container.animate({scrollTop: posTop + elTop});
    };
*/

	//$chat.hide();
	var recordSet;

	var setNickname = function(nickname){
		socket.emit('set_nickname',nickname,function(is_available) {
			if (is_available){
				//console.log('Nickname ' + nickname + ' is available');
				setUpChat(nickname);	
				
			}
			else
			{
				//console.log('Nickname ' + nickname + ' is not available ');
			}	
			
		});
	};

	var setUpChat = function(nickname){
		
        /*var url = 'http://ella.practicalaction.org/alliances/test-data.php';
        //var data;

		$.ajax({
		  url: url,
		  success: function(o){
            // data = o;
             $mydata.val(o[0].uid);
		  },
		  dataType: 'json',
		  type:'POST'
		});
        */
		//$mydata.val(data[0].uid);
		//$login.hide();
		//$chat.show();

		
        

		$("#submit_send").click(function(){
			
			sendMessage($("#send_message").val());
		});

		socket.on('message',function(nickname,message){
			addMessage(nickname,message);
		});

		socket.on('user_connect',function(nickname,message){
			addUserConnect(nickname,message);
		});

		socket.on('user_disconect',function(nickname,message){
			disconectUserConnect(nickname,message);
		});


	};

	var sendMessage = function(msg){
		socket.emit('message',msg);

	};



	var addMessage = function(nickname,message)
	{
		var chat_msgs = "";
		var date = new Date();
	    var  mm = new Array('Jan', 'Feb', 'Mar','Apr', 'May', 'Jun','Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec');
    	var date_str = mm[date.getMonth()]+' '+('0'+date.getDate()).substr(-2,2)+' at '+date.getHours()+':'+date.getMinutes()+'  (GMT-6)';

		chat_msgs = '<div class="bloque_chat">'+chat_msgs_usr(nickname,'#333')+'<div class="date_chat">'+date_str+'</div><div class="clear"></div></div><div class="cont_text_chat">'+message+'</div></div><div class="clear"></div></div>';
        $messages.append($(chat_msgs));
        $messages.scrollTo('100%', 800 );

            

	};



	var addUserConnect = function(nickname,message)
	{
		var user_chat = "";	
		var obj_user_private = new Object();
		obj_user_private = get_data_user(nickname);

		user_chat = '<div id="user_'+nickname+'"><a class="user_online" href="#"><img width="35" height="35" alt="User" src="'+ obj_user_private.foto +'"><span>'+ obj_user_private.nombre + ' '+ obj_user_private.apellido +'</span></a></div>';

        
        $user_active.append($(user_chat));
        



    };


	var addMsgToUserConnect = function(data)
	{
		/*var user_chat = "";	
		var obj_user_private = new Object();
		obj_user_private = get_data_user(nickname);

		user_chat = '<div id="user_'+nickname+'"><a class="user_online" href="#"><img width="35" height="35" alt="User" src="'+ obj_user_private.foto +'"><span>'+ obj_user_private.nombre + ' '+ obj_user_private.apellido +'</span></a></div>';

        
        $user_active.append($(user_chat));*/
        console.log("->"+data);


		for (var i = data.length - 1; i >= 0; i--) {
		  // AGREGAR MENSAJES
		   var chat_msgs = "";
		   var date = data[i].date_msg; //"2012-11-23 17:10:20"
		   var  mm = new Array('Jan', 'Feb', 'Mar','Apr', 'May', 'Jun','Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec');
		   var date_str = mm[date.substr(5,2)]+' '+ date.substr(8,2) +' at '+ date.substr(11,2) +':'+date.substr(14,2)+'  (GMT-6)';
		   chat_msgs = '<div class="bloque_chat">'+chat_msgs_usr(data[i].id_uid,'#333')+'<div class="date_chat">'+date_str+'</div><div class="clear"></div></div><div class="cont_text_chat">'+data[i].message+'</div></div><div class="clear"></div></div>';
			        $messages.append($(chat_msgs));
			        $messages.scrollTo('100%', 800 );   
		 };   
 

       /* for (var i = data.length - 1; i >= 0; i--) {
           console.log(data[i]);

           // AGREGAR MENSAJES

	        var chat_msgs = "";
			var date = data[i].date_msg; //"2012-11-23 17:10:20"
		    var  mm = new Array('Jan', 'Feb', 'Mar','Apr', 'May', 'Jun','Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec');
	    	var date_str = mm[date.substr(5,2)]+' '+ date.substr(8,2) +' at '+ date.substr(11,2) +':'+date.substr(14,2)+'  (GMT-6)';

			chat_msgs = '<div class="bloque_chat">'+chat_msgs_usr(nickname,'#333')+'<div class="date_chat">'+date_str+'</div><div class="clear"></div></div><div class="cont_text_chat">'+message+'</div></div><div class="clear"></div></div>';
	        $messages.append($(chat_msgs));
	        $messages.scrollTo('100%', 800 );



        };  */      
        
    };

	  

    var disconectUserConnect = function(nickname)
	{
		
		 $('#user_'+nickname).remove();
    };


    
  


	/*var setUserOnline = function(nickname){

		//$users_online.append($("<li>@" + nickname + ":"+ message +"</li>"));
	    str = "<a onmouseout='off(1156)' onmouseover='on(1156,0)' href='javascript:chat_priv_switch('1156', true);' class='cont_users'><img width='35' height='35' border='0' alt='user' src='../images/perfil/69668_Rana_Sengupta_1156.jpg'><span class='id_user_activo'>Renee Ortiz</span></a>";
		
		$users_online.append($(str));

	};*/



	
// setUserOnline('1623');

	var chat_msgs_usr = function (user, color )
	{
		var obj_user_private = new Object();
		obj_user_private = get_data_user(user);
		
		/*return '<img width="35" border="0" height="35"  src="'+obj_user_private.foto+'"></span><span class="coment_chat" style="color: '+color+'"><span class="link_user_chat" style="color: '+color+'">'+obj_user_private.nombre+" "+obj_user_private.apellido+" ("+obj_user_private.pais+") "+'says:</span>';*/
		
		return '<div class="img_chat"><img width="35" border="0" height="35"  src="'+obj_user_private.foto+'"></div><div class="comment_chat"><div><div class="title_user_chat">'+obj_user_private.nombre+" "+obj_user_private.apellido+" ("+obj_user_private.pais+") "+'says:'+'</div>';
	 
	}


	var get_data_user = function (user)
	{
		var obj_user = new Object();
		var photo_path = 'http://ella.practicalaction.org/alliances/images/perfil/thumb_';

        for (var i = 0; i < data.length; i++){
         
            var id_dato = data[i].uid;

			
			if(id_dato == user){
				obj_user.nombre = data[i].first_name;
			    obj_user.apellido = data[i].family_name;
				obj_user.foto = photo_path+data[i].photo;
				obj_user.pais = data[i].country;
				break;
			}	

        }

        return obj_user;
	}

	

	
	


});