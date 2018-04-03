
var canvas;//, text;
//var hs1;
var horz = 10; // 10 columns
var vert = 8;  // 8 lines
var colSize, linSize;

var table = [];
var verTable = [];

var toolBar;
var elementTable;
var buttonErase, buttonSave, buttonSimulate,varList;
var varListExist=false;
var lastVarListPos;

var inputs = ["a", "b", "c", "d"];
var memories = ["x", "y", "z"];
var outputs = ["q","coiso", "valvula"];

var buttonInputs = [];
var dispMemories = [];
var dispOutputs = [];

function indexFromXY(x,y){
    return y*horz+x
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

function simulate(){
    elementTable.simulating = ! elementTable.simulating;
    //console.log(elementTable.simulating);
}

function setup() {

    canvas = createCanvas(innerWidth*0.8, innerHeight*0.8);
    resize(innerWidth*0.8,innerHeight*0.8);
    //frameRate(10);
    //canvas.position(300,50);    
    canvas.parent('contentor');
    toolBar = new ToolBar(createVector(horz+1.5,0.3,0));
    elementTable = new ElementTable(createVector(0.3,0.3),createVector(horz,vert));

    buttonErase = createButton('Erase all');
    buttonErase.position(colSize*12, linSize*8);
    buttonErase.mousePressed(eraseAll);

    buttonSave = createButton('Save code');
    buttonSave.position(colSize*12, linSize*8.5);
    buttonSave.mousePressed(saveCode);

    buttonSimulate = createButton('Simulate');
    buttonSimulate.position(colSize*13, linSize*8);
    buttonSimulate.mousePressed(simulate);

    //varList = createSelect('Variable')
    
    var bInputHorPos = 15;
    var bInputVerPos = 2;
    for(var i = 0; i< inputs.length;i++){
        buttonInputs[i] = new Bit(inputs[i],createVector(bInputHorPos,bInputVerPos),"input");
        bInputVerPos++;
    }
    var bInputHorPos = 16.5;
    var bInputVerPos = 2;
    for(var i = 0; i< memories.length;i++){
        dispMemories[i] = new Bit(memories[i],createVector(bInputHorPos,bInputVerPos),"memory");
        bInputVerPos ++;
    }
    var bInputHorPos = 18;
    var bInputVerPos = 2;
    for(var i = 0; i< outputs.length;i++){
        dispOutputs[i] = new Bit(outputs[i],createVector(bInputHorPos,bInputVerPos),"output");
        bInputVerPos ++;
    }

    // Sempre que mudar o arquivo, carrega o novo
    document.getElementById('inputFile').addEventListener('change', handleFileSelect, false);
}

function draw() {
    background(255,255,220);
    elementTable.draw();
    
    toolBar.update();
    toolBar.draw();
    push();
    scale(colSize,linSize); // Scale to the actual element size
    noStroke();
    fill(0);
    textSize(0.3); 
    textAlign(CENTER,BOTTOM);
        
    text("Inputs",15,1);
    text("Memories",16.5,1);
    text("Outputs",18,1);
    pop();
    for(var i = 0; i< inputs.length;i++){
        buttonInputs[i].draw();
    }
    for(var i = 0; i< outputs.length;i++){
        dispOutputs[i].draw();
    }
    for(var i = 0; i< memories.length;i++){
        dispMemories[i].draw();
    }
}

function mousePressed() {
    if (elementTable.mouseIsOver()) {
        elementTable.clicked();
    } else {
        toolBar.select();
        varList.remove();
        for(var i = 0; i< inputs.length;i++){
            if(buttonInputs[i].mouseIsOver()){
                buttonInputs[i].toggle();
            }
        }
    }
}

function windowResized() {
    canvas.resize(innerWidth,innerHeight);
    resize(innerWidth,innerHeight);
    buttonErase.position(colSize*12, linSize*8);
    buttonSave.position(colSize*12, linSize*8.5);
}

function handleFileSelect(evt) { // always when selecting a new file
  var files = evt.target.files; // get the array with the file (there is only one)
  f = files[0]; // select the first (and only) file
//   // Add a description for the file
//   var description = []; //using an array to make the file description
//   description.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
//                f.size, ' bytes, last modified: ',
//                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');
//   // Mount the description on the fileDescription
//   document.getElementById('fileDescription').innerHTML = '<br>' + description.join('');

  var reader = new FileReader(); // a reader

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      var codeObject = JSON.parse(e.target.result);
      elementTable.writeJson(codeObject);
      var horTableRead = codeObject.horizontal;
      var verTableRead = codeObject.vertical;
      var span = document.createElement('span');
      span.innerHTML = ['<br>',horTableRead[0],'<br>',verTableRead[0]].join('');
      document.getElementById('fileDescription').insertBefore(span, null);
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}

