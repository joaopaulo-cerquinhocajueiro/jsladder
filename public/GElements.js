// Object that represents the graphical elements of a ladder program

function GElement(name, pos) {
    this.name = name;
    this.pos = pos;
    this.actualColor = color(0,0,0);
    // The status of a graphical element may be "offline", "selected", "preview" or "executing"
    this.status = "offline";
    // When "executing", there is the input value before the element and the value of the variable, which defines the value in the output
    this.inputValue;
    this.varValue = 2;
    this.outputValue;
    // How many squares the shape occupies
    this.sizeX = 1;
    this.sizeY = 1;
    // The non selectable border, necessary to select vertical lines 
    this.hBorder = 0.2;
    // If the shape is a coil
    this.isCoil = false;
    
    // Each element has its own shape, defined in a square with size 1.
    this.shape = function() {
        
    }

    // Each element may solve itself, defining its output value in function of its inputValue and varValue
    this.solve = function(){
        this.outputValue = 0; // a generic empty element has always a 0 at the output
    }
    
    // Consider that the mouse is over a shape if it is not near its horizontal borders
    this.mouseIsOver = function() {
        if((mouseX >= (this.pos.x+this.hBorder)*colSize) && (mouseX < (this.pos.x+this.sizeX-this.hBorder)*colSize) && (mouseY >= this.pos.y*linSize) && (mouseY < (this.pos.y+this.sizeY)*linSize)){
            return Boolean(true);
        } else {
            return Boolean(false);
        }
    }
    
    // Draws a shape
    this.draw = function() {
        // Colors for different status
        var colorOffline = color(0,0,0);
        var colorSelected = color(0,150,0); // blue
        var colorPreview = color(180,180,180); // light gray
        var colorLow = color(0,0,150); // green
        var colorHigh = color(150,0,0); // red

        push();
        if (this.status == "offline"){
            this.actualColor = (colorOffline); // black
        } else if (this.status == "selected") {
            this.actualColor = (colorSelected); // green
        } else if (this.status == "preview") {
            this.actualColor = (colorPreview); // light gray
        } else if (this.status === "executing") {
            this.actualColor = (this.outputValue==1?colorHigh:colorLow); // red or blue
        }
        strokeWeight(0.03);
        translate(this.pos.x*colSize,this.pos.y*linSize); // Move to the position
        scale(colSize,linSize); // Scale to the actual element size
        // Change color according to the status
        stroke(this.actualColor); // 
        noFill();
        this.shape(); // Draw the shape
        textSize(0.2); 
        noStroke();
        if(this.status === "executing"){
            this.actualColor = this.varValue==1?colorHigh:colorLow;
        }
        fill(this.actualColor); // 
        textAlign(CENTER,BOTTOM);
        text(this.name,0.5,0.2); // the variable name
        pop();
    }

    //json for saving and restoring
    this.json = function(){
        var returnValue;
        if (this.constructor == GElement){
            returnValue = "empty";
        } else if ((this.constructor == HorLine) || (this.constructor == VerLine)){
            returnValue = this.constructor.name;
        } else {
            returnValue = {};
        returnValue['type'] = this.constructor.name;
        returnValue['name'] = this.name;
        }
        return returnValue
    }
}

function HorLine(pos) {
    GElement.call(this,"",pos); // Lines are not associated to variables, so there is no name
    
    this.shape = function() {
        line(0, 0.5, 1.0, 0.5);
    }
    this.solve = function(){
        this.outputValue = this.inputValue; // same output as the input
    }
}

function VerLine(pos) {
    GElement.call(this,"",pos); // Lines are not associated to variables, so there is no name
    
    this.hBorder = 0.3; //A vertical line has a larger border than a normal shape
    
    this.shape = function() {
        line(0.5, 0.0, 0.5, 1.0);
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
    this.solve = function(){
        this.outputValue = this.inputValue && this.varValue; // 
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
    this.solve = function(){
        this.outputValue = this.inputValue && !(this.varValue); // 
    }
}

function ContactRise(name, pos) {
    GElement.call(this,name,pos);
    this.oldVarValue;
    
    this.shape = function() {
        line(0, 0.5, 0.3, 0.5);
        line(0.7, 0.5, 1.0, 0.5);
        line(0.3, 0.2, 0.3, 0.8);
        line(0.7, 0.2, 0.7, 0.8);
        line(0.4, 0.7, 0.5, 0.7);
        line(0.5, 0.7, 0.5, 0.3);
        line(0.5, 0.3, 0.6, 0.3);
    }
    this.solve = function(){
        this.outputValue = this.inputValue && (this.varValue && !this.oldVarValue); //
        this.oldVarValue = this.varValue; 
    }

}

function ContactFall(name, pos) {
    GElement.call(this,name,pos);
    this.oldVarValue;
    
    this.shape = function() {
        line(0, 0.5, 0.3, 0.5);
        line(0.7, 0.5, 1.0, 0.5);
        line(0.3, 0.2, 0.3, 0.8);
        line(0.7, 0.2, 0.7, 0.8);
        line(0.4, 0.3, 0.5, 0.3);
        line(0.5, 0.7, 0.5, 0.3);
        line(0.5, 0.7, 0.6, 0.7);
    }
    this.solve = function(){
        this.outputValue = this.inputValue && (!this.varValue && this.oldVarValue); //
        this.oldVarValue = this.varValue; 
    }
}

function CoilNO(name, pos) {
    GElement.call(this,name,pos);
    
    this.isCoil = true;

    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
    }
    this.solve = function(){
        values[this.name]  = this.inputValue; //
    }
}

function CoilNC(name, pos) {
    GElement.call(this,name,pos);
    
    this.isCoil = true;

    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        line(0.4, 0.7, 0.6, 0.3);
    }
    this.solve = function(){
        values[this.name]  = !this.inputValue; //
    }
}

function CoilSet(name, pos) {
    GElement.call(this,name,pos);
    
    this.isCoil = true;

    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        textAlign(CENTER,CENTER);
        textSize(0.3);
        noStroke();
        fill(this.actualColor);
        text('S',0.5,0.5);
    }
    this.solve = function(){
        if(this.inputValue == 1){
            values[this.name] = 1; //
        }
    }
}

function CoilReset(name, pos) {
    GElement.call(this,name,pos);
    
    this.isCoil = true;

    this.shape = function() {
        line(0, 0.5, 0.25, 0.5);
        line(0.75, 0.5, 1.0, 0.5);
        arc(0.65, 0.5, 0.8, 0.8,PI-QUARTER_PI, PI+QUARTER_PI);
        arc(0.35, 0.5, 0.8, 0.8,TWO_PI-QUARTER_PI, TWO_PI+QUARTER_PI);
        textAlign(CENTER,CENTER);
        textSize(0.3);
        noStroke();
        fill(this.actualColor);
        text('R',0.5,0.5);
    }
    this.solve = function(){
        if(this.inputValue == 1){
            values[this.name]  = 0; //
        }
    }
}

function Eraser(pos) {
    GElement.call(this,"",pos);

    this.shape = function() {
        line(0.25, 0.25, 0.75, 0.75);
        line(0.75, 0.25, 0.25, 0.75);
    }
}

function Hand(pos) {
    GElement.call(this,"",pos);

    this.shape = function() {
        line(0.25, 0.75, 0.5, 0.5);
        line(0.5, 0.5, 0.3, 0.5);
        line(0.5, 0.7, 0.5, 0.5);
    }
}
