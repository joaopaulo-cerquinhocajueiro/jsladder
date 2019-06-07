
var width = 800, height = 400;
var horz = 8, vert = 6;

SVG.on(document, 'DOMContentLoaded', function() {
    var svgToolbar = SVG('toolbar').size('100%', '100%').viewbox(0,0,360,700);
    var svgTable = SVG('table').size('100%', '100%').viewbox(0,0,800,700);
    var svgIO = SVG('io').size('100%', '100%').viewbox(0,0,350,700);

    toolBar = new ToolBar(svgToolbar);
    io = new IOView(svgIO, inputs, memories, outputs, counters);
    elementTable = new ElementTable(svgTable, horz, vert, io.coisos);

    buttonErase = document.getElementById('eraseButton');
    buttonErase.addEventListener('click',eraseAll);

    buttonSave = document.getElementById('saveButton');
    buttonSave.addEventListener('click',saveCode);

    buttonExport = document.getElementById('exportButton');
    buttonExport.addEventListener('click',exportCode);

    buttonSimulate = document.getElementById('simulateButton');
    buttonSimulate.addEventListener('click',simulate);

    // Sempre que mudar o arquivo, carrega o novo
    inputFile = document.getElementById('inputFile');
    inputFile.addEventListener('change', handleFileSelect, false);
});

var inputs = ["chave1", "chave2", "nivel", "temperatura"];
var memories = ["x", "y", "z"];
var outputs = ["treco","coiso", "troco", "cacareco"];
var counters = ["c0", "c1", "c2", "c3"];

// var buttonInputs = [];
// var dispMemories = [];
// var dispOutputs = [];

function indexFromXY(x,y){
    return y*horz+x;
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
    linSize = floor(0.9*height / (1,1*vert));
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
    var blob = new Blob([elementTable.json()], {type: "text/json;charset=utf-8"});
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
    elementTable.simulating = ! elementTable.simulating;
    var simButton = e.target;
    if(elementTable.simulating){
        simButton.style.backgroundColor = "#4C50AF";
        simButton.innerHTML = "Stop simulation";
    } else {
        simButton.style.backgroundColor = "#4CAF50";
        simButton.innerHTML = "Simulate";
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
      elementTable.writeJson(codeObject);
      io.writeJson(codeObject);
      elementTable.ioElements = io.coisos;
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}

