"use strict"

var horz = 9, vert = 7;
var width = 100*horz;
var height = 100*vert;
var sistema;
var sistemaIntervalId;

var toolBar,elementTables,elementTable;
var buttonErase, buttonSave, buttonSimulate, inputFile;
var selectedTable = 1;
var simulating = false;

var globalValues = {};
var setPoints = {};

var svgToolbar;
var svgTable;
var svgIO;
var simSvg;

var memories = ["mem1", "mem2", "mem3", "mem4", "mem5"];
var counters = ["c0", "c1", "c2", "c3"];

window.addEventListener("load", function() {
    svgToolbar = SVG('toolbar').size('100%', '100%').viewbox(0,0,360,700);
    svgTable = SVG('table').size('100%', '100%').viewbox(-20,-20,width+40,height+60);
    // var svgSim = SVG('sim').size('100%', '100%').viewbox(0,0,600,700);

    toolBar = new ToolBar(svgToolbar);
    // io = new IOView(svgIO, inputs, memories, outputs, counters);
    // sistema = new VaiEVolta(svgSim, memories, counters);
    simSvg = document.getElementById("silos");

    sistema = new Silos(simSvg,memories,counters);  
    // sistemaIntervalId = window.setInterval(sistema.simulate,100);
    elementTables = [new ElementTable(svgTable, horz, vert, sistema.coisos)];
    elementTable = elementTables[selectedTable-1];

    buttonErase = document.getElementById('eraseButton');
    buttonErase.addEventListener('click',eraseAll);

    buttonSave = document.getElementById('saveButton');
    buttonSave.addEventListener('click',saveCode);

    // buttonExport = document.getElementById('exportButton');
    // buttonExport.addEventListener('click',exportCode);

    buttonSimulate = document.getElementById('simulateButton');
    buttonSimulate.addEventListener('click',simulate);

    // Sempre que mudar o arquivo, carrega o novo
    inputFile = document.getElementById('inputFile');
    inputFile.addEventListener('change', handleFileSelect, false);
});


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
  
}

function isNewName(ioList,name){
  return ioList.filter(element =>{
    return element.name == name;
  }).length == 0;
}

function changeElementName(oldName,newName){
  renameInView(sim,oldName,newName);
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
    elementTable.eraseAll();
}

function saveCode(){
    var filename = "teste";
    var codes = "[" + elementTables.map(table => {return table.jsonTable()}).join(", ") + "]";
    var variables = elementTables[0].jsonVar();
    var blob = new Blob(['{"codes":' + codes + ', "variables":' + variables +'}'], {type: "text/json;charset=utf-8"});
    saveAs(blob, filename+".json");
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
    elementTables.forEach(elementTable => {
      elementTable.simulating = simulating;      
    });
    var tableDiv = document.getElementById("tables");
    var simDiv = document.getElementById("sim");
    var toolbarDiv = document.getElementById("toolbar");
    var simButton = e.target;
    if(simulating){
        simButton.style.backgroundColor = "#4C50AF";
        simButton.innerHTML = "Stop simulation";
        // simDiv.style.display = 'flex';
        simDiv.style.width = '50%';
        tableDiv.style.width = '50%';
        toolbarDiv.style.display = 'none';

        sistemaIntervalId = setInterval(sistema.simulate,10);
    } else {
        simButton.style.backgroundColor = "#4CAF50";
        simButton.innerHTML = "Simulate";
        //simDiv.style.display = 'none';
        simDiv.style.width = '25%';
        toolbarDiv.style.display = 'flex';
        toolbarDiv.style.width = '25%';
        tableDiv.style.width = '70%';

        clearInterval(sistemaIntervalId);
        sistema.reset();
    }
    //console.log(elementTable.simulating);
}

function handleFileSelect(evt) { // always when selecting a new file
  var files = evt.target.files; // get the array with the file (there is only one)
  f = files[0]; // select the first (and only) file

  var reader = new FileReader(); // a reader

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      var codeObject = JSON.parse(e.target.result);
      elementTables = [];
      io.writeJson(codeObject);
      for(var i=tableTabs.children.length-2;i>-1;i--){
        tableTabs.removeChild(tableTabs.children[i]);
      }
      for(var i = 0;i<codeObject.codes.length;i++){
        addTable(null);
        elementTable.writeJson(codeObject.codes[i]);
      elementTable.ioElements = io.coisos;
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