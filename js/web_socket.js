"use strict";

//CONSTANTS
var WEB_SOCKET_PORT = 8000;

var WEB_SOCKET_STATE_DISCONNECTED = 'Disconnected';
var WEB_SOCKET_STATE_CONNECTING = 'Connecting...';
var WEB_SOCKET_STATE_CONNECTED = 'Connected';

//Global vars
var _socket = undefined;
var _socketState = WEB_SOCKET_STATE_DISCONNECTED;

var _debug = false;
var _DBG_WEB_SOCKET_LEVEL = DEBUG_INFO;

function debugWebSocket(level, msg){
   debug('WEB_SOCKET', _DBG_WEB_SOCKET_LEVEL, level, msg);
}

function _updateSocketState(state){
   if (state != WEB_SOCKET_STATE_DISCONNECTED
      && state != WEB_SOCKET_STATE_CONNECTING
      && state != WEB_SOCKET_STATE_CONNECTED)
   {
      debugWebSocket(DEBUG_ERROR, 'The socket state is not a valid state: '+ state);
      return;
   }

   if (state == _socketState){
      debugWebSocket(DEBUG_WARNING, 'The socket state is already in state: '+ _socketState);
      return;
   }
   _socketState = state;
   if(_socketState == WEB_SOCKET_STATE_DISCONNECTED) _socket = undefined;
   debugWebSocket(DEBUG_INFO, 'The socket state has changed to: '+ _socketState);

   topMenuUpdateState();
}

//Open web socket connection
function wsConnect()
{
   var hostAddress = window.location.host.split(':');
   var connectionString = "ws://"+hostAddress[0]+":"+WEB_SOCKET_PORT;
   _updateSocketState(WEB_SOCKET_STATE_CONNECTING);

   setTimeout (function(){_openSocket(connectionString);}, 1000);
}

function wsConnected()
{
   debugWebSocket(DEBUG_INFO, 'Connected to host');
   _updateSocketState(WEB_SOCKET_STATE_CONNECTED);

   pageSetHomeConnected();
}

function wsDisconnected()
{
   pageSetHomeDisconnected();

   _updateSocketState(WEB_SOCKET_STATE_DISCONNECTED);
}

//Asynchronous websocket methods
function _openSocket (host){
   debugWebSocket(DEBUG_INFO, 'Try to connect to: '+ host);

   if(!window.WebSocket) {
      debugWebSocket(DEBUG_CRITICAL, 'Your Internet browser doesn\'t support WebSockets. Please use Firefox or Chrome.');
      return false;
   } else {
      _socket = new WebSocket(host);
   }
   _socket.onopen = function (){
      wsConnected();
   }
   _socket.onmessage = function(msg){
      //debugWebSocket(DEBUG_INFO, 'Message received: '+ msg['data']);
      
      try { //tente de parser data
         parsePmsMsg (msg);
      } catch(exception) {
         console.log('------------ERROR detected: ');
         console.log(exception.message);
         console.log(exception.stack);
         console.log (msg.data);
         console.log('------------End ERROR detected: ');
      }
   }
   _socket.onclose = function(){
     wsDisconnected();
   }
   _socket.onerror = function(){
     wsDisconnected();
   }
}

//Send 
function sendMessage(data){
   if (_socketState == WEB_SOCKET_STATE_CONNECTED){
      var jsonData = JSON.stringify(data);
      debugWebSocket(DEBUG_INFO, 'send message: ' + jsonData);

      _socket.send(jsonData);
   }else{
      var jsonData = JSON.stringify(data);
      debugWebSocket(DEBUG_ERROR, 'We can not send the message "'+ jsonData +'": invalid state (' + _socketState+')');
   }
}

