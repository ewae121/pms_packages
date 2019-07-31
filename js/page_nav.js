"use strict";

var PAGE_NAV_HEIGHT = 30;
var PAGE_NAV_ID = 'page-nav';

var DEBUG_PAGE_NAV = 'PageNav';
var DEBUG_PAGE_NAV_LEVEL = DEBUG_INFO;

var PAGE_NAV_HOME_DISCONNECTED_NAME = 'Home (Disconnected)';
var PAGE_NAV_HOME_CONNECTED_NAME = 'Home';

function debugPageNav(msg, level = DEBUG_INFO){
   debug(DEBUG_PAGE_NAV, DEBUG_PAGE_NAV_LEVEL, level, msg);
}

function _pageNav(){
   debugPageNav("Initialization");

   var eltClasses = 'w3-bar w3-blue w3-border-top w3-border-white';
   var v_pos = TOP_MENU_HEIGHT + PAGE_CONFIG_HEIGHT;
   var eltStyle = 'height: '+ PAGE_NAV_HEIGHT+'px; top: '+v_pos+'px; position:fixed; line-height:1';
   addDivToDiv(HTML_CONTENT_ROOT_ID, PAGE_NAV_ID, eltClasses, eltStyle);
}

function _pageNavReset(){
   debugPageNav("Reset");
   $('#'+PAGE_NAV_ID).empty();
}

function _pageNavSet(pmsNav){
   debugPageNav("Set entry %j", pmsNav);

   for (var routeIdx in pmsNav)
   {
      var nav = pmsNav[routeIdx];

      var divId = PAGE_NAV_ID + '-'+ nav['id'];
      var eltClasses = 'pms_nav w3-bar-item';
      var eltStyle = 'font-weight:bold; vertical-align: middle';
      addDivToDiv(PAGE_NAV_ID, divId, eltClasses, eltStyle, '> '+ nav['name']);
   }
   $('.pms_nav:not(:last-child)').addClass('w3-button');
   $('.pms_nav:not(:last-child)').click(function(){
      var divId = $(this).attr('id');
      var idToRequest = divId.replace(PAGE_NAV_ID+'-', '');
      if (idToRequest != PAGE_HOME_CONNECTED_DIV_ID){
         sendGetPageContent(idToRequest);
      }
   });
}

function _pageNavSetHomeDisconnected(){
   var navDisconnected = [{'divId':PAGE_HOME_DISCONNECTED_DIV_ID, 'name':PAGE_NAV_HOME_DISCONNECTED_NAME}];
   _pageNavSet(navDisconnected);
}

function _pageNavSetHomeConnected(){
   var navConnected = [{'divId':PAGE_HOME_CONNECTED_DIV_ID, 'name':PAGE_NAV_HOME_CONNECTED_NAME}];
   _pageNavSet(navConnected);
}

