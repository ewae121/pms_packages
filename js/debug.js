"use strict";

//Global constants
var DEBUG_CRITICAL = 0;
var DEBUG_MAJOR = 1;
var DEBUG_ERROR = 2;
var DEBUG_WARNING = 3;
var DEBUG_INFO = 4;
var DEBUG_NOTICE = 5;
var DEBUG_DEBUG = 6;

function dbgLevelString (level){
   if (level == DEBUG_CRITICAL)     return 'CRITICAL';
   else if (level == DEBUG_MAJOR)   return 'MAJOR';
   else if (level == DEBUG_ERROR)   return 'ERROR';
   else if (level == DEBUG_WARNING) return 'WARNING';
   else if (level == DEBUG_INFO)    return 'INFO';
   else if (level == DEBUG_NOTICE)  return 'NOTICE';
   else if (level == DEBUG_DEBUG)   return 'DEBUG';
   else{
      console.log('debug: MAJOR - unknown debug level: '+ level);
      return 'UNKNOWN';
   }
}

function debug(module, chosenLevel, level, msg){
   if (level <= chosenLevel){
      console.log(module +': '+dbgLevelString(level)+' - ' + msg);
   }
}

