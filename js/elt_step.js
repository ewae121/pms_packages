String.prototype.format = function() {
    var args = arguments;
    args['{'] = '{';
    args['}'] = '}';
    return this.replace(
        /{({|}|-?[0-9]+)}/g,
        function(item) {
            var result = args[item.substring(1, item.length - 1)];
            return typeof result == 'undefined' ? '' : result;
        }
    );
};

function _eltGenContentStep(elt){
   var eltId = elt['id'];
   var parentId = eltId+'-content';
   var newId = eltId+'-content-step';

   var stepContent = '<div id="{0}" class="{1}">' +
                     '</div>';

   var div = stepContent.format(newId, eltId);
   $('#'+parentId).append(div);

   _eltGenContentStepMenu(elt)

   var eltNumber =  1;
   if ('exec' in elt)
      eltNumber = 2

   var isDisplayed = true;
   if ('exec' in elt){
      _eltGenContentStepElement(elt, 'exec', 'Execute', eltNumber, isDisplayed);
      isDisplayed = false;
   }

   if ('check' in elt)
      _eltGenContentStepElement(elt, 'check', 'Check', eltNumber, isDisplayed);
}

function _eltGenContentStepMenu(elt){
  var eltId = elt['id'];
  var parentId = eltId+'-content-step';
  var newId = parentId+'-menu';

  var stepContentMenu = '<div id="{0}" class="{1} w3-row">' +
                         '</div>';

  var div = stepContentMenu.format(newId, eltId);
  $('#'+parentId).append(div);
}

function _eltGenContentStepMenuAdd(elt, menuName, menuTitle, eltNumber, isDisplayed){
  var eltId = elt['id'];
  var parentId = eltId+'-content-step-menu';
  var newId = parentId+'-'+menuName;

  var width = 100 / eltNumber;

  var isSelected = isDisplayed?"elt-dark":"elt-light";
  var stepCheckMenu = '<div id="{0}" class="{1} elt-menu-select-content w3-col tablink w3-bottombar {2} elt-border-dark w3-padding" style="width:{3}%">{4}</div>';
  menuDiv = stepCheckMenu.format(newId, eltId, isSelected, width, menuTitle);
  $('#'+parentId).append(menuDiv);
}

function _eltGenContentStepButton(elt, operation){
   var eltId = elt['id'];
   var parentId = eltId+'-content-step-' + operation;
   var newId = parentId +'-btn';

   var stepContent = '<div id="{0}"' +
                         ' class="{1} w3-button elt-button-{2} menu-button w3-right w3-margin-bottom elt-dark"' +
                         ' style="max-height:800px;overflow:none;">' +
                        '<span>{3}</span>' +
                     '</div>';

   var btnLabel = 'Exécuter';
   if (operation == 'check')
      btnLabel = 'Rafraîchir';
   else if(operation in elt
    && ('btnLabel' in elt[operation]))
      btnLabel =  elt[operation]['btnLabel'];

   var div = stepContent.format(newId, eltId, operation, btnLabel);
   $('#'+parentId).append(div);
}

function _eltGenContentStepElement(elt, operation, menuName, eltNumber, isDisplayed){
  var eltId = elt['id'];
  var parentId = eltId+'-content-step';

  _eltGenContentStepMenuAdd(elt, operation, menuName, eltNumber, isDisplayed);

  var display = isDisplayed?"w3-show":"w3-hide";

  var stepCheckContent = '<div id="{0}" class="{1} {2}">' +
                            '<div id="{0}-cmd" class="{1} w3-code w3-border-blue">' +
                              '{3}' +
                            '</div>' +
                            '<div id="{0}-rslt" class="{1} w3-code elt-border-dark" + style="max-height:800px;overflow:auto;">' +
                              '{4}' +
                            '</div>' +
                         '</div>';

  var result = (operation in elt && 'output' in elt[operation])?
                getHtmlResult(elt[operation]['output']):'Aucun résultat disponible';

  var newId = parentId+'-'+operation;
  var div = stepCheckContent.format(newId, eltId, display, elt[operation]['cmd'], result);
  $('#'+parentId).append(div);

  if ('unbuffered' in elt[operation] && elt[operation]['unbuffered']) {
    var rtTagId = '{0}-rt'.format(eltId);
    var rtTag = '<div id="{0}" class="{1} {2} w3-red">Real-Time display</div>';
    rtTag.format(rtTagId, eltId, display);

    $('#'+newId).prepend(rtTag);
  }

  _eltGenContentStepButton(elt, operation);
}

function selectStepElementContent(eltMenuId) {
   var parentId = $('#'+eltMenuId).parent().attr('id');

   var unselectedCmd = '-exec';
   var selectedCmd = '-check';
   
   if (eltMenuId.indexOf('check') < 0) {
      unselectedCmd = '-check';
      selectedCmd = '-exec';
   }

   var selectedMenu = parentId+selectedCmd;
   var unselectedMenu = parentId+unselectedCmd;
   $('#' + selectedMenu).removeClass('elt-light');
   $('#' + unselectedMenu).removeClass('elt-dark');
   $('#' + selectedMenu).addClass('elt-dark');
   $('#' + unselectedMenu).addClass('elt-light');

   var eltId = $('#'+parentId).parent().parent().parent().attr('id');
   if (eltId == undefined)
     return
   var eltStatus = getEltProperty(eltId, 'status');

   setEltStatus(eltId, eltStatus);

   var selectedContent = eltId+'-content-step'+selectedCmd;
   var unselectedContent = eltId+'-content-step'+unselectedCmd;
   $('#' + selectedContent).removeClass('w3-hide');
   $('#' + unselectedContent).removeClass('w3-show');
   $('#' + unselectedContent).addClass('w3-hide');
   $('#' + selectedContent).addClass('w3-show');
}

function elt_step_menu_select_action() {
   $('.elt-menu-select-content').click(function(e){
      e.stopImmediatePropagation();
      e.preventDefault();
      if ($(this).hasClass("elt-light")) {
         selectStepElementContent($(this).attr('id'));
      }
   });
}

function setCommandResult(eltId, operation, params) {
  if ('result' in params){
     var result = getHtmlResult(params['result']);
     var eltRsltId = '#'+eltId+'-content-step-'+operation+'-rslt';
     console.log('Div to update:' + eltRsltId);
     $(eltRsltId).html(result);
  }
}

function getHtmlResult(result){
   console.log('raw result:' + result);
   var htmlResult = result.replace(new RegExp("\n", 'g'), '<BR/>');
   htmlResult = htmlResult.replace(new RegExp("\t", 'g'), '&#9');
   console.log('transformed result:' + htmlResult);
   return htmlResult
}
