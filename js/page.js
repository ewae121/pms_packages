"use strict";

var DEBUG_PAGE = 'Page';
var DEBUG_PAGE_LEVEL = DEBUG_INFO;

var PAGE_HOME_DISCONNECTED_DIV_ID = 'home-disconnected';
var PAGE_HOME_CONNECTED_DIV_ID = 'home-connected';

var _currentPage = '';

function debugPage(msg, level = DEBUG_INFO){
   debug(DEBUG_PAGE, DEBUG_PAGE_LEVEL, level, msg);
}

function page(){
   //must be called only for initialize
   debugPage("Initialization");

   _pageConfig();
   _pageNav();
   _pageContent();

   pageSetHomeDisconnected();
}

function _pageReset(){
   debugPage("Reset");
   _pageNavReset();
   _pageContentReset();
}

function pageSet(pageId, params){
   debugPage("Set Page: " + pageId);

   if (pageId != 'SetPageContent'){
      if (pageId == _currentPage){
         debugPage("The current page is already: "+ pageId, DEBUG_WARNING);
         return;
      }
   }else{
      if (params['element']['id'] != _currentPage)
         pageId = params['element']['id'];
   }

   _pageReset();

   //should be removed
   if (pageId == PAGE_HOME_CONNECTED_DIV_ID){
      _pageNavSetHomeConnected();
      _pageContentSetHomeConnected();
   //end to remove
   } else if (pageId == PAGE_HOME_DISCONNECTED_DIV_ID){
      _pageNavSetHomeDisconnected();
      _pageContentSetHomeDisconnected();
   }else{
      var element = params['element'];

      _pageNavSet(element['nav']);
      _pageContentSet(element);
   }
   _currentPage = pageId;
}

function pageSetHomeDisconnected(){
   debugPage("Set Home Disconnected local");

   pageSet(PAGE_HOME_DISCONNECTED_DIV_ID);
}

function pageSetHomeConnected(){
   debugPage("Set Home Connected (Request)");

   //TODO add a waiting icon
   sendLoadSite();
}

