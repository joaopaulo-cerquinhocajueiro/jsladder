// Object that represents the graphical elements of a ladder program

function GElement(name, posX, posY, svg) {
    this.name = name;
    this.posX  = posX;
    this.posY  = posY;
    this.type = "empty";
    this.svg = svg
    // The status of a graphical element may be "offline", "selected", "preview" or "executing"
    this.status = "offline";
    // When "executing", there is the input value before the element and the value of the variable, which defines the value in the output
    this.inputValue;
    this.varValue = 2;
    this.outputValue;
    // How many squares the shape occupies
    //this.sizeX = 1;
    //this.sizeY = 1;
    // The non selectable border, necessary to select vertical lines 
    this.hBorder = 20;
    // If the shape is a coil
    this.isCoil = false;

    // Each element has its own shape, defined in a square with size 100.
    this.shape = this.svg.group();
    this.shape.rect(100,100).fill({opacity:0.0});
    // this.shape.line(0, 25, 15, 25).addClass("input");
    // this.shape.line(35, 25, 50, 25).addClass("output");
    // this.shape.line(15, 15, 15, 35).addClass("output");
    // this.shape.line(35, 15, 35, 35).addClass("output");
    // this.shape.text(this.name).move(25,0).font({anchor: 'middle'}).stroke({width:0}).addClass("variable");
    // this.shape.stroke({ width: 2, color: '#0f0f0f'});
    //this.shape.scale(1/50);
    this.shape.move(this.posX, this.posY);
    
    
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
    
    // Updates a shape
    this.update = function() {
        // Colors for different status
        console.log(this.status);
        var colorOffline  = "#000000"; // black
        var colorSelected = "#00aa00"; // green
        var colorPreview  = "#cccccc"; // light gray
        var colorLow      = "#0000aa"; // blue
        var colorHigh     = "#aa0000"; // red

        if (this.status == "offline"){
            this.shape.select("line,path,circle").stroke(colorOffline);
            this.shape.select("text").fill(colorOffline);
        } else if (this.status == "selected") {
            this.shape.select("line,path,circle").stroke(colorSelected);
            this.shape.select("text").fill(colorSelected);
        } else if (this.status == "preview") {
            this.shape.select("line,path,circle").stroke(colorPreview);
            this.shape.select("text").fill(colorPreview);
        } else if (this.status === "executing") {
            this.shape.select("line.input").stroke(this.inputValue==1?colorHigh:colorLow);
            this.shape.select("path.input").stroke(this.inputValue==1?colorHigh:colorLow);
            this.shape.select("circle.input").stroke(this.inputValue==1?colorHigh:colorLow);
            this.shape.select("line.output").stroke(this.outputValue==1?colorHigh:colorLow);
            this.shape.select("path.output").stroke(this.outputValue==1?colorHigh:colorLow);
            this.shape.select("circle.output").stroke(this.outputValue==1?colorHigh:colorLow);
            this.shape.select("text.variable").fill(this.varValue==1?colorHigh:colorLow);
            this.shape.select("line.variable").stroke(this.outputValue==1?colorHigh:colorLow);
        }
    }

    //json for saving and restoring
    this.json = function(){
        var returnValue;
        if (this.type == "empty"){
            returnValue = "empty";
        } else if ((this.type == "HorLine") || (this.type == "VerLine")){
            returnValue = this.type;
        } else {
            returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        }
        return returnValue
    }
}

function HorLine(posX,posY,svg) {
    GElement.call(this, "", posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "HorLine";

    this.shape.line(0, 25, 50, 25).addClass("input").addClass("output").addClass("line");

    this.solve = function(){
        this.outputValue = this.inputValue; // same output as the input
    }
}

function VerLine(posX,posY,svg) {
    GElement.call(this, "", posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "VerLine";

    this.hBorder = 0.3; //A vertical line has a larger border than a normal shape
    
    this.shape.line(25, 00, 25, 50).addClass("input").addClass("output").addClass("line");
}

function DrawLine(posX,posY,svg) {
    GElement.call(this, "", posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "DrawLine";

    this.shape.line(30,80, 50,70).addClass("line");
    this.shape.line(50,70,100,20).addClass("line");
    this.shape.line(30,80, 40,60).addClass("line");
    this.shape.line(40,60, 90,10).addClass("line");
    this.shape.line(90,10,100,20).addClass("line");
    this.shape.line(50,70, 40,60).addClass("line");
    this.shape.line(00,80, 30,80).addClass("line");
}

function ContactNO(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactNO";

    this.shape.line( 0, 50,  30, 50).addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("line");
    this.shape.line(30, 20,  30, 80).addClass("line");
    this.shape.line(70, 20,  70, 80).addClass("line");

    this.solve = function(){
        this.outputValue = this.inputValue && this.varValue; // 
    }
}

function ContactNC(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactNC";
    
    this.shape.line(0, 50, 30, 50).addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("line");
    this.shape.line(30, 20, 30, 80).addClass("line");
    this.shape.line(70, 20, 70, 80).addClass("line");
    this.shape.line(35, 75, 65, 25).addClass("line");

    this.solve = function(){
        this.outputValue = this.inputValue && !(this.varValue); // 
    }
}

function ContactRise(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactRise"
    this.oldVarValue;
    
    this.shape.line(0, 50, 30, 50).addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("line");
    this.shape.line(30, 20, 30, 80).addClass("line");
    this.shape.line(70, 20, 70, 80).addClass("line");
    this.shape.line(40, 70, 50, 70).addClass("line");
    this.shape.line(50, 70, 50, 30).addClass("line");
    this.shape.line(50, 30, 60, 30).addClass("line");
    
    this.solve = function(){
        this.outputValue = this.inputValue && (this.varValue && !this.oldVarValue); //
        this.oldVarValue = this.varValue; 
    }

}

function ContactFall(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactFall"
    this.oldVarValue;
    
    this.shape.line(0, 50, 30, 50).addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("line");
    this.shape.line(30, 20, 30, 80).addClass("line");
    this.shape.line(70, 20, 70, 80).addClass("line");
    this.shape.line(40, 30, 50, 30).addClass("line");
    this.shape.line(50, 70, 50, 30).addClass("line");
    this.shape.line(50, 70, 60, 70).addClass("line");
    
    this.solve = function(){
        this.outputValue = this.inputValue && (!this.varValue && this.oldVarValue); //
        this.oldVarValue = this.varValue; 
    }
}

function ContactTON(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactTON"
    this.oldInputValue;
    this.isCounting = false;
    this.timeLength = 0.0; // goes form 0 to 1
    this.intervalId;
    
        //completion bar
        this.shape.line(30,50,30+this.timeLength*(70-30),50).addClass("input");
        //contact
        this.shape.line(0, 50, 30, 50).addClass("input").addClass("line");
        this.shape.line(70, 50, 100, 50).addClass("output").addClass("line");
        this.shape.line(30, 20, 30, 80).addClass("input").addClass("line");
        this.shape.line(70, 20, 70, 80).addClass("output").addClass("line");
        //internal
        this.shape.line(40, 75, 50, 75).addClass("input").addClass("line");
        this.shape.line(50, 75, 50, 55).addClass("input").addClass("line");
        this.shape.line(50, 55, 60, 55).addClass("input").addClass("line");
        //clock
        this.shape.circle(20).move(40,20).addClass("input").addClass("line");
        this.shape.line(50,30,50,20).addClass("input").addClass("line");
        this.shape.line(50,30,60,30).addClass("input").addClass("line");
//        this.shape.move(this.posX, this.posY);
   
    this.solve = function(){
        if( this.inputValue &&  !this.oldInputValue){
            this.isCounting = true;
            //console.log("triggered!",this.isCounting);
            var that = this;
            this.intervalId = setInterval(function(){
                //console.log("triggered Again!",that.timeLength, that.isCounting);
                that.timeLength += 0.05;
                if(that.timeLength >= 1.0){
                    that.isCounting = false;
                    that.timeLength = 0.0;
                    clearInterval(that.intervalId);
                }
            }, this.name*100/50);
        }
        if(this.isCounting) {
            if(this.inputValue == 0){
                this.isCounting = false;
                this.timeLength = 0,0;
                clearInterval(this.intervalId);
                this.outputValue = this.inputValue;
            } else {
                this.outputValue = 0;
            }
        } else {
            this.outputValue = this.inputValue;
        }
        this.oldInputValue = this.inputValue; 
        //console.log(d.getTime());
    }

}

function ContactTOF(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactTOF"
    this.oldInputValue;
    this.isCounting = false;
    this.timeLength = 1.0; // goes form 0 to 1
    this.intervalId;
     
    //completion bar
    this.shape.line(30+this.timeLength*(70-30),50,70,50).addClass("output");
    //contact
    this.shape.line(0, 50, 30, 50).addClass("input").addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("output").addClass("line");
    this.shape.line(30, 20, 30, 80).addClass("input").addClass("line");
    this.shape.line(70, 20, 70, 80).addClass("output").addClass("line");
    //internal
    this.shape.line(60, 75, 50, 75).addClass("output").addClass("line");
    this.shape.line(50, 75, 50, 55).addClass("output").addClass("line");
    this.shape.line(50, 55, 40, 55).addClass("output").addClass("line");
    //clock
    this.shape.circle(20).move(40,20).addClass("output").addClass("line");
    this.shape.line(50,30,50,20).addClass("output").addClass("line");
    this.shape.line(50,30,60,30).addClass("output").addClass("line");

    this.solve = function(){
        if( !this.inputValue &&  this.oldInputValue){
            this.isCounting = true;
            this.timeLength = 0;
            //console.log("triggered!",this.isCounting);
            var that = this;
            this.intervalId = setInterval(function(){
                //console.log("triggered Again!",that.timeLength, that.isCounting);
                that.timeLength += 0.05;
                if(that.timeLength >= 1.0){
                    that.isCounting = false;
                    that.timeLength = 1.0;
                    clearInterval(that.intervalId);
                }
            },this.name*100/50);
        }
        if(this.isCounting) {
            if(this.inputValue == 1){
                this.isCounting = false;
                this.timeLength = 1,0;
                clearInterval(this.intervalId);   
                this.outputValue = this.inputValue;
            } else {
                this.outputValue = 1;
            }
        } else {
            this.outputValue = this.inputValue;
        }
        this.oldInputValue = this.inputValue; 
        //console.log(d.getTime());
    }

}

function ContactTP(name, posX,posY,svg) {
    GElement.call(this, name, posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "ContactTP"
    this.oldInputValue;
    this.isCounting = false;
    this.timeLength = 0.0; // goes from 0 to 1
    this.intervalId;
    
    //completion bar
    this.shape.line(30,50,30+this.timeLength*(70-30),50).addClass("output");
    //contact
    this.shape.line(0, 50, 30, 50).addClass("intput").addClass("line");
    this.shape.line(70, 50, 100, 50).addClass("output").addClass("line");
    this.shape.line(30, 20, 30, 80).addClass("input").addClass("line");
    this.shape.line(70, 20, 70, 80).addClass("output").addClass("line");
    //internal
    this.shape.line(35, 75, 45, 75).addClass("output").addClass("line");
    this.shape.line(55, 75, 65, 75).addClass("output").addClass("line");
    this.shape.line(45, 75, 45, 55).addClass("output").addClass("line");
    this.shape.line(55, 75, 55, 55).addClass("output").addClass("line");
    this.shape.line(45, 55, 55, 55).addClass("output").addClass("line");
    //clock
    this.shape.circle(20).move(40,20).addClass("output").addClass("line");
    this.shape.line(50,30,50,20).addClass("output").addClass("line");
    this.shape.line(50,30,60,30).addClass("output").addClass("line");
 
    this.solve = function(){
        if( this.inputValue &&  !this.oldInputValue && !this.isCounting){
            this.isCounting = true;
            //console.log("triggered!",this.isCounting);
            var that = this;
            this.intervalId = setInterval(function(){
                //console.log("triggered Again!",that.timeLength, that.isCounting);
                that.timeLength += 0.05;
                if(that.timeLength >= 1.0){
                    that.isCounting = false;
                    that.timeLength = 0;
                    clearInterval(that.intervalId);
                }
            },this.name*100/50);
        }
        if(this.isCounting) {
            this.outputValue = 1;
        } else {
            this.outputValue = 0;
        }
        this.oldInputValue = this.inputValue; 
        //console.log(d.getTime());
    }
    
}

function CoilNO(name, posX, posY, svg) {
    GElement.call(this, name, posX, posY, svg);
    this.type="CoilNO"
    this.isCoil = true;

    this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
    this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
    this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
    this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");

    this.solve = function(){
        this.outputValue  = this.inputValue;
        values[this.name]  = this.inputValue; //
    }
}

function CoilNC(name, posX, posY, svg) {
    GElement.call(this, name, posX, posY, svg);
    this.type="CoilNC"
    
    this.isCoil = true;

    this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
    this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
    this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
    this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");
    this.shape.line(40, 70, 60, 30).addClass("input").addClass("line");

    this.solve = function(){
        this.outputValue  = this.inputValue;
        values[this.name]  = !this.inputValue; //
    }
}

function CoilSet(name, posX, posY, svg) {
    GElement.call(this, name, posX, posY, svg);
    this.type="CoilSet"

    this.isCoil = true;

    this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
    this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
    this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
    this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
    this.shape.text('S',50,50).font({
        family:   'Helvetica'
      , size:     30
      , anchor:   'middle'
      }).addClass("input").addClass("text").move(50,35);;
    
    this.solve = function(){
        if(this.inputValue == 1){
            values[this.name] = 1; //
        }
        this.outputValue = this.inputValue;
    }
}

function CoilReset(name, posX, posY, svg) {
    GElement.call(this, name, posX, posY, svg);
    this.type="CoilReset"

    this.isCoil = true;

    this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
    this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
    this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
    this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
    this.shape.text('R').font({
        family:   'Helvetica'
      , size:     30
      , anchor:   'middle'
      }).addClass("input").addClass("text").move(50,35);

    this.solve = function(){
        if(this.inputValue == 1){
            values[this.name]  = 0; //
        }
        this.outputValue = this.inputValue;
    }
}

function Eraser(posX,posY,svg) {
    GElement.call(this, "", posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "Eraser"

    this.shape.line(25, 25, 75, 75).addClass("line");
    this.shape.line(75, 25, 25, 75).addClass("line");
}

function Hand(posX,posY,svg) {
    GElement.call(this, "", posX, posY, svg); // Lines are not associated to variables, so there is no name
    this.type = "Hand"

    this.shape.line(25, 75, 50, 50).addClass("line");
    this.shape.line(50, 50, 30, 50).addClass("line");
    this.shape.line(50, 70, 50, 50).addClass("line");
}
