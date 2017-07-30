
var canvas;//, text;
//var hs1;
var horz = 10; // 10 columns
var vert = 8;  // 8 lines
var colSize, linSize;

var table = [];
var verTable = [];

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
    linSize = floor(0.9*height / (1.5*vert));
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


var toolBar;
var elementTable;

function setup() {

    canvas = createCanvas(innerWidth, innerHeight);
    resize(innerWidth,innerHeight);
    //frameRate(10);
    //canvas.position(300,50);
    canvas.parent('contentor');
    toolBar = new ToolBar(createVector(horz+1.5,0.3,0));
    elementTable = new ElementTable(createVector(0.3,0.3),createVector(horz,vert));
}


function draw() {
    background(255,255,220);
    elementTable.draw();
    
    toolBar.update();
    toolBar.draw();
}

function mousePressed() {
    if (elementTable.mouseIsOver()) {
        if (toolBar.selectedShape == "VerLine"){
            var loc = createVector(floor(mouseX/colSize-0.5),floor(mouseY/linSize-0.5));
            elementTable.verTable[loc.x+loc.y*(horz-1)] = new VerLine(loc.add(createVector(0.5,0.5)).add(elementTable.pos));
        } else {
            var loc = createVector(floor(mouseX/colSize),floor(mouseY/linSize));
            if(toolBar.selectedShape=="ContactNO") {
                elementTable.table[loc.x+loc.y*horz] = new ContactNO("I0",loc.add(elementTable.pos));
            } else if(toolBar.selectedShape=="NC") {
                table[loc.x+loc.y*horz] = new ContactNC("I0",loc);        
            } else if(toolBar.selectedShape=="hor") {
                table[loc.x+loc.y*horz] = new HorLine(  loc);
            }            
        }
    } else {
        toolBar.select();        
    }
}

function windowResized() {
    canvas.resize(innerWidth,innerHeight);
    resize(innerWidth,innerHeight);
}