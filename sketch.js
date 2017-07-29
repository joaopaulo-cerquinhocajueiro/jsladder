
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
    colSize = floor(0.9*width / horz);
    linSize = floor(0.9*height / vert);
    if (colSize < linSize) {
        linSize = colSize;
//        vert = floor(height/linSize);
    } else {
        colSize = linSize;
//        horz = floor(width/colSize);        
    }
    console.log("colSize: "+colSize);
    console.log("linSize: "+linSize);
}

function GElement(name, pos) {
    this.name = name;
    this.pos = pos;
    this.status = "offline";
    this.sizeX = 1;
    this.sizeY = 1;
    
    this.shape = function() {
        
    }
    
    this.mouseIsOver = function() {
        if((mouseX >= (this.pos.x+0.2)*colSize) && (mouseX < (this.pos.x+this.sizeX-0.2)*colSize) && (mouseY >= this.pos.y*linSize) && (mouseY < (this.pos.y+this.sizeY)*linSize)){
            return Boolean(true);
        } else {
            return Boolean(false);
        }
    }
    
    this.draw = function() {
        push();
        strokeWeight(0.03);
        translate(this.pos.x*colSize,this.pos.y*linSize);
        scale(colSize,linSize);
        if (this.status == "offline"){
            stroke(0);
            //console.log("offline");
        } else if (this.status == "selected") {
            stroke(0,0,150);
            //console.log("selected");
        } else if (this.status === "low") {
            stroke(0,150,0);
        } else if (this.status === "low") {
            stroke(0,150,0);
        } else if (this.status === "high") {
            stroke(150,0,0);
        }
        this.shape();
        textSize(0.2);
        noStroke();
        fill(0);
        textAlign("center");
        text(this.name,0.5,0.95);
        pop();
    }
}

function ContactNO(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.3, 0.5);
        line(0.7, 0.5, 1.0, 0.5);
        line(0.3, 0.2, 0.3, 0.8);
        line(0.7, 0.2, 0.7, 0.8);
    }
}

function CoilNO(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
    }
}

function CoilNC(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        line(0.4, 0.7, 0.6, 0.3);
    }
}

function CoilSet(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        textAlign(CENTER,CENTER);
        textSize(0.3);
        noStroke();
        fill(0);
        text('S',0.5,0.5);
    }
}

function CoilReset(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        textAlign(CENTER,CENTER);
        textSize(0.3);
        noStroke();
        fill(0);
        text('R',0.5,0.5);
    }
}
function HorLine(pos) {
    GElement.call(this,"",pos);
    
    this.shape = function() {
        line(0, 0.5, 1.0, 0.5);
    }
}

function VerLine(pos) {
    GElement.call(this,"",pos);
    
    this.shape = function() {
        line(0.5, 0.0, 0.5, 1.0);
    }
}

function ContactNC(name, pos) {
    GElement.call(this,name,pos);
    
    this.shape = function() {
        line(0, 0.5, 0.3, 0.5);
        line(0.7, 0.5, 1.0, 0.5);
        line(0.3, 0.2, 0.3, 0.8);
        line(0.7, 0.2, 0.7, 0.8);
        line(0.35, 0.75, 0.65, 0.25);
    }
}

var shapesTable;

function setup() {
    var index = 0;
    for (var l = 0; l < vert ; l++){
        for (var c = 0; c < horz; c++){
            table[index++] = new CoilReset('Q2',createVector(c,l));
        }
    }
    console.log(table);
    index = 0;
    for (var l = 0; l < vert-1 ; l++){
        for (var c = 0; c < horz-1; c++){
            verTable[index++] = new GElement('',createVector(c+0.5,l+0.5));
        }
    }
    console.log(verTable);
    shapesTable = {
        no: new ContactNO('',createVector(horz+1.5,0)),
        nc: new ContactNC('',createVector(horz+1.5,1)),
        hor: new HorLine(createVector(horz+1.5,2)),
        ver: new VerLine(createVector(horz+1.5,3)),
        co: new CoilNO('',createVector(horz+3,0)),
        cc: new CoilNC('',createVector(horz+3,1)),
        cs: new CoilSet('',createVector(horz+3,2)),
        cr: new CoilReset('',createVector(horz+3,3)),
        selectedShape: ''
    }; 
    canvas = createCanvas(innerWidth, innerHeight);
    resize(innerWidth,innerHeight);
    //frameRate(10);
    //canvas.position(300,50);
    canvas.parent('contentor');
    //console.log(width)
//    shapesTable.no = new ContactNO('',createVector(horz+2,0));
//    shapesTable.nc = new ContactNC('',createVector(horz+2,1));
//    shapesTable.hor = new HorLine(createVector(horz+2,2));
//    shapesTable.ver = new VerLine(createVector(horz+2,3));
}


function draw() {
    background(255,255,220);
    noFill();
    stroke(235,235,190);
    strokeWeight(1);
    for (var i = 1; i < horz; i++) {
        line(colSize*i,0,colSize*i,linSize*vert);
    }
    for (var i = 0; i <= vert; i++) {
        line(0,linSize*i,colSize*horz,linSize*i);
    }
    stroke(0);
    strokeWeight(3);
    line(0,0,0,linSize*vert);
    line(colSize*horz,0,colSize*horz,linSize*vert);
    
    if(shapesTable.no.mouseIsOver() && shapesTable.no.status != "high"){
        shapesTable.no.status = "selected";
    } else if (shapesTable.no.status!= "high"){
        shapesTable.no.status = "offline";
    }
    shapesTable.no.draw();

    if(shapesTable.nc.mouseIsOver() && shapesTable.nc.status!= "high"){
        shapesTable.nc.status = "selected";
    } else if (shapesTable.nc.status!= "high"){
        shapesTable.nc.status = "offline";
    }
    shapesTable.nc.draw();
    
    shapesTable.co.draw();
    shapesTable.cc.draw();
    shapesTable.cs.draw();
    shapesTable.cr.draw();

    
    if(shapesTable.hor.mouseIsOver() && shapesTable.hor.status != "high"){
        shapesTable.hor.status = "selected";
    } else if (shapesTable.hor.status!= "high"){
        shapesTable.hor.status = "offline";
    }
    shapesTable.hor.draw();

    if(shapesTable.ver.mouseIsOver() && shapesTable.ver.status != "high"){
        shapesTable.ver.status = "selected";
    } else if (shapesTable.ver.status!= "high"){
        shapesTable.ver.status = "offline";
    }
    shapesTable.ver.draw();

    for (var index=0; index<horz*vert; index++){
        table[index].draw();
    }
   for (var index=0; index<(horz-1)*(vert-1); index++){
        verTable[index].draw();
    }
}

function mousePressed() {
    if (mouseX<horz*colSize) {
        if (shapesTable.selectedShape == "ver"){
            var loc = createVector(floor(mouseX/colSize-0.5),floor(mouseY/linSize-0.5));
            verTable[loc.x+loc.y*(horz-1)] = new VerLine(loc.add(createVector(0.5,0.5)));
        } else {
            var loc = createVector(floor(mouseX/colSize),floor(mouseY/linSize));
            if(shapesTable.selectedShape=="NO") {
                table[loc.x+loc.y*horz] = new ContactNO("I0",loc);
            } else if(shapesTable.selectedShape=="NC") {
                table[loc.x+loc.y*horz] = new ContactNC("I0",loc);        
            } else if(shapesTable.selectedShape=="hor") {
                table[loc.x+loc.y*horz] = new HorLine(  loc);
            }            
        }
    } else {
        if(shapesTable.no.mouseIsOver()){
            shapesTable.no.status = "high";
            shapesTable.selectedShape = "NO";
        } else {
            shapesTable.no.status = "offline"
        }
        if(shapesTable.nc.mouseIsOver()){
            shapesTable.nc.status = "high";
            shapesTable.selectedShape = "NC";
        } else {
            shapesTable.nc.status = "offline"
        }        
        if(shapesTable.hor.mouseIsOver()){
            shapesTable.hor.status = "high";
            shapesTable.selectedShape = "hor";
        } else {
            shapesTable.hor.status = "offline"
        }        
        if(shapesTable.ver.mouseIsOver()){
            shapesTable.ver.status = "high";
            shapesTable.selectedShape = "ver";
        } else {
            shapesTable.ver.status = "offline"
        }        
    }
}

function windowResized() {
    canvas.resize(innerWidth,innerHeight);
    resize(innerWidth,innerHeight);
}