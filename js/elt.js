"use strict";

var _elements = {};
var _elt_dbg  = false;

var ELT_SECTION_MENU_WIDTH = "200px";

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

      if (elt['type'] == "procedure"
         || elt['type'] == "pmsApplication"){
         if (parentId != PAGE_ID){
            eltStyle += "cursor:pointer";
            eltClasses += " procedure-small";
         }
      }
      addDivToDiv(parentId, eltId, eltClasses, eltStyle);

      //make the div Content
      _eltGenTitle(elt);
      _eltGenMenu(elt);
      _eltGenDescription(elt);
      _eltGenContent(elt);
   }else{
      console.log('elt ' + elt + ' is not an object');
   }
}

function _eltGenTitle(elt){
   var eltId = elt['id'];

   var eltTitleId = eltId+'-title';
   var eltTitleClasses = eltId + ' w3-container elt-light elt-title';
   addDivToDiv(eltId, eltTitleId, eltTitleClasses);

   if (elt['type'] == 'step'
      || elt['type'] == 'procedure'
      || elt['type'] == 'pmsApplication')
   {
      var eltTitleTextId = eltTitleId+"-text";
      var eltTitleTextClasses = eltId + " w3-xlarge w3-cell-row";
      var eltTitleTextStyle = "font-weight:bold";
      var eltTitleTextIconId = eltTitleTextId+"-icon";
      var eltTitleTextIcon = '<i id="'+eltTitleTextIconId+'" class="'+eltId+' w3-cell w3-cell-middle w3-margin-right"></i>';
      addDivToDiv(eltTitleId, eltTitleTextId, eltTitleTextClasses, eltTitleTextStyle, eltTitleTextIcon);

      var eltTitleTextContentId = eltTitleTextId+"-content";
      var eltTitleTextContentClasses = eltId + " w3-padding w3-cell w3-cell-middle";
      var eltTitleTextContentStyle = "width:80%";
      var eltTitleTextContentContent = elt['name'];
      addDivToDiv(eltTitleTextId, eltTitleTextContentId, eltTitleTextContentClasses, eltTitleTextContentStyle, elt['name']);

      var eltTitleRightId = eltTitleTextId+"-right";
      var eltTitleRightClasses = eltId + ' w3-small w3-cell w3-cell-middle';
      var eltTitleRightStyle = 'width:30%';
      addDivToDiv(eltTitleTextId, eltTitleRightId, eltTitleRightClasses, eltTitleRightStyle);

      var eltTitleExecId = eltTitleRightId+"-exec";
      var eltTitleExecClasses = eltId;
      var eltTitleExecStyle = 'text-align:right';
      var execString = getExecString(elt);
      addDivToDiv(eltTitleRightId, eltTitleExecId, eltTitleExecClasses, eltTitleExecStyle, execString);
   }else{
      if (elt['type'] == 'info'
         || elt['type'] == 'pmsApplicationsMgr'
         || elt['type'] == 'config'
         || elt['type'] == 'home')
         _eltGenTitleInfo(elt);
   }
}

function _eltGenDescription(elt){
   var eltId = elt['id'];

   var desc = elt['desc'];

   var alwaysFullDesc = false;
   if ('alwaysFullDesc' in elt && elt['alwaysFullDesc'] == true) {
      alwaysFullDesc = true;
   }

   if ($('#'+eltId).hasClass('procedure-small')
       && !alwaysFullDesc) {
      var isComplete = true;
      // If it is a procedure small display the desc has to be summarized
      // We kept the first html line
      var lines = desc.split("<BR/>");
      if (lines.length > 1){
         desc = lines[0];
         isComplete = false;
      }

      var elements = desc.split(" ");
      if (elements.length > 10) {
         isComplete = false;
         desc = desc.split(" ", 10).join(" ");
      } else {
         desc = elements.join(' ');
      }
      if (isComplete == false)
         desc += " <STRONG>...</STRONG>";
   }

   var eltDescId = eltId+"-describe";
   var eltDescClasses = eltId + ' w3-margin-left';
   var eltDescStyle = "";
   addDivToDiv(eltId, eltDescId, eltDescClasses, eltDescStyle, "<p>"+desc+"</p>");
}

function _eltGenMenu(elt){
   var eltId = elt['id'];

   var eltMenuId = eltId+'-menu';
   var eltMenuClasses = eltId + ' w3-container elt-dark elt-menu';
   addDivToDiv(eltId, eltMenuId, eltMenuClasses);

   if (elt['type'] == 'step'
      || elt['type'] == 'procedure'
      || elt['type'] == 'pmsApplication')
   {
      var delay = getDelay(elt);
      if (delay != null) {
         var eltMenuDelayId = eltMenuId+"-delay";
         var delayString = getDelayString(eltId, delay, elt['isPaused']);
         var eltMenuDelayClasses = eltId + ' w3-small w3-right btn-delay elt-dark elt-border-light w3-button';
         var eltMenuDelayStyle = 'text-align:right';
         addDivToDiv(eltMenuId, eltMenuDelayId, eltMenuDelayClasses, eltMenuDelayStyle, delayString);
      }
   }
}

function getDelay(elt) {
   var delay = null;
   if ('check' in elt)
      if ('delay' in elt['check'])
         delay = elt['check']['delay'];
   return delay;
}

function setEltPause(eltId, delay, isPaused) {
   var delayString = getDelayString(eltId, delay, isPaused);
   var eltDelayId = '#'+eltId+'-menu-delay';
   $(eltDelayId).html(delayString);
}

function getDelayString(eltId, delay, isPaused) {
   var eltTitleDelayIconId = eltId+'-title-text-right-delay-icon';
   if (isPaused == false)
      return '<img src=share/png/play_16x16.png height="16" width="16" alt="status" style="margin-right:6px">' + delay;
   else
      return '<img src=share/png/pause_16x16.png height="16" width="16" alt="status" style="margin-right:6px">' + delay;
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
   var lastExec = ('lastExec' in elt)?elt['lastExec']:'NA';
   var duration = ('duration' in elt)?elt['duration']:'?';

   var execStringPrefix = (elt['type'] == 'config')?'Last update':'Last check';

   var execString = execStringPrefix + ': '+ lastExec + ' in '+ duration +' ms';

   return execString;
}

function _eltGenContent(elt){
   var eltId = elt['id'];

   var eltContentId = eltId+'-content';
   var eltContentClasses = eltId + ' w3-container elt-adv-section elt-border-dark';
   var eltContentStyle = '';
   addDivToDiv(eltId, eltContentId, eltContentClasses, eltContentStyle);
   var operation = "check";

   if (elt['type'] == 'procedure'
      || elt['type'] == 'home'
      || elt['type'] == 'pmsApplicationsMgr'){
      var elts = elt['children'];
      for (var idx in elts){
         var eltChild = getElt(elts[idx]);
         _eltGen(eltChild, eltContentId);
      }
   }else if (elt['type'] == 'step'){
      _eltGenContentStep(elt);
   }else if (elt['type'] == 'config'){
      var params = elt['children']
      var eltParamListId = eltContentId+'-params';
      var eltParamListClasses = eltId + ' w3-ul w3-border elt-border-dark w3-hoverable w3-margin-bottom';
      addListToDiv(eltContentId, eltParamListId, eltParamListClasses, "");
      var eltParamsTitleId = eltContentId+'-params-title';
      var eltParamsTitleClasses = eltId + ' elt-dark elt-border-dark';
      addElementToList(eltParamListId, eltParamsTitleId, eltParamsTitleClasses, "", "Paramètres");
      for (var paramIdx in params){
         var paramdbg = params[paramIdx];
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
      && elt['type'] != 'step'
      && elt['type'] != 'info'
      && elt['type'] != 'pmsApplicationsMgr'
      && elt['id']   != 'home')
   {
      var eltBtnId = eltContentId+'-btn';
      var eltBtnClasses = eltId + ' w3-button elt-button menu-button w3-right w3-margin-bottom elt-dark';
      //   if (sectionName != 'Status'){
         eltBtnClasses += ' elt-btn-locked';
      //   }
      var eltBtnStyle = "max-height:800px;overflow:none;";
      var btnLabel = 'Exécuter';
      if (operation == 'check')
         btnLabel = 'Rafraîchir';
      if ('btnLabel' in elt)
         btnLabel =  elt['btnLabel'];
      else if(('operations' in elt)
              && (operation in elt['operations'])
              && ('btnLabel' in elt['operations'][operation]))
         btnLabel =  elt['operations'][operation]['btnLabel'];

      var method = 'execute';
      addDivToDiv(eltContentId, eltBtnId, eltBtnClasses, eltBtnStyle, '<span>'+btnLabel+'</span>');
      //to move for all buttons
      $('#'+eltBtnId).click(function(e){
         e.stopImmediatePropagation();
         e.preventDefault();

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

