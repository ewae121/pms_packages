"use strict";

var _elements = {};
var _elt_dbg  = false;

var ELT_SECTION_MENU_WIDTH = "200px";

/////utils////////////
function addDivToDiv(parentId, divId, classes, style="", content=""){
   _addElementToDiv(parentId, 'div', divId, classes, style, content);
}

function _addElementToDiv(parentId, divType,divId, classes, style="", content=""){
   var div = '<'+divType+' id="'+divId+'" class="'+classes+'" style="'+style+'">'+content+'</'+divType+'>';
   $('#'+parentId).append(div);
}
/////end utils////////////

function _eltGen(elt, parentId){
   console.log("Start to process elt: %j", elt);
   if (typeof (elt) === 'object'){
      //make the element div
      var eltId = elt['id'];
      var eltClasses = eltId + ' ' + elt['type'] + ' w3-margin-bottom w3-card w3-hover-shadow w3-leftbar elt-border-dark elt-light';
      var eltStyle = '';
      if (parentId == PAGE_ID){
         eltClasses += " w3-margin-top";
      }

      if (elt['type'] == "procedure"){
         if (parentId != PAGE_ID){
            eltStyle += "cursor:pointer";
            eltClasses += " procedure-small";
         }
      }

      addDivToDiv(parentId, eltId, eltClasses, eltStyle);

      //make the div Content
      if (parentId == PAGE_ID
         && 'elts' in elt){
         //elts is tested to know if it is home page
         _eltGenTopMenu(elt);
      }
      _eltGenTitle(elt);
      _eltGenContent(elt);
   }else{
      console.log('elt ' + elt + ' is not an object');
   }
}

function _eltGenTopMenu(elt)
{
   var eltId = elt['id'];

   var eltTopId = eltId+'-top';
   var eltTopClasses = eltId + ' elt-dark';
   addDivToDiv(eltId, eltTopId, eltTopClasses);

   _eltGenTopMenuClosed(elt);

   _eltGenTopMenuOpened(elt);
}

function _eltGenTopMenuClosed(elt)
{
   var eltId = elt['id'];
   var eltTopId = eltId+'-top';

   var eltTopClosedId = eltTopId+'-closed';
   var eltTopClosedClasses =  eltId + ' w3-bar';
   addDivToDiv(eltTopId, eltTopClosedId, eltTopClosedClasses);

   var openBtnId = eltTopClosedId + '-open-btn' ;
   var openBtnClasses = eltId + ' w3-bar-item w3-button';
   var openBtnStyle = 'width:150px';
   var openBtnContent = '<i class="fa fa-bars" aria-hidden="true"></i>';
   addDivToDiv(eltTopClosedId, openBtnId, openBtnClasses, openBtnStyle, openBtnContent);

   $('#'+openBtnId).click(function(){
      var topMenuClosed = $(this).parent();
      var eltId = topMenuClosed.parent().parent().attr('id');
      _eltOpenTopMenu(eltId);
   });
}

function _eltGenTopMenuOpened(elt)
{
   var eltId = elt['id'];
   var eltTopId = eltId+'-top';

   var eltTopOpenedId = eltTopId+'-opened';
   var eltTopOpenedClasses =  eltId + ' w3-bar w3-animate-left';
   var eltTopOpenedStyle = 'display:none';
   addDivToDiv(eltTopId, eltTopOpenedId, eltTopOpenedClasses, eltTopOpenedStyle);

   var btnClasses = eltId + " w3-bar-item w3-button";

   var closeBtnId = eltTopOpenedId +'-close-btn';
   var closeBtnStyle = "width:150px";
   var closeBtnContent = "Close &times;";
   addDivToDiv(eltTopOpenedId, closeBtnId, btnClasses, closeBtnStyle, closeBtnContent);

   $('#'+closeBtnId).click(function(){
      var topMenuOpened = $(this).parent();
      var eltId = topMenuOpened.parent().parent().attr('id');
      _eltCloseTopMenu(eltId);
   });

   var advId = eltTopOpenedId +'-adv';
   var advContent = 'Expand all<i id="'+advId+'-icon" class="fa fa-toggle-off w3-margin-left"></i>';
   addDivToDiv(eltTopOpenedId, advId, btnClasses, "", advContent);

   $('#'+advId).click(function(){
      var eltId = $(this).parent().parent().parent().attr('id');
      var iconId = '#' + $(this).attr('id') + "-icon";
      if ($(iconId).hasClass('fa-toggle-off'))
      {
         $(iconId).removeClass('fa-toggle-off');
         $(iconId).addClass('fa-toggle-on');
         sendGetExpandedPageContent(eltId);
      }else{
         $(iconId).removeClass('fa-toggle-on');
         $(iconId).addClass('fa-toggle-off');
         sendGetPageContent(eltId);
      }
   });

   var lockedId = eltTopOpenedId +'-locked';
   var lockedContent = 'Vérouillage<i id="'+lockedId+'-icon" class="fa fa-toggle-on w3-margin-left"></i>';
   addDivToDiv(eltTopOpenedId, lockedId, btnClasses, "", lockedContent);

   var refreshId = eltTopOpenedId +'-refresh';
   var refreshClasses = btnClasses+' menu-button';
   var refreshContent = '<span>Rafraîchir le status</span>';
   addDivToDiv(eltTopOpenedId, refreshId, refreshClasses, "", refreshContent);
}

function _eltOpenTopMenu(eltId){
   $('#'+eltId+'-top-closed').hide();
   $('#'+eltId+'-top-opened').show();
}

function _eltCloseTopMenu(eltId){
   $('#'+eltId+'-top-closed').show();
   $('#'+eltId+'-top-opened').hide();
}

function _eltGenTitle(elt){
   var eltId = elt['id'];

   var eltTitleId = eltId+'-title';
   var eltTitleClasses = eltId + ' w3-container elt-light elt-title';
   addDivToDiv(eltId, eltTitleId, eltTitleClasses);

   if (elt['type'] == 'cmd'
      || elt['type'] == 'procedure'
      || elt['type'] == 'config')
   {
      var eltTitleTextId = eltTitleId+"-text";
      var eltTitleTextClasses = eltId + " w3-xlarge w3-cell-row";
      var eltTitleTextStyle = "font-weight:bold";
      var eltTitleTextIconId = eltTitleTextId+"-icon";
      var eltTitleTextIcon = '<i id="'+eltTitleTextIconId+'" class="'+eltId+' w3-cell w3-cell-middle w3-margin-right fa"></i>';
      addDivToDiv(eltTitleId, eltTitleTextId, eltTitleTextClasses, eltTitleTextStyle, eltTitleTextIcon);

      var eltTitleTextContentId = eltTitleTextId+"-content";
      var eltTitleTextContentClasses = eltId + " w3-cell w3-cell-middle";
      var eltTitleTextContentStyle = "width:80%";
      var eltTitleTextContentContent = elt['name'];
      addDivToDiv(eltTitleTextId, eltTitleTextContentId, eltTitleTextContentClasses, eltTitleTextContentStyle, elt['name']);

      var eltTitleExecId = eltTitleTextId+"-exec";
      var eltTitleExecClasses = eltId + ' w3-small w3-cell w3-cell-middle';
      var eltTitleExecStyle = 'width:30%; text-align:right';
      var execString = getExecString(elt);
      addDivToDiv(eltTitleTextId, eltTitleExecId, eltTitleExecClasses, eltTitleExecStyle, execString);
   }else{
      if (elt['type'] == 'info')
         _eltGenTitleInfo(elt);
   }

   var eltTitleDescId = eltTitleTextId+"-describe";
   var eltTitleDescClasses = eltId;
   var eltTitleDescStyle = "";
   addDivToDiv(eltTitleId, eltTitleDescId, eltTitleDescClasses, eltTitleDescStyle, "<p>"+elt['desc']+"</p>");
}

function _eltGenTitleInfo(elt){
   var eltId = elt['id'];
   var eltTitleId = eltId+'-title';

   var eltTitleTextId = eltTitleId+"-text";
   var eltTitleTextClasses = eltId + " w3-xlarge w3-cell-row";
   var eltTitleTextStyle = "font-weight:bold";
   addDivToDiv(eltTitleId, eltTitleTextId, eltTitleTextClasses, eltTitleTextStyle);

   var eltTitleTextContentId = eltTitleTextId+"-content";
   var eltTitleTextContentClasses = eltId + " w3-cell w3-cell-middle";
   var eltTitleTextContentStyle = "";
   var eltTitleTextContentContent = elt['name'];
   addDivToDiv(eltTitleTextId, eltTitleTextContentId, eltTitleTextContentClasses, eltTitleTextContentStyle, elt['name']);
}

function getExecString(elt){
   var lastExec = ('lastExec' in elt)?elt['lastExec']:'Jamais';
   var duration = ('duration' in elt)?elt['duration']:'?';

   var execStringPrefix = (elt['type'] == 'config')?'Dernière modification':'Dernière éxécution';

   var execString = execStringPrefix + ': '+ lastExec + '<BR/> en '+ duration +' ms';

   return execString;
}

function _eltGenContent(elt){
   var eltId = elt['id'];

   var eltContentId = eltId+'-content';
   var eltContentClasses = eltId + ' w3-container elt-adv-section elt-border-dark';
   var eltContentStyle = '';
   addDivToDiv(eltId, eltContentId, eltContentClasses, eltContentStyle);

   if (elt['type'] == 'procedure'){
      var elts = elt['elts'];
      for (var idx in elts){
         var eltChild = getElt(elts[idx]);
         _eltGen(eltChild, eltContentId);
      }
   }else if (elt['type'] == 'cmd'){
      var eltCmdId = eltContentId+'-cmd';
      var eltCmdClasses = eltId + ' w3-code w3-border-blue';
      addDivToDiv(eltContentId, eltCmdId, eltCmdClasses, "", elt['cmd']);
 
      var eltRsltId = eltContentId+'-rslt';
      var eltRsltClasses = eltId + ' w3-code elt-border-dark';
      var eltRsltStyle = 'max-height:800px;overflow:auto;';

      var result = ('output' in elt)?getHtmlResult(elt['output']):'Aucun résultat disponible';
      addDivToDiv(eltContentId, eltRsltId, eltRsltClasses, eltRsltStyle, result);
   }else if (elt['type'] == 'config'){
      var params = elt['elts']
      var eltParamListId = eltContentId+'-params';
      var eltParamListClasses = eltId + ' w3-ul w3-border elt-border-dark w3-hoverable w3-margin-bottom';
      addListToDiv(eltContentId, eltParamListId, eltParamListClasses, "");
      var eltParamsTitleId = eltContentId+'-params-title';
      var eltParamsTitleClasses = eltId + ' elt-dark elt-border-dark';
      addElementToList(eltParamListId, eltParamsTitleId, eltParamsTitleClasses, "", "Paramètres");
      for (var paramIdx in params){
         var param = _elements[params[paramIdx]];
         var eltParamId = param['id'];
         var eltParamClasses = eltId + ' ' + eltParamId + ' param w3-row w3-leftbar elt-border-dark';
         addElementToList(eltParamListId, eltParamId, eltParamClasses);

         var paramNameId =  eltParamId+'-name';
         var paramName =  param['name'];
         var paramNameClasses = eltId + ' ' + eltParamId + ' param-name w3-quarter';
         addDivToDiv(eltParamId, paramNameId, paramNameClasses, '', paramName);

         var paramValuesId =  eltParamId+'-values';
         var paramValues =  param['values'];
         var paramValuesClasses = eltId + ' ' + eltParamId + ' param-value w3-quarter';
         var selectedValue = '';
         if ('value' in param)
            selectedValue = param['value'];
         else{
            if ('default' in param)
               selectedValue = param['default']
         }
         addSelectToDiv(eltParamId, paramValuesId, paramValuesClasses, '', paramValues, selectedValue);

         var paramDescId =  eltParamId+'-desc';
         var paramDesc =  param['desc'];
         var paramDescClasses = eltId + ' ' + eltParamId + ' w3-half';
         addDivToDiv(eltParamId, paramDescId, paramDescClasses, 'padding-left:16px', paramDesc);
      }
   }

   if (!$('#'+eltId).hasClass('procedure-small')
      && elt['type'] != 'info')
   {
      var eltBtnId = eltContentId+'-btn';
      var eltBtnClasses = eltId + ' w3-button elt-button menu-button w3-right w3-margin-bottom elt-dark';
      //   if (sectionName != 'Status'){
         eltBtnClasses += ' elt-btn-locked';
      //   }
      var eltBtnStyle = "max-height:800px;overflow:none;";
      var btnLabel = 'Exécuter';
      if ('btnLabel' in elt)
         btnLabel =  elt['btnLabel'];
      var method = 'execute';
      addDivToDiv(eltContentId, eltBtnId, eltBtnClasses, eltBtnStyle, '<span>'+btnLabel+'</span>');
      $('#'+eltBtnId).click(function(){
         if($('#'+eltId).hasClass('config')){
            var isLoadProc = ($(this).text() == 'Lancer la procédure')?true:false;
            var values = {};
            $('#'+eltId+'-content-params').children().each(function(){
               if ($(this).hasClass('param')){
                  var name = $(this).attr('id');
                  var value = $("#"+name+"-values").val();
                  if (isLoadProc)
                     values['procName'] = value;
                  else
                     values[name] = value;
               }
            });
            if (isLoadProc)
               sendLoadProc(values);
            else
               sendMessageToPms('execute', {'id':eltId, 'newValues': values});
         }else{
            sendMessageToPms('execute', {'id':eltId});
         }
      });
   }
}

