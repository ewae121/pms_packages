"use strict";

var PAGE_ID = 'page';

var DEBUG_PAGE_CONTENT = 'PageContent';
var DEBUG_PAGE_CONTENT_LEVEL = DEBUG_INFO;

function debugPageContent(msg, level = DEBUG_INFO){
   debug(DEBUG_PAGE_CONTENT, DEBUG_PAGE_CONTENT_LEVEL, level, msg);
}

function _pageContentReset(){
   debugPageContent(DEBUG_INFO, "Reset the page content")
   $('#'+PAGE_ID).empty();
}

function _pageContent(){
   debugPageContent(DEBUG_INFO, 'Initialize');

   var marginTop = TOP_MENU_HEIGHT + PAGE_NAV_HEIGHT + 5;
   var eltClasses = '';
   var eltStyle = 'margin-top: '+ marginTop +'px';
   addDivToDiv(HTML_CONTENT_ROOT_ID, PAGE_ID, eltClasses, eltStyle);
}

function _pageContentSetHomeDisconnected(){
   debugPageContent(DEBUG_INFO, 'Request for the page: HomeDisconnected (local)');

   var element = {};
   element['id'] = ROOT_ELT_ID;
   element['type'] = 'info';
   element['name'] = "Bienvenu dans le Process Management System";

   var desc = '';
   desc += '<p><strong>Actuellement vous n\'êtes connecté à aucun serveur</strong></p>';
   desc += '<p>Pour activer le Serveur, il suffit de:</p>';
   
   desc += '<ul>';
   desc += '<li>Se connecter avec <a href="http://www.putty.org">Putty</a> ou votre client SSH préféré au server</li>';
   desc += '<li>De lancer: sudo launchPms</li>';
   desc += '<li>De cliquer sur le bouton refresh dans la bar de menu en haut à droite à côté de Disconnected.</li>';
   desc += '</ul>';
   
   desc += '<p>Bonne expérience.</p>';
   element ['desc'] = desc;
   _pageContentSet(element);
}

function _pageContentSet(element){
   debugPageContent(DEBUG_INFO, 'Request for the page:'+ element['id']);

   eltManagerInitPage(element);
}

