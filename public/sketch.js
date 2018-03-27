
var canvas;//, text;
//var hs1;
var horz = 10; // 10 columns
var vert = 8;  // 8 lines
var colSize, linSize;

var table = [];
var verTable = [];

var toolBar;
var elementTable;
var button,varList;
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

function setup() {

    canvas = createCanvas(innerWidth, innerHeight);
    resize(innerWidth,innerHeight);
    //frameRate(10);
    //canvas.position(300,50);    
    canvas.parent('contentor');
    toolBar = new ToolBar(createVector(horz+1.5,0.3,0));
    elementTable = new ElementTable(createVector(0.3,0.3),createVector(horz,vert));

    button = createButton('Erase all');
    button.position(colSize*12, linSize*8);
    button.mousePressed(eraseAll);
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
    button.position(colSize*12, linSize*8);
}