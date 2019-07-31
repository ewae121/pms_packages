/////utils////////////
function addDivToDiv(parentId, divId, classes, style="", content=""){
   _addElementToDiv(parentId, 'div', divId, classes, style, content);
}

function _addElementToDiv(parentId, divType,divId, classes, style="", content=""){
   var div = '<'+divType+' id="'+divId+'" class="'+classes+'" style="'+style+'">'+content+'</'+divType+'>';
   $('#'+parentId).append(div);
}

function addListToDiv(parentId, divId, classes, style="", title=""){
   _addElementToDiv(parentId, 'ul', divId, classes, style);
}

function addElementToList(parentId, divId, classes, style="", content=""){
   _addElementToDiv(parentId, 'li', divId, classes, style, content);
}

function addSelectToDiv(parentId, divId, classes, style="", content=[], selectedValue=''){
   _addElementToDiv(parentId, 'select', divId, classes, style);
   if (selectedValue == null || selectedValue == undefined)
      selectedValue = '';
   for (var elementIdx in content){
      var isSelected = false;
      var name = content[elementIdx];
      var optionId = name;
      if (typeof (name) == 'string'){
         optionId = name.toLowerCase();
         if (selectedValue.toLowerCase() == name.toLowerCase())
            isSelected = true;
      }else{
         if (selectedValue == name)
            isSelected = true;
      }
      _addSelectOptionToDiv(divId, optionId, name, isSelected);
   }
}

function _addSelectOptionToDiv(parentId, optionId, name, selected){
   var selectedStr = "";
   if (selected)
      selectedStr = "selected";
   var div = '<option id="'+optionId+'" value="'+optionId+'" '+selectedStr +'>'+name+'</option>';
   $('#'+parentId).append(div);
}
/////end utils////////////
