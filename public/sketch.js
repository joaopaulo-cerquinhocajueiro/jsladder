"use strict";
var horz = 9, vert = 7;
var width = 100*horz;
var height = 100*vert;

var selectedTable = 1;
var globalValues = {};
var setPoints = {};
var simulating = false;

var svgToolbar;
var svgTable;
var svgIO;

var toolBar, io, elementTables, elementTable;
var buttonErase, buttonSave, buttonExport, buttonSimulate, inputFile, buttonEdit, buttonIO;

SVG.on(document, 'DOMContentLoaded', function() {
    svgToolbar = SVG('toolbar').size('100%', '100%').viewbox(0,0,510,700);
    svgTable = SVG('table').size('100%', '100%').viewbox(-20,-20,width+40,height+60);
    svgIO = SVG('io').size('100%', '100%').viewbox(0,0,400,700);

    toolBar = new ToolBar(svgToolbar);
    io = new IOView(svgIO, inputs, memories, outputs, counters, analogInputs);

    elementTables = [new ElementTable(svgTable, horz, vert, io.coisos)];
    elementTable = elementTables[selectedTable-1];

    buttonErase = document.getElementById('eraseButton');
    buttonErase.addEventListener('click',eraseAll);

    buttonSave = document.getElementById('saveButton');
    buttonSave.addEventListener('click',saveCode);

    buttonSave = document.getElementById('svgButton');
    buttonSave.addEventListener('click',saveSvg);

    // buttonExport = document.getElementById('exportButton');
    // buttonExport.addEventListener('click',exportCode);

    buttonSimulate = document.getElementById('simulateButton');
    buttonSimulate.addEventListener('click',simulate);

    buttonEdit = document.getElementById('toolMenuButton');
    buttonEdit.addEventListener('click',toggleEditMenu);

    buttonIO = document.getElementById('IOMenuButton');
    buttonIO.addEventListener('click',toggleIO);
    buttonIO.style.backgroundColor = "#4C50AF";

    // Sempre que mudar o arquivo, carrega o novo
    inputFile = document.getElementById('inputFile');
    inputFile.addEventListener('change', handleFileSelect, false);

    // Presente para tirar um bug que o botão de mostrar IO não funcionava de primeira.
    document.getElementById("io").style.display="flex";
});

var inputs = ["i0", "i1", "i2", "i3","i4", "i5", "i6", "i7"];
var memories = ["m0", "m1", "m2", "m3","m4", "m5", "m6", "m7"];
var outputs = ["q0", "q1", "q2", "q3","q4", "q5", "q6", "q7"];
var counters = ["c0", "c1", "c2", "c3"];
var analogInputs = ["ai0", "ai1"];

// var buttonInputs = [];
// var dispMemories = [];
// var dispOutputs = [];

function indexFromXY(x,y){
    return y*horz+x;
}

function renameInTable(elementTable,oldName,newName){
  for(var i=0; i<elementTable.table.length; i++){
    if(elementTable.table[i].name == oldName){
      elementTable.table[i].name = newName;
    }
  }
  for(var i=0; i<elementTable.contactSelector.options.length; i++){
    if(elementTable.contactSelector.options[i].text == oldName){
      elementTable.contactSelector.options[i].text = newName;
      elementTable.contactSelector.options[i].value = newName;
    }
  }
  for(var i=0; i<elementTable.coilSelector.options.length; i++){
    if(elementTable.coilSelector.options[i].text == oldName){
      elementTable.coilSelector.options[i].text = newName;
      elementTable.coilSelector.options[i].value = newName;
    }
  }
  for(var i=0; i<elementTable.counterSelector.options.length; i++){
    if(elementTable.counterSelector.options[i].text == oldName){
      elementTable.counterSelector.options[i].text = newName;
      elementTable.counterSelector.options[i].value = newName;
    }
  }
  
}

function renameInView(ioView,oldName,newName){
  var index = ioView.inputs.findIndex(name =>{
    return name == oldName;
  });
  if (index > -1){
    inputs[index] = newName;
  }
  var index = ioView.memories.findIndex(name =>{
    return name == oldName;
  });
  if (index > -1){
    memories[index] = newName;
  }
  var index = ioView.outputs.findIndex(name =>{
    return name == oldName;
  });
  if (index > -1){
    outputs[index] = newName;
  }
  var index = ioView.counters.findIndex(name =>{
    return name == oldName;
  });
  if (index > -1){
    ioView.counters[index] = newName;
  }
  var index = ioView.analogInputs.findIndex(name =>{
    return name == oldName;
  });
  if (index > -1){
    ioView.analogInputs[index] = newName;
  }
  
}

function isNewName(ioList,name){
  return ioList.filter(element =>{
    return element.name == name;
  }).length == 0;
}

function changeElementName(oldName,newName){
  renameInView(io,oldName,newName);
  renameInTable(elementTable,oldName,newName);
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }


function resize(width,height) {
//    if (width < 200) {
//        horz = floor(width/20);
//    } else {
//        horz = 10;
//    }
//    if (height < 140) {
//        vert = floor(height/20);
//    } else {
//        vert = 7;
//    }
    colSize = floor(0.9*width / (1.8*horz));
    linSize = floor(0.9*height / (1.1*vert));
    if (colSize < linSize) {
        linSize = colSize;
//        vert = floor(height/linSize);
    } else {
        colSize = linSize;
//        horz = floor(width/colSize);        
    }
//    console.log("colSize: "+colSize);
//    console.log("linSize: "+linSize);
}



function eraseAll() {
  if (!simulating){
    elementTable.eraseAll();
  }
}

function saveCode(){
    var filename = "teste";
    var codes = "[" + elementTables.map(table => {return table.jsonTable()}).join(", ") + "]";
    var variables = elementTables[0].jsonVar();
    var blob = new Blob(['{"version":1.0, "codes":' + codes + ', "variables":' + variables +'}'], {type: "text/json;charset=utf-8"});
    saveAs(blob, filename+".jsld");
 //   console.log(elementTable.json())
}

function saveSvg(){
  var filename = "teste";
  var blob = new Blob([elementTable.svg.svg(false)], {type: "image/svg+xml;charset=utf-8"});
  // var blob = new Blob([elementTable.svg.svg(function(node){node.fill("none");})], {type: "image/svg+xml;charset=utf-8"});
  saveAs(blob, filename+".svg");
//   console.log(elementTable.json())
}

function exportCode(){
  var filename = "teste";
  jsld2ard(elementTable.json(),code=>{
    var blob = new Blob([code], {type: "text/text;charset=utf-8"});
    saveAs(blob, filename+".ino");
  });
//   console.log(elementTable.json())
}

function simulate(e){
    simulating = !simulating;
    if(!simulating){
      for(let i=0;i<io.coisos.length;i++){
        io.coisos[i].value = 0;
        io.coisos[i].update();
      }
    }
    elementTables.forEach(elementTable => {
      elementTable.simulating = simulating;      
    });
    // var ioDiv = document.getElementById("io");
    var toolbarDiv = document.getElementById("toolbar");
    var simButton = e.target;
    if(simulating){
        buttonEdit.disabled = true;
        simButton.style.backgroundColor = "#4C50AF";
        simButton.innerHTML = "Stop simulation";
        // ioDiv.style.display = 'flex';
        toolbarDiv.style.display = 'none';
    } else {
        buttonEdit.disabled = false;
        simButton.style.backgroundColor = "#4CAF50";
        simButton.innerHTML = "Simulate";
        // ioDiv.style.display = 'none';
        toolbarDiv.style.display = 'flex';
    }
    //console.log(elementTable.simulating);
}

function toggleIO(e){
  var ioDiv = document.getElementById("io");
  var tButton = e.target;
  if(ioDiv.style.display == 'none'){
    ioDiv.style.display = 'flex';
    tButton.style.backgroundColor = "#4CAF50";
    tButton.innerHTML = "Hide IO";
  } else {
    ioDiv.style.display = 'none';
    tButton.style.backgroundColor = "#4C50AF";
    tButton.innerHTML = "Show IO";
  }
}

function toggleEditMenu(e){
  var toolDiv = document.getElementById("toolbar");
  var tButton = e.target;
  if(toolDiv.style.display == 'none'){
    toolDiv.style.display = 'flex';
    tButton.style.backgroundColor = "#4CAF50";
    tButton.innerHTML = "Hide Edit Menu";
} else {
    toolDiv.style.display = 'none';
    tButton.style.backgroundColor = "#4C50AF";
    tButton.innerHTML = "Show Edit Menu";
  }
}

function handleFileSelect(evt) { // always when selecting a new file
  var files = evt.target.files; // get the array with the file (there is only one)
  var f = files[0]; // select the first (and only) file

  var reader = new FileReader(); // a reader

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      var codeObject = JSON.parse(e.target.result);
      if (codeObject.version != "1.0"){
        console.log(codeObject.version)
        console.log("Incompatible version")
      } else {
        // console.log('1');
        elementTables = [];
        io.writeJson(codeObject);
        // console.log('2',io);
        for(var i=tableTabs.children.length-2;i>-1;i--){
          tableTabs.removeChild(tableTabs.children[i]);
        }
        // console.log('3')
        for(var i = 0;i<codeObject.codes.length;i++){
          // console.log(selectedTable);
          addTable(null);
          // console.log(selectedTable);
          elementTable.writeJson(codeObject.codes[i]);
          elementTable.ioElements = io.coisos;
          // console.log(elementTables,elementTable);
        }
      }
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}

// Tab control

function openTable(event,table){
  var tableTabs = document.getElementById("tableTabs");
  console.log("Abre tabela "+table);
  tableTabs.children[selectedTable-1].classList.remove("selected");
  selectedTable = table;
  elementTable.hide();
  elementTable = elementTables[selectedTable-1];
  elementTable.show();
  tableTabs.children[selectedTable-1].classList.add("selected");
}

function addTable(event){
  var tableTabsLength = tableTabs.children.length;
  var newButton = document.createElement("button");
  elementTables.push(new ElementTable(svgTable, horz, vert, io.coisos));
  elementTable.hide();
  elementTable = elementTables[elementTables.length-1];
  elementTable.show();
  newButton.className += "selected";
  newButton.innerHTML = tableTabsLength;
  newButton.onclick = (event => {openTable(event,tableTabsLength)});
  try {
     tableTabs.children[selectedTable-1].classList.remove("selected");
  } catch (error){
    if(error instanceof TypeError){

    }else {
      logMyErrors(error);
    }
  }
  selectedTable = tableTabsLength;
  tableTabs.insertBefore(newButton,tableTabs.lastChild.previousSibling);
}