"use strict";

//Global vars
var msgId = 1;
var msgIds = new Object();

var _DBG_WEB_SOCKET_PMS_LEVEL = DEBUG_INFO;

function debugWebSocketPms(level, msg){
   debug('WEB_SOCKET_PMS', _DBG_WEB_SOCKET_PMS_LEVEL, level, msg);
}

//Send 
function sendMessageToPms(method, params = {}){
   var data = {};
   data['id'] = msgId;
   data['jsonrpc'] = '2.0';
   data['method'] = method;
   data['params'] = params;

   debugWebSocketPms(DEBUG_INFO, "Send the message to PMS Server: "+JSON.stringify(data));
   sendMessage(data);
   if (method != "undefined"){
      msgIds [msgId] = method;
   }else{
      debugWebSocketPms(DEBUG_MAJOR, "The method should never be NULL: "+JSON.stringify(data));
   }
   msgId += 1;
}

//Receive
function parsePmsMsg(msg){
   var data = JSON.parse(msg.data)

   if ("id" in data && data["id"] in msgIds)
   {
      var methodId = msgIds[data["id"]];
      delete msgIds[data["id"]];
      
      if ("result" in data)
      {
         //console.log("%j", data["result"]);
         var results = data["result"];
         if (methodId == 'loadSite'){
            //after it was initialized we request to get the root id
            debugWebSocketPms(DEBUG_INFO, "loadSite cmd received: "+JSON.stringify(data));
            sendGetPageContent(ROOT_ELT_ID);
         }else if (methodId == 'getPageContent'
           || methodId == 'changeExpanded'){
            debugWebSocketPms(DEBUG_INFO, "changeExpanded cmd received: "+JSON.stringify(data));
            var pageId = data['result']['element']['id'];
            pageSet('SetPageContent', data['result']);
         }else if (methodId == 'loadApplication'){
            debugWebSocketPms(DEBUG_INFO, "loadApplication cmd received: "+JSON.stringify(data));
            var pageId = data['result']['element']['id'];
            pageSet('SetPageContent', data['result']);
         }
      }
      else
      {
	      console.log("weird mesg received: %j", data);
      }
   }
   else
   {
      if ("method" in data)
      {
         if ('params' in data && data['params'] != null){ 
            if ('values' in data['params']){
               console.log("%j", data['params']['divId']);
               console.log("%j", data['params']['values']);
            }
         }
         if (data['method'] == 'serverVersion'){
            debugWebSocketPms(DEBUG_INFO, "serverVersion notif received: "+JSON.stringify(data));
            var serverVersion = data['params']['version'];
            topMenuSetVersion(serverVersion);
         }else if (data['method'] == 'serverTime'){
            // Spam the console
            // debugWebSocketPms(DEBUG_INFO, "serverTime notif received: "+JSON.stringify(data));
            var serverTime = data['params']['serverTime'];
            topMenuSetConnection(serverTime);
         }else if (data['method'] == 'serverUser'){
            debugWebSocketPms(DEBUG_INFO, "serverUser notif received: "+JSON.stringify(data));
            var serverUser = data['params']['serverUser'];
            topMenuSetUser(serverUser);
         }else if (data['method'] == 'operationCommandStatus'){
            debugWebSocketPms(DEBUG_INFO, "operationCommandStatus notif received: "+JSON.stringify(data));
            var params = data['params'];
            var eltId = params['eltId'];
            var operation = params['operation'];
            if (getElt(eltId) == undefined)
               return;
            setCommandResult(eltId, operation, params);
            if (operation == 'check' || params['state'] == ELT_STATUS_RUNNING) {
               selectStepElementContent(eltId+'-content-step-menu-'+operation);
               setEltStatus(eltId, params['state']);
               var execString = getExecString(params);
               var eltExecId = '#'+eltId+'-title-text-right-exec';
               $(eltExecId).html(execString);
            }
            if (operation == 'exec' && params['state'] == ELT_STATUS_RUNNING) {
               $("."+eltId+'.elt-button-exec').text('Stop');
            } else {
               $("."+eltId+'.elt-button-exec').text('Exécuter');
            }
            
         }else if (data['method'] == 'pauseChanged'){
            debugWebSocketPms(DEBUG_INFO, "pauseChanged notif received: "+JSON.stringify(data));
            var params = data['params'];
            var eltId = params['eltId'];
            if (getElt(eltId) == undefined)
               return;
            var isPaused = params['isPaused'];
            var delay = params['delay'];
            setEltPause(eltId, delay, isPaused);
         }
      }
      else
      {
         //error
      }
   }
}

function sendLoadSite(){
   debugWebSocketPms(DEBUG_DEBUG, "SendLoadSite");
   sendMessageToPms('loadSite', {});
}

function sendChangeExpanded(){
   print_call_stack();
   debugWebSocketPms(DEBUG_DEBUG, "Request Change expanded");
   var params = {};
   sendMessageToPms('changeExpanded', params);
}

function sendGetPageContent(eltId){
   print_call_stack();
   debugWebSocketPms(DEBUG_DEBUG, "Request page content");
   var params = {'eltId':eltId};
   sendMessageToPms('getPageContent', params);
}

function sendLoadProc(params = {'procName':'system'}){
   debugWebSocketPms(DEBUG_DEBUG, "SendLoadProc: "+params['procName']);
   sendMessageToPms('loadApplication', params);
}

