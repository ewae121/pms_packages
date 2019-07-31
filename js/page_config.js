"use strict";

var PAGE_CONFIG_HEIGHT = 30;
var PAGE_CONFIG_ID = 'page-config';

var DEBUG_PAGE_CONFIG = 'PageConfig';
var DEBUG_PAGE_CONFIG_LEVEL = DEBUG_INFO;

var PAGE_CONFIG_HOME_DISCONNECTED_NAME = 'Home (Disconnected)';
var PAGE_CONFIG_HOME_CONNECTED_NAME = 'Home';

function debugPageConfig(msg, level = DEBUG_INFO){
   debug(DEBUG_PAGE_CONFIG, DEBUG_PAGE_CONFIG_LEVEL, level, msg);
}

function _pageConfig(){
   debugPageConfig("Initialization");

   var pageConfigClasses = 'w3-bar w3-blue w3-border-top w3-border-white';
   var v_pos = TOP_MENU_HEIGHT;
   var pageConfigStyle = 'height: '+ PAGE_CONFIG_HEIGHT+'px; top: '+v_pos+'px; position:fixed; line-height:1';
   addDivToDiv(HTML_CONTENT_ROOT_ID, PAGE_CONFIG_ID, pageConfigClasses, pageConfigStyle);

   _pageConfigMenuClosed();
   _pageConfigMenuOpened();

   _pageConfigCloseMenu();
}

function _pageConfigMenuClosed()
{
   var pageConfigId = PAGE_CONFIG_ID;

   var pageConfigClosedId = pageConfigId+'-closed';
   var pageConfigClosedClasses =  pageConfigId + ' w3-bar';
   addDivToDiv(pageConfigId, pageConfigClosedId, pageConfigClosedClasses);

   var openBtnId = pageConfigClosedId + '-open-btn' ;
   var openBtnContent = '<img src=share/png/not_executed_24x24.png height="24" width="24" alt="status">';
   var openBtnClasses = pageConfigId + ' w3-margin-left';
   var openBtnStyle = 'cursor:pointer';

   addDivToDiv(pageConfigClosedId, openBtnId, openBtnClasses, openBtnStyle, openBtnContent);

   $('#'+openBtnId).click(function(){
      _pageConfigOpenMenu();
   });
}

function _pageConfigMenuOpened()
{
   var pageConfigId = PAGE_CONFIG_ID;

   var pageConfigOpenedId = PAGE_CONFIG_ID+'-opened';
   var pageConfigOpenedClasses =  PAGE_CONFIG_ID + ' w3-bar w3-animate-left';
   var pageConfigOpenedStyle = 'display:none';
   addDivToDiv(PAGE_CONFIG_ID, pageConfigOpenedId, pageConfigOpenedClasses, pageConfigOpenedStyle);

   var btnClasses = PAGE_CONFIG_ID + " w3-bar-item w3-button";

   var closeBtnId = pageConfigOpenedId +'-close-btn';
   var closeBtnStyle = "width:150px";
   var closeBtnContent = "Close &times;";
   addDivToDiv(pageConfigOpenedId, closeBtnId, btnClasses, closeBtnStyle, closeBtnContent);

   $('#'+closeBtnId).click(function(){
      _pageConfigCloseMenu();
   });

   var advId = pageConfigOpenedId +'-adv';
   var advContent = 'Expand all<i id="'+advId+'-icon" class="fa fa-toggle-off w3-margin-left"></i>';
   addDivToDiv(pageConfigOpenedId, advId, btnClasses, "", advContent);

   $('#'+advId).click(function(){
      var pageConfigId = $(this).parent().parent().parent().attr('id');
      var iconId = '#' + $(this).attr('id') + "-icon";
      if ($(iconId).hasClass('fa-toggle-off'))
      {
         $(iconId).removeClass('fa-toggle-off');
         $(iconId).addClass('fa-toggle-on');
      }else{
         $(iconId).removeClass('fa-toggle-on');
         $(iconId).addClass('fa-toggle-off');
      }
      sendChangeExpanded()
   });

   var lockedId = pageConfigOpenedId +'-locked';
   var lockedContent = 'Vérouillage<i id="'+lockedId+'-icon" class="fa fa-toggle-on w3-margin-left"></i>';
   addDivToDiv(pageConfigOpenedId, lockedId, btnClasses, "", lockedContent);

   var refreshId = pageConfigOpenedId +'-refresh';
   var refreshClasses = btnClasses+' menu-button';
   var refreshContent = '<span>Rafraîchir le status</span>';
   addDivToDiv(pageConfigOpenedId, refreshId, refreshClasses, "", refreshContent);
}

function _pageConfigOpenMenu(){
   $('#'+PAGE_CONFIG_ID+'-closed').hide();
   $('#'+PAGE_CONFIG_ID+'-opened').show();
}

function _pageConfigCloseMenu(){
   $('#'+PAGE_CONFIG_ID+'-closed').show();
   $('#'+PAGE_CONFIG_ID+'-opened').hide();
}
