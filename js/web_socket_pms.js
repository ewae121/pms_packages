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
            debugWebSocketPms(DEBUG_INFO, "loadSite received: "+JSON.stringify(data));
            sendGetPageContent(ROOT_ELT_ID);
         }else if (methodId == 'getPageContent'
           || methodId == 'getExpandedPageContent'){
            debugWebSocketPms(DEBUG_INFO, "getPageContent received: "+JSON.stringify(data));
            var pageId = data['result']['element']['id'];
            pageSet('SetPageContent', data['result']);
         }else if (methodId == 'loadProc'){
            debugWebSocketPms(DEBUG_INFO, "loadProc received: "+JSON.stringify(data));
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
            var serverVersion = data['params']['version'];
            topMenuSetVersion(serverVersion);
         }else if (data['method'] == 'serverTime'){
            var serverTime = data['params']['serverTime'];
            topMenuSetConnection(serverTime);
         }else if (data['method'] == 'serverUser'){
            var serverUser = data['params']['serverUser'];
            topMenuSetUser(serverUser);
         }else if (data['method'] == 'commandStatus'){
            var params = data['params'];
            var eltId = params['eltId'];
            if (getElt(eltId) == undefined)
               return;
            setEltStatus(eltId, params['state']);
            if ('result' in params){
               var result = getHtmlResult(params['result']);
               var eltRsltId = '#'+eltId+'-content-rslt';
               $(eltRsltId).html(result);
            }
            var execString = getExecString(params);
            var eltExecId = '#'+eltId+'-title-text-exec';
            $(eltExecId).html(execString);
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

function sendGetExpandedPageContent(eltId){
   print_call_stack();
   debugWebSocketPms(DEBUG_DEBUG, "Request expanded page content");
   var params = {'eltId':eltId};
   sendMessageToPms('getExpandedPageContent', params);
}

function sendGetPageContent(eltId){
   print_call_stack();
   debugWebSocketPms(DEBUG_DEBUG, "Request page content");
   var params = {'eltId':eltId};
   sendMessageToPms('getPageContent', params);
}

function sendLoadProc(params = {'procName':'system'}){
   debugWebSocketPms(DEBUG_DEBUG, "SendLoadProc: "+params['procName']);
   sendMessageToPms('loadProc', params);
}

function getHtmlResult(result){
   console.log('raw result:' + result);
   var htmlResult = result.replace(new RegExp("\n", 'g'), '<BR/>');
   htmlResult = htmlResult.replace(new RegExp("\t", 'g'), '&#9');
   console.log('transformed result:' + htmlResult);
   return htmlResult
}

