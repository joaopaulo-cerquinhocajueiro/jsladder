function ElementTable(pos,size) {
    this.pos = pos;
    this.size = size;
    this.grid = true;
    this.table = [];
    this.verTable = [];
    var index = 0;
    for (var l = 0; l < this.size.y ; l++){
        for (var c = 0; c < this.size.x; c++){
            this.table[index++] = new GElement('',createVector(c,l).add(pos));
        }
    }
//    console.log(table);
    index = 0;
    for (var l = 0; l < this.size.y-1 ; l++){
        for (var c = 0; c < this.size.x-1; c++){
            this.verTable[index++] = new GElement('',createVector(c+0.5,l+0.5).add(pos));
        }
    }
//    console.log(verTable);

    this.mouseIsOver = function(){
        return ((mouseX>this.pos.x)&&(mouseX<this.pos.x+this.size.x*colSize)&&(mouseY>this.pos.y)&&(mouseY<this.pos.y+this.size.y*linSize));
    }
    
    this.updateGE = function(element) {

    }
    
    this.update = function() {

    }
    
    this.selectGE = function(element) {

    }

    this.clicked = function() {
        var contacts = ["ContactNO", "ContactNC","ContactRise","ContactFall","HorLine"];
        var coils = ["CoilNO", "CoilNC","CoilSet","CoilReset"];
        if (toolBar.selectedShape == "VerLine"){
            var loc = createVector(floor(mouseX/colSize-this.pos.x-0.5),floor(mouseY/linSize-this.pos.y-0.5));
            this.verTable[loc.x+loc.y*(horz-1)] = new VerLine(loc.add(createVector(0.5,0.5)).add(elementTable.pos));
        } else if( contacts.indexOf(toolBar.selectedShape) > -1 ) {
            var loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x < horz-1) {
                if (toolBar.selectedShape == "HorLine"){
                    elementTable.table[loc.x+loc.y*horz] = new HorLine(loc.add(elementTable.pos));
                } else {
                    elementTable.table[loc.x+loc.y*horz] = new window[toolBar.selectedShape]("I0",loc.add(elementTable.pos));
                }
                
            }
        } else if( coils.indexOf(toolBar.selectedShape) > -1 ) {
            var loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x == horz-1) {
                elementTable.table[loc.x+loc.y*horz] = new window[toolBar.selectedShape]("I0",loc.add(elementTable.pos));
            }
        }

    }

    this.draw = function() {
        push();
        noFill();
        stroke(235,235,190);
        strokeWeight(1);
        translate(this.pos.x*colSize,this.pos.y*linSize); // Move to the position

        for (var i = 1; i < this.size.x; i++) {
            line(colSize*i,linSize/2,colSize*i,linSize*(this.size.y-0.5));
        }
        for (var i = 0; i <= this.size.y-1; i++) {
            line(0,linSize*(i+0.5),colSize*this.size.x,linSize*(i+0.5));
        }
        stroke(0);
        strokeWeight(3);
        line(0,0,0,linSize*this.size.y);
        line(colSize*this.size.x,0,colSize*this.size.x,linSize*this.size.y);
        pop();
        for (var index=0; index<horz*vert; index++){
            this.table[index].draw();
        }
        for (var index=0; index<(horz-1)*(vert-1); index++){
            this.verTable[index].draw();
        }
    }

}
