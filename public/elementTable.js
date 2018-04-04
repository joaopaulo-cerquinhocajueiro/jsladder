function ElementTable(pos,size) {
    this.pos = pos;
    this.size = size;
    this.grid = true;
    this.table = [];
    this.verTable = [];
    var contacts = ["ContactNO", "ContactNC","ContactRise","ContactFall","HorLine"];
    var coils = ["CoilNO", "CoilNC","CoilSet","CoilReset"];
    this.selectVariable = false;
    this.simulating = false;

    var index = 0;
    for (var l = 0; l < this.size.y ; l++){
        for (var c = 0; c < this.size.x; c++){
            this.table[index++] = new GElement('',createVector(c,l).add(pos));
//            this.table[index++] = new window[random(contacts)]('',createVector(c,l).add(pos));
        }
    }
//    console.log(table);
    index = 0;
    for (var l = 0; l < this.size.y-1 ; l++){
        for (var c = 0; c < this.size.x-1; c++){
            this.verTable[index++] = new GElement('',createVector(c+0.5,l+0.5).add(pos));
        }
    }
    varList = createSelect();
    varList.position(0, 0);
    varList.hide();
    for(var i=0; i< inputs.length; i++){
        varList.option(inputs[i]);        
    }
    for(var i=0; i< outputs.length; i++){
        varList.option(outputs[i]);        
    }
    for(var i=0; i< memories.length; i++){
        varList.option(memories[i]);        
    }
    this.lastVarListPos = createVector(0,0);
//    console.log(verTable);
    varList.mouseOut(function () {
        varListExist = false;
        varList.hide();
    });



    
    this.mouseIsOver = function(){
        return ((mouseX>this.pos.x)&&(mouseX<this.pos.x+this.size.x*colSize)&&(mouseY>this.pos.y+0.5*linSize)&&(mouseY<this.pos.y+this.size.y*linSize));
    }
    
    this.updateGE = function(element) {

    }
    
    this.update = function() {
        if (this.simulating){ // If simulating
            // put all elements as executing
            for (var index=0; index<horz*vert; index++){
                this.table[index].status = "executing";
            }
            for (var index=0; index<(horz-1)*(vert-1); index++){
                this.verTable[index].status = "executing";
            }
            // Reads all values to a dictionary
            values = {};
            for(var i=0; i< inputs.length; i++){
                values[buttonInputs[i].name] = buttonInputs[i].value;        
            }
            for(var i=0; i< memories.length; i++){
                values[dispMemories[i].name] = dispMemories[i].value;        
            }
            for(var i=0; i< outputs.length; i++){
                values[dispOutputs[i].name] = dispOutputs[i].value;        
            }
            // Update all elements
//            console.log(horz);
            for(var x=0;x<horz;x++){ // for each column
                //console.log(x)
                y = 0; //For the first line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    this.table[index].inputValue = 1; // the input Value is 1
                } else if(this.verTable[y*(horz-1)+x-1].constructor.name=="VerLine"){ // if there is a vertical line down
                    this.table[index].inputValue = this.verTable[y*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line
                    this.table[index].inputValue = this.table[index-1].outputValue;
                }
                this.table[index].varValue = values[this.table[index].name];
                this.table[index].solve();
                for(y=1;y<vert-1;y++){ // for the middle lines
                    var index = indexFromXY(x,y);
                    if(x==0){ // if in the beginning of a line
                        this.table[index].inputValue = 1; // the input Value is 1
                    } else if(this.verTable[y*(horz-1)+x-1].constructor.name=="VerLine"){ // if there is a vertical line down
                        this.table[index].inputValue = this.verTable[y*(horz-1)+x-1].outputValue;
                    } else if(this.verTable[(y-1)*(horz-1)+x-1].constructor.name=="VerLine"){ // if there is a line up
                        this.table[index].inputValue = this.verTable[(y-1)*(horz-1)+x-1].outputValue;
                    } else { // if there is no vertical line
                        this.table[index].inputValue = this.table[index-1].outputValue;
                    }
                    this.table[index].varValue = values[this.table[index].name];
                    this.table[index].solve();
                }
//                console.log(x,y,horz);
                y = vert-1; //For the last line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    this.table[index].inputValue = 1; // the input Value is 1
                } else if(this.verTable[(y-1)*(horz-1)+x-1].constructor.name=="VerLine"){ // if there is a vertical line up
                    this.table[index].inputValue = this.verTable[(y-1)*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line
                    this.table[index].inputValue = this.table[index-1].outputValue;
                }
                this.table[index].varValue = values[this.table[index].name];
                this.table[index].solve();
                //Solve the intermediary vertical lines
                if(x<horz-1){ // If it's not the last one
                    y = 0;
                    while(y<vert-1){ // check for each vertical line
                        var index = x+y*(horz-1);
                        var ys = [y];
                        if((y>0)&&(this.verTable[index-horz+1].constructor.name=="VerLine")){
                            // if there is a vertical line up, this value was already calculated
                            this.verTable[index].outputValue = this.verTable[index-horz+1].outputValue;
                        } else if(this.verTable[index].constructor.name=="VerLine"){ // if a line starts here
                            ys.push[y+1];
                            console.log(ys);
                            var newY = y+1;
                            if(newY<vert-1){ // if not at the end of the matrix
                                while(this.verTable[x+newY*(horz-1)].constructor.name=="VerLine"){ // if the line continues
                                    newY++;
                                    ys.push[newY];
                                    if(newY>=vert-1){
                                        break;
                                    }
                                }
                            }
                            var value = 0;
                            ys.forEach(function(thisY){
                                console.log(x,thisY,value,this.table[thisY*horz+x]);
                                value = value + this.table[thisY*horz+x].outputValue;
                                //console.log(x,thisY,value);
                            });
                            this.verTable[index].outputValue = value>0?1:0;
                    
                        }
                        y++;
                    }
                }

            }

            // update the display for variables that may have changed
            for (var index=0; index<horz*vert; index++){
                this.table[index].varValue = values[this.table[index].name];
            }

            // Set new values to memory and outputs
            for(var i=0; i< memories.length; i++){
                dispMemories[i].value = values[dispMemories[i].name];        
            }
            for(var i=0; i< outputs.length; i++){
                dispOutputs[i].value = values[dispOutputs[i].name];        
            }
        } else { // If not simulating,
            // put all elements as offline
            for (var index=0; index<horz*vert; index++){
                this.table[index].status = "offline";
            }
            for (var index=0; index<(horz-1)*(vert-1); index++){
                this.verTable[index].status = "offline";
            }
        }

    }
    
    this.selectGE = function(element) {

    }

    this.clicked = function() {
        if (toolBar.selectedShape == "VerLine" && this.overWhat() == "vertical"){
            var loc = createVector(floor(mouseX/colSize-this.pos.x-0.5),floor(mouseY/linSize-this.pos.y-0.5));
            this.verTable[loc.x+loc.y*(horz-1)] = new VerLine(loc.add(createVector(0.5,0.5)).add(elementTable.pos));
        } else if( contacts.indexOf(toolBar.selectedShape) > -1 && this.overWhat() == "contact" ) {
            var loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x < horz-1) {
                if (toolBar.selectedShape == "HorLine"){
                    elementTable.table[loc.x+loc.y*horz] = new HorLine(loc.add(elementTable.pos));
                } else {
                    elementTable.table[loc.x+loc.y*horz] = new window[toolBar.selectedShape](choose(inputs.concat(outputs).concat(memories)),loc.add(elementTable.pos));
                }
                
            }
        } else if( coils.indexOf(toolBar.selectedShape) > -1 && this.overWhat() == "coil") {
            var loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x == horz-1) {
                elementTable.table[loc.x+loc.y*horz] = new window[toolBar.selectedShape](choose(outputs.concat(memories)),loc.add(elementTable.pos));
            }
        } else if (toolBar.selectedShape == "Eraser") {
            if (this.overWhat() == "vertical") {
                var loc = createVector(floor(mouseX/colSize-this.pos.x-0.5),floor(mouseY/linSize-this.pos.y-0.5));
            this.verTable[loc.x+loc.y*(horz-1)] = new GElement("",loc.add(createVector(0.5,0.5)).add(elementTable.pos));
            } else {
                var loc = createVector(floor(mouseX/colSize-this.pos.x), floor(mouseY/linSize-this.pos.y) );
                elementTable.table[loc.x+loc.y*horz] = new GElement("",loc.add(elementTable.pos));
            }
        } else if(toolBar.selectedShape == "Hand"){
            console.log("varList");
            if(!varListExist){
                varList.position(mouseX-25,mouseY-5);
                varList.show();
                varListExist = true;
                this.lastVarListPos = createVector(mouseX,mouseY);
            }
        }

    }
    
    this.overWhat = function() {
        var outValue = "notHere";
        if (this.mouseIsOver()) {
            if (mouseX/colSize-this.pos.x > horz-1+0.2) { // Se estiver na coluna final + 0.2
                outValue = "coil";                        // então é coil
            } else {
                var inCell = ((mouseX/colSize-this.pos.x)%1.0); // calcula a posição dentro de uma célula
                if (inCell>0.2 && inCell<0.8)                   // se entre 0.2 e 0.8
                    outValue = "contact";                       // então é contato
                else if((mouseY>this.pos.y+0.8*linSize) && (mouseY<this.pos.y+linSize*(this.size.y-0.2)))
                    outValue = "vertical"
            }
        }
        return outValue;
    }

    this.draw = function() {
        this.update();
        // Draw the grid
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
        //draw the power lines
        strokeWeight(3);
        if(this.simulating){
            stroke(150,0,0);
        } else {
            stroke(0);
        }
        line(0,0,0,linSize*this.size.y);
        if(this.simulating){
            stroke(0,0,150);
        } else {
            stroke(0);
        }
        line(colSize*this.size.x,0,colSize*this.size.x,linSize*this.size.y);
        pop();
        
        // Draw the elements over the grid
        for (var index=0; index<horz*vert; index++){
            this.table[index].draw();
        }
        for (var index=0; index<(horz-1)*(vert-1); index++){
            this.verTable[index].draw();
        }
        var overlay = new GElement("",createVector(0,0));
        var whereis = this.overWhat();
        var loc;
        if (toolBar.selectedShape == "VerLine" && whereis == "vertical"){
            loc = createVector(floor(mouseX/colSize-this.pos.x-0.5),floor(mouseY/linSize-this.pos.y-0.5));
            overlay = new VerLine(loc.add(createVector(0.5,0.5)).add(elementTable.pos));
        } else if( contacts.indexOf(toolBar.selectedShape) > -1  && whereis == "contact") {
            loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x < horz-1) {
                if (toolBar.selectedShape == "HorLine"){
                    overlay = new HorLine(loc.add(this.pos));
                } else {
                    overlay = new window[toolBar.selectedShape]("I0",loc.add(this.pos));
                }
            }
        } else if( coils.indexOf(toolBar.selectedShape) > -1 && whereis == "coil" ) {
            loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
            if (loc.x == horz-1) {
                overlay = new window[toolBar.selectedShape]("I0",loc.add(this.pos));
            }
        } else if (toolBar.selectedShape == "Eraser" && whereis != "notHere"){
            if (whereis == "vertical") {
                loc = createVector(floor(mouseX/colSize-this.pos.x-0.5),floor(mouseY/linSize-this.pos.y-0.5));
                overlay = new Eraser(loc.add(createVector(0.5,0.5)).add(this.pos));
            } else {
                loc = createVector(floor(mouseX/colSize-this.pos.x),floor(mouseY/linSize-this.pos.y));
                overlay = new Eraser(loc.add(this.pos));
            }
        }
        overlay.status = "preview";
        overlay.draw();
        //text(this.lastVarListPos,this.pos.x+colSize*horz/2,this.pos.y+linSize*vert+10);
    }

    this.eraseAll = function() {
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
        
    }

    this.json = function(){
        var tableJSON = [];
        var verTableJSON = [];
        index=0;
        for (var l = 0; l < this.size.y ; l++){
            tableJSON[l] = [];
            for (var c = 0; c < this.size.x; c++){
//                tableJSON[l][c] = this.table[index++].constructor.name;
                tableJSON[l][c] = this.table[index++].json();
            }
        }
    //    console.log(table);
        index = 0;
        for (var l = 0; l < this.size.y-1 ; l++){
            verTableJSON[l] = [];
            for (var c = 0; c < this.size.x-1; c++){
//                verTableJSON[index] = this.verTable[index++].constructor.name;
                verTableJSON[l][c] = this.verTable[index++].json();
}
        }
//        return JSON.stringify({table:this.table,verTable:this.verTable});
        return JSON.stringify({"horizontal":tableJSON,"vertical":verTableJSON},null,2);
    }

    this.writeJson = function(codeObject){
        var horTableRead = codeObject.horizontal;
        var verTableRead = codeObject.vertical;
        var index = 0;  
        for (var i=0;i<verTableRead.length;i++){
            for (var j=0;j<verTableRead[i].length;j++){
//                console.log(verTableRead[i][j]);
                if(verTableRead[i][j]=='VerLine'){
                    this.verTable[index++] = new VerLine(createVector(j+0.5,i+0.5).add(this.pos));
                    
                } else {
                    this.verTable[index++] = new GElement('',createVector(j+0.5,i+0.5).add(this.pos));                
                }
            }
        }
        index = 0;  
        for (var i=0;i<horTableRead.length;i++){
            for (var j=0;j<horTableRead[i].length;j++){
//                console.log(verTableRead[i][j]);
                if(horTableRead[i][j]=='HorLine'){
                    this.table[index++] = new HorLine(createVector(j,i).add(this.pos));
                    
                } else if(horTableRead[i][j]== 'empty'){
                    this.table[index++] = new GElement('',createVector(j,i).add(this.pos));                
                } else{
                    this.table[index++] = new window[horTableRead[i][j].type](horTableRead[i][j].name,createVector(j,i).add(this.pos));
                }
            }
          }
    
    }
}