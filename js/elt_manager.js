"use strict"

var DEBUG_ELT_MGR = 'ELT_MANAGER';
var DEBUG_ELT_MGR_LEVEL = DEBUG_INFO;

var _elements = {};

var _currentProcId = '';
var _currentProcName = '';

//In python server the root elt must be proc-1
var ROOT_ELT_ID = 'proc-0';

var ELT_STATUS_NOT_EXECUTED   = 0;
var ELT_STATUS_PENDING        = 1;
var ELT_STATUS_RUNNING        = 2;
var ELT_STATUS_SUCCEED        = 3;
var ELT_STATUS_FAILED         = 4;

function debugEltMgr(msg, level = DEBUG_INFO){
   debug(DEBUG_ELT_MGR, DEBUG_ELT_MGR_LEVEL, level, msg);
}

function print_call_stack() {
  var stack = new Error().stack;
  console.log("PRINTING CALL STACK");
  console.log( stack );
}

function eltManagerInitPage(proc){
//   if (_currentProcId == proc['id']
//       && _currentProcName == proc['name']){
//      debugEltMgr('The current procedure is already: ' + proc['id'] + '-'+proc['name'], DEBUG_WARNING);
//      return;
//   }

   if (!eltIsValid(proc)){
      debugEltMgr('Procedure '+proc['name'] +' is not valid', DEBUG_ERROR);
      return;
   }

   _eltManagerInit(proc);

   debugEltMgr('The current procedure is now: ' + proc['id'] + "-"+proc["name"], DEBUG_INFO);
   _currentProcId = proc['id'];
   _currentProcName = proc['name'];
}

function _eltManagerInit(proc){
   _elements = {};
   _eltManagerSaveElt(proc);

   //make the element div
   _eltGen(proc, PAGE_ID);

   eltInitDefaults();

   //Dom actions
   $('.procedure-small').click(function()
   {
      var divId = $(this).attr('id');
      sendGetPageContent(divId);
   });
}

function _eltManagerSaveElt(elt){
   //Save the elements into the global elements dict
   if (elt['type'] == 'procedure' || elt['type'] == 'config'){
      var newElts = [];
      for (var idx in elt['elts']){
         var child = elt['elts'][idx];
         if (typeof(child) === 'object')
         {
            _eltManagerSaveElt(child);
            newElts.push(child['id']);
         }
      }
      elt['elts'] = newElts;
   }

   _elements[elt['id']] = elt;
}

/////json////////////
function checkParam(elt, name, type){
   if (name in elt){
      var eltType = typeof(elt[name]);
      if (eltType == type){
         return true;
      }else{
         console.log('The element '+name+' attribute has an invalid type('+type+') in %j', elt);
         return false;
      }
   }else{
      console.log('The element '+name+' attribute was not found %j', elt);
      return false;
   }
}

function getElt(eltId){
   if (!(eltId in _elements)){
      console.log('Unexisting elt id "'+eltId+'" detected');
      return undefined;
   }
   return _elements[eltId];
}

function getEltProperty(eltId, property){
   var elt = getElt(eltId);

   var eltProperty = undefined;
   if (property in elt)
      eltProperty = elt[property];
   return eltProperty;
}

function _setEltProperty(eltId, property, value){
   var elt = getElt(eltId);

   console.log('Element Id "'+eltId+'" property "'+ property +' changed to: '+ value);
   elt[property] = value;
}

function updateEltProperty(eltId, property, value){
   var actualValue = getEltProperty(eltId, property);

//   if (actualValue == value){
//      console.log('WARNING: Request to change the element id "'+eltId+'" property "'+property +'" with the same value: "'+value+'"');
//      return false;
//   }
   _setEltProperty(eltId, property, value);
   return true;
}
/////end json////////////

//////elt validity///////////
function eltIsValid(elt){
   //crash if id doesn't exist
   if (_elt_dbg) console.log('Check elt id: '+elt['id']);
   if (!checkParam(elt, 'id', 'string'))
      return false;
   if (!checkParam(elt, 'type', 'string'))
      return false;
   if (!checkParam(elt, 'name', 'string'))
      return false;
   if (!checkParam(elt, 'desc', 'string'))
      return false;

   var type = elt['type'];
   if (type == "cmd")
      return _eltIsValidCmd(elt);
   else if (type == "procedure")
      return _eltIsValidProcedure(elt);
   else if (type == "info")
      return _eltIsValidInfo(elt);
   else if (type == "parameter")
      return _eltIsValidParameter(elt);
   else if (type == "config")
      return true;
   else{
      console.log('elt type ('+type+') is invalid [cmd, procedure, info, config, parameter]');
      return false;
   }
}

function _eltIsValidInfo(elt){
   //crash if id doesn't exist
   return true;
}

function _eltIsValidParameter(elt){
   //crash if id doesn't exist
   return true;
}

function _eltIsValidCmd(elt){
   //crash if id doesn't exist
   if (!checkParam(elt, 'cmd', 'string'))
      return false;
   return true;
}

function _eltIsValidProcedure(elt){
   //crash if id doesn't exist
   if (!checkParam(elt, 'elts', 'object'))
      return false;

   var elts = elt['elts'];
   if (!Array.isArray(elts)){
      console.log('The element '+elts+' attribute must be an array %j', elt);
      return false;
   }

   for (var idx in elts){
      var eltChild = elts[idx];
      if (typeof(eltChild) === 'object')
         eltIsValid(eltChild);
   }

   return true;
}
//////end elt validity///////////

function eltInitDefaults(){
   for (var eltId in _elements)
   {
      var elt = _elements[eltId];
      var actualStatus = _elements[eltId]['status'] = ('status' in elt)?elt['status']:ELT_STATUS_NOT_EXECUTED;
      setEltStatus(eltId, actualStatus, true);

      //if (eltId != ROOT_ELT_ID)
      //   eltHideContent(eltId);
   }
}

function setEltStatus(eltId, eltStatus, force = false){
   var oldStatus = getEltProperty(eltId, 'status');
   removeEltColor(eltId, oldStatus);
   removeEltTitleIcon(eltId, oldStatus);

   var hasChanged = updateEltProperty(eltId, 'status', eltStatus);
   if (!force)
      if (!hasChanged) return;

   setEltColor(eltId, eltStatus);
   setEltTitleIcon(eltId, eltStatus);

   if (eltStatus == ELT_STATUS_NOT_EXECUTED){
      setEltTitleExec(eltId, 'Aucune éxécution');
   }else if (eltStatus == ELT_STATUS_RUNNING){
      setEltTitleExec(eltId, 'Rafraîchissement en cours...');
   }

   if (eltStatus == ELT_STATUS_RUNNING)
      $("."+eltId+'.elt-btn').addClass('w3-disabled');
   else
      $("."+eltId+'.elt-btn').removeClass('w3-disabled');
}

function setEltTitleIcon(eltId, eltStatus){
   var eltTitleTextIconId = '#'+eltId+'-title-text-icon';
   var icons = getStatusClasses(eltStatus);
   for (var iconIdx in icons){
      $(eltTitleTextIconId).addClass(icons[iconIdx]);
   }
}

function removeEltTitleIcon(eltId, oldStatus){
   var icons = getStatusClasses(oldStatus);
   var eltTitleTextIconId = '#'+eltId+'-title-text-icon';
   for (var iconIdx in icons){
      $(eltTitleTextIconId).removeClass(icons[iconIdx]);
   }
}

function setEltColor(eltId, eltStatus){
   var colors = getStatusColors(eltStatus);
   $("."+eltId+".elt-dark").addClass('w3-' + colors['dark']);
   $("."+eltId+".elt-border-dark").addClass('w3-border-' + colors['dark']);
   $("."+eltId+".elt-light").addClass('w3-' + colors['light']);
   $("."+eltId+".elt-border-light").addClass('w3-border-' + colors['light']);
}

function removeEltColor(eltId, oldStatus){
   var colors = getStatusColors(oldStatus);
   $("."+eltId+".elt-dark").removeClass('w3-' + colors['dark']);
   $("."+eltId+".elt-border-dark").removeClass('w3-border-' + colors['dark']);
   $("."+eltId+".elt-light").removeClass('w3-' + colors['light']);
   $("."+eltId+".elt-border-light").removeClass('w3-border-' + colors['light']);
}

function setEltTitleExec(eltId, value){
   var eltTitleExecId = '#'+eltId+'_title-exec';
   $(eltTitleExecId).html(value);
}

///Those function should open and close the menu
function eltHideContent(eltId){
   var eltContentId = eltId+'-content';
   $('#'+eltContentId).hide();
}

function eltShowContent(eltId){
   var eltContentId = eltId+'-content';
   $('#'+eltContentId).show();
}

function getStatusClasses(eltStatus){
   if (eltStatus == ELT_STATUS_RUNNING)
      return ['fa-spinner', 'fa-spin'];
   else if(eltStatus == ELT_STATUS_SUCCEED)
      return ['fa-check-square-o'];
   else if(eltStatus == ELT_STATUS_FAILED)
      return ['fa-close'];
   else if (eltStatus == ELT_STATUS_NOT_EXECUTED)
      return ['fa-square-o'];
   else if (eltStatus == ELT_STATUS_PENDING)
      return ['fa-exclamation-triangle'];

   print_call_stack();
   console.log('Unknown state detected: '+eltStatus);
   return ['fa-square-o'];
}

function getStatusColors(eltStatus){
   if (eltStatus == ELT_STATUS_RUNNING)
      return {"dark":"blue", "light":"pale-blue"};
   else if(eltStatus == ELT_STATUS_SUCCEED)
      return {"dark":"green", "light":"pale-green"};
   else if(eltStatus == ELT_STATUS_FAILED)
      return {"dark":"red", "light":"pale-red"};
   else if (eltStatus == ELT_STATUS_NOT_EXECUTED)
      return {"dark":"blue", "light":"pale-blue"};
      //return {"dark":"grey", "light":"light-grey"};
   else if (eltStatus == ELT_STATUS_PENDING)
      return {"dark":"grey", "light":"light-grey"};
 //     return {"dark":"yellow", "light":"pale-yellow"};

   print_call_stack();
   console.log('Unknown state detected: '+eltStatus);
   return {"dark":"grey", "light":"light-grey"};
}

