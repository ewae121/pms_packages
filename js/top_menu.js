"use strict";

var TOP_MENU_HEIGHT = 90;
var TOP_MENU_ID = 'top-menu';

var DEBUG_TOP_MENU = 'TopMenu';
var DEBUG_TOP_MENU_LEVEL = DEBUG_INFO;

var DEFAULT_TOP_MENU_SERVER_VERSION = "Not Connected";
var DEFAULT_TOP_MENU_USERNAME = "Not connected user";
var DEFAULT_TOP_MENU_TITLE = "Procedure Management System - Not Connected";
var DEFAULT_TOP_MENU_CONNECTION_STATE = "Disconnected";

function debugTopMenu(msg, level = DEBUG_INFO){
   debug(DEBUG_TOP_MENU, DEBUG_TOP_MENU_LEVEL, level, msg);
}

function topMenu()
{
   debugTopMenu("Top menu - Initialization");

   //make the element div
   var eltClasses = 'w3-bar w3-blue';
   var eltStyle = 'height: '+ TOP_MENU_HEIGHT+'px ;top: 0; position:fixed';
   addDivToDiv(HTML_CONTENT_ROOT_ID, TOP_MENU_ID, eltClasses, eltStyle);

   _topMenuLeft();
   _topMenuTitle();
   _topMenuRight();

   topMenuUpdateState();
}

function topMenuUpdateState(){
   debugTopMenu("Top menu - Update state: " + _socketState);

   var serverVersion = DEFAULT_TOP_MENU_SERVER_VERSION;
   var username = DEFAULT_TOP_MENU_USERNAME;
   var title = DEFAULT_TOP_MENU_TITLE;
   var connectionState = DEFAULT_TOP_MENU_CONNECTION_STATE;

   if (_socketState == WEB_SOCKET_STATE_CONNECTED){
      connectionState = "Connected";
      title = "Procedure Management System";
      serverVersion = "Waiting ...";
   }else if(_socketState == WEB_SOCKET_STATE_CONNECTING){
      connectionState = "Connecting";
      title = "Procedure Management System - Connecting...";
      serverVersion = "Waiting ...";
   }

   topMenuSetVersion(serverVersion);
   topMenuSetUser(username);
   topMenuSetTitle(title);
   topMenuSetConnection(connectionState);
}

function topMenuSetVersion(serverVersion){
   var topMenuLeftId = '#'+TOP_MENU_ID+'-left';
   var topMenuLeftVersionId = topMenuLeftId+'-version';
   var versionText = 'Version (client/server):'+CLIENT_VERSION+'/'+serverVersion;
   $(topMenuLeftVersionId).html(versionText);
}

function topMenuSetUser(username){
   var topMenuRightId = '#'+TOP_MENU_ID+'-right';
   var topMenuRightUserId = topMenuRightId+'-user';
   $(topMenuRightUserId).html(username);
}

function topMenuSetTitle(title){
   var topMenuTitleId = '#'+TOP_MENU_ID+'-title';
   document.title = title;
   $(topMenuTitleId).html(title);
}

function topMenuSetConnection(connectionState){
   var topMenuRightId = '#'+TOP_MENU_ID+'-right';
   var topMenuRightConnectionId = topMenuRightId+'-connection';
   $(topMenuRightConnectionId).html(connectionState);
}

function _topMenuLeft(){
   var topMenuLeftId = TOP_MENU_ID+'-left';
   var eltClasses = 'w3-bar-item';
   addDivToDiv(TOP_MENU_ID, topMenuLeftId, eltClasses, "font-weight:bold; width:20%");

   var topMenuLeftTitleId = topMenuLeftId+'-title';
   var topMenuLeftTitleClasses = 'w3-large';
   addDivToDiv(topMenuLeftId, topMenuLeftTitleId, topMenuLeftTitleClasses, "", 'Soft R Evolution');
   
   var topMenuLeftSubTitleId = topMenuLeftId+'-sub-title';
   var topMenuLeftSubTitleClasses = '';
   addDivToDiv(topMenuLeftId, topMenuLeftSubTitleId, topMenuLeftSubTitleClasses, "", 'Procedure Management System');
   
   var topMenuLeftVersionId = topMenuLeftId+'-version';
   var topMenuLeftVersionClasses = 'w3-tiny';
   addDivToDiv(topMenuLeftId, topMenuLeftVersionId, topMenuLeftVersionClasses);
}

function _topMenuTitle()
{
   //make the element div
   var topMenuTitleId = TOP_MENU_ID+'-title';
   var eltClasses = 'w3-bar-item w3-xxlarge w3-center';
   addDivToDiv(TOP_MENU_ID, topMenuTitleId, eltClasses, "font-weight:bold; width:60%; line-height:65px;");
}

function _topMenuRight()
{
   var topMenuRightId = TOP_MENU_ID+'-right';
   var eltClasses = 'w3-bar-item w3-right-align';
   addDivToDiv(TOP_MENU_ID, topMenuRightId, eltClasses, "font-weight:bold; width:20%");

   var topMenuRightUserId = topMenuRightId+'-user';
   var topMenuRightUserClasses = 'w3-large';
   addDivToDiv(topMenuRightId, topMenuRightUserId, topMenuRightUserClasses);

   var topMenuRightConnectionId = topMenuRightId+'-connection';
   var topMenuRightConnectionClasses = 'w3-tiny';
   addDivToDiv(topMenuRightId, topMenuRightConnectionId, topMenuRightConnectionClasses, "font-weight:bold;"); 
}

