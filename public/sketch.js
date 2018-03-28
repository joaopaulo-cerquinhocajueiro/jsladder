
var canvas;//, text;
//var hs1;
var horz = 10; // 10 columns
var vert = 8;  // 8 lines
var colSize, linSize;

var table = [];
var verTable = [];

var toolBar;
var elementTable;
var buttonErase, buttonSave, varList;
var varListExist=false;
var lastVarListPos;

var inputs = ["a", "b", "c", "d"];
var memories = ["x", "y", "z"];
var outputs = ["q","coiso", "valvula"];

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
    colSize = floor(0.9*width / (1.5*horz));
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
    var blob = new Blob([elementTable.json()], {type: "text/json;charset=utf-8"});
    saveAs(blob, filename+".json");
 //   console.log(elementTable.json())
}

function setup() {

    canvas = createCanvas(innerWidth, innerHeight);
    resize(innerWidth,innerHeight);
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
}

function draw() {
    background(255,255,220);
    elementTable.draw();
    
    toolBar.update();
    toolBar.draw();
}

function mousePressed() {
    if (elementTable.mouseIsOver()) {
        elementTable.clicked();
    } else {
        toolBar.select();
        varList.remove();
    }
}

function windowResized() {
    canvas.resize(innerWidth,innerHeight);
    resize(innerWidth,innerHeight);
    buttonErase.position(colSize*12, linSize*8);
    buttonSave.position(colSize*12, linSize*8.5);
}