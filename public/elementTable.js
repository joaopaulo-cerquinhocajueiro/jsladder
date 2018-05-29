function ElementTable(svg,horz,vert,ioElements) {
    this.svg = svg;
    this.horSize = horz;
    this.verSize = vert;
    this.ioElements = ioElements;
    this.grid = true;
    this.table = [];
    this.verTable = [];
    this.contacts = ["ContactNO", "ContactNC","ContactRise","ContactFall","HorLine"];
    this.coils = ["CoilNO", "CoilNC","CoilSet","CoilReset"];
    this.timers = ["ContactTON","ContactTOF","ContactTP"];
    
    this.clickFunction = function(element, newType, table, index){
        var posX = element.posX;
        var posY = element.posY;
        var name = element.name;
        element.shape.clear();
        element.type = newType;
        element.draw();
        element.update();
    }
    this.selectVariable = false;
    this.simulating = false;
    this.selectionLoc;

    for (var i = 1; i < this.horSize; i++) {
        this.svg.line(100*i,50,100*i,100*(this.verSize-0.5)).stroke('darkGray');
    }
    for (var i = 0; i <= this.verSize-1; i++) {
        this.svg.line(0,100*(i+0.5),100*this.horSize,100*(i+0.5)).stroke('darkGray');
    }

    this.svg.line(0,0,0,this.verSize*100).addClass('line').addClass('input').stroke('red')
    this.svg.line(this.horSize*100,0,this.horSize*100,this.verSize*100).addClass('line').stroke('blue')
     
    index = 0;
    for (var l = 0; l < this.verSize-1 ; l++){
        for (var c = 0; c < this.horSize-1; c++){
            this.verTable[index] = new GElement("", 'Empty', c*100+50, l*100+50, this.svg);
            this.verTable[index++].update();
        }
    }
    var index = 0;
    for (var l = 0; l < this.verSize ; l++){
        for (var c = 0; c < this.horSize; c++){
            this.table[index] = new GElement(" ", 'Empty', c*100, l*100, this.svg);
//            this.table[index++] = new window[random(contacts)]('',createVector(c,l).add(pos));
            this.table[index++].update();
        }
    }
//    console.log(table);
    this.timerDelaySelector = document.createElement('input');
    document.body.appendChild(this.timerDelaySelector);
    this.timerDelaySelector.setAttribute('type', 'number');
    this.timerDelaySelector.setAttribute('value', 30);
    this.timerDelaySelector.id='timerDelay';
    this.timerDelaySelector.className += 'selector';

    this.contactSelector = document.createElement('select');
    document.body.appendChild(this.contactSelector);
    this.contactSelector.id = 'contactSelector';
    this.contactSelector.className += 'selector';
    
    this.coilSelector = document.createElement('select');
    document.body.appendChild(this.coilSelector);
    this.coilSelector.id = 'coilSelector';
    this.coilSelector.className += 'selector';

    //Populate the lists
    var that = this;
    this.ioElements.forEach(element =>{
        var option = document.createElement("option");
        option.value = option.text = element.name;
        that.contactSelector.add(option);
        if (element.type !='input'){
            var option = document.createElement("option");
            option.value = option.text = element.name;
            that.coilSelector.add(option);
        }
    });

    var generalElement;
    var changeLabel = function(e){
        generalElement.name = e.target.value;
        generalElement.update();
        //this.timerDelaySelector.style.display = 'none';
        e.target.style.display = 'none';
    }

    var that = this;
    ['change','mouseout'].forEach(function(evt){
        that.contactSelector.addEventListener(evt, changeLabel);
        that.coilSelector.addEventListener(evt, changeLabel);
        that.timerDelaySelector.addEventListener(evt, changeLabel);
    });

    this.setLabel = function(element,generalType){
        generalElement = element;
        //console.log(element.shape.rbox().x,element.shape.rbox().y);
        var x = element.shape.rbox().x;
        var y = element.shape.rbox().y;
        var w = element.shape.rbox().w;
        switch(generalType){
            case "contact": element.label.text(that.contactSelector.value);
                sel = that.contactSelector ;
            break;
            case "timer": element.label.text('30');
                sel = that.timerDelaySelector ;
            break;
            case "coil": element.label.text('c');
                sel = that.coilSelector;
            break;
        }
        sel.style.left = x;
        sel.style.top = y;
        sel.style.width = w;
        sel.style.display = 'block';
        sel.focus();
            
    }
    this.selectContact = function(){ //Function when selects the variable of a contact
        var item = varList.value();
        console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    this.selectCoil = function(){ //Function when selects the variable of a coil
        var item = coilList.value();
        console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    this.selectTime = function(){ //Function when selects the time of a timer
        var item = parseInt(timeInput.value());
        if (item < 0)
            item = 0;
        if (item > 1000)
            item = 1000;
        console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    // Creates the dropdown list of variables for a contact
    //console.log(this)
    var that = this;
    this.table.forEach(function(element,index,origTable){
        element.update();
        if((index+1)%that.horSize == 0){ //if on the last column
            element.shape.mousedown(function(){
                console.log("Last column")
                if(toolBar.selectedShape.type == "Eraser"){
                    element.name = "";
                    that.clickFunction(element,"Empty",origTable,index);
                } else if(that.coils.indexOf(toolBar.selectedShape.type) > -1){
                    that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                    that.setLabel(element,"coil");
                }
            });    
        } else {
            element.shape.mousedown(function(){
                //console.log("Not last column")
                if(toolBar.selectedShape.type == "Eraser"){
                    element.name = "";
                    that.clickFunction(element,"Empty",origTable,index);
                } else if(toolBar.selectedShape.type == 'DrawLine'){
                    element.name = "";
                    that.clickFunction(element,'HorLine',origTable,index);
                } else if(that.contacts.indexOf(toolBar.selectedShape.type) > -1){
                    that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                    that.setLabel(element,"contact");
                } else if(that.timers.indexOf(toolBar.selectedShape.type) > -1){
                    that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                    that.setLabel(element,"timer");
                }
            });
            element.shape.mouseover(function(e){
                var whichButton = e.buttons === undefined? e.which : e.buttons;
                if (whichButton == 1){
                    if(toolBar.selectedShape.type == 'DrawLine'){
                        element.name = "";
                        that.clickFunction(element,'HorLine',origTable,index);
                    } else if(toolBar.selectedShape.type == "Eraser"){
                        element.name = "";
                        that.clickFunction(element,"Empty",origTable,index);
                    }
                }
            });
        }
    });

    this.verTable.forEach(function(element,index,origTable){
        element.update();
        //var that = this;
        element.shape.mousedown(function(){
            //that.clickFunction(element,"HorLine",origTable,index)
            if(toolBar.selectedShape.type == 'DrawLine'){
                that.clickFunction(element,'VerLine',origTable,index)
            } else if(toolBar.selectedShape.type == 'Eraser'){
                that.clickFunction(element,'Empty',origTable,index)
            }
        });
        element.shape.mouseover(function(e){
            var whichButton = e.buttons === undefined? e.which : e.buttons;
            if (whichButton == 1){
                if(toolBar.selectedShape.type == 'DrawLine'){
                    that.clickFunction(element,'VerLine',origTable,index);
                } else if(toolBar.selectedShape.type == "Eraser"){
                    that.clickFunction(element,"Empty",origTable,index);
                }
            }
        });
    });
    
    
    this.update = function() {
        if (that.simulating){ // If simulating
            // console.log("simulating");
            // put all elements as executing
            for (var index=0; index<horz*vert; index++){
                that.table[index].status = "executing";
                that.table[index].update();
            }
            for (var index=0; index<(horz-1)*(vert-1); index++){
                that.verTable[index].status = "executing";
                that.verTable[index].update();
            }
            // Reads all values to a dictionary
            values = {};
            that.ioElements.forEach(element =>{
                values[element.name] = element.value;
            });
            // Update all elements
//            console.log(horz);
            for(var x=0;x<horz;x++){ // for each column
                //console.log(x)
                var y = 0; //For the first line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    // console.log(x,y,index,that.table[index].inputValue)
                    that.table[index].inputValue = 1; // the input Value is 1
                } else if(that.verTable[y*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line down
                    that.table[index].inputValue = that.verTable[y*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line
                    that.table[index].inputValue = that.table[index-1].outputValue;
                }
                that.table[index].varValue = values[that.table[index].name];
                // console.log("Calling solve")
                that.table[index].solve();
                for(y=1;y<vert-1;y++){ // for the middle lines
                    var index = indexFromXY(x,y);
                    if(x==0){ // if in the beginning of a line
                        // console.log(x,y,index,that.table[index].inputValue)
                        that.table[index].inputValue = 1; // the input Value is 1
                    } else if(that.verTable[y*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line down
                        that.table[index].inputValue = that.verTable[y*(horz-1)+x-1].outputValue;
                    } else if(that.verTable[(y-1)*(horz-1)+x-1].type=="VerLine"){ // if there is a line up
                        that.table[index].inputValue = that.verTable[(y-1)*(horz-1)+x-1].outputValue;
                    } else { // if there is no vertical line
                        that.table[index].inputValue = that.table[index-1].outputValue;
                    }
                    that.table[index].varValue = values[that.table[index].name];
                    // console.log("Calling solve",that.table[index].type,x,y)
                    that.table[index].solve();
                }
//                console.log(x,y,horz);
                y = vert-1; //For the last line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    that.table[index].inputValue = 1; // the input Value is 1
                } else if(that.verTable[(y-1)*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line up
                    that.table[index].inputValue = that.verTable[(y-1)*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line
                    that.table[index].inputValue = that.table[index-1].outputValue;
                }
                that.table[index].varValue = values[that.table[index].name];
                // console.log("Calling solve",that.table[index].type,x,y)
                that.table[index].solve();
                //Solve the intermediary vertical lines
                if(x<horz-1){ // If it's not the last one
                    y = 0;
                    var ys = [];
                    while(y<vert-1){ // check for each vertical line
                        var index = x+y*(horz-1);
                        ys = [y];
                        if((y>0)&&(that.verTable[index-horz+1].type=="VerLine")){
                            // if there is a vertical line up, this value was already calculated
                            that.verTable[index].outputValue = that.verTable[index-horz+1].outputValue;
                        } else if(that.verTable[index].type=="VerLine"){ // if a line starts here
                            //console.log(ys,y+1);
                            ys.push(y+1);
                            //console.log(ys);
                            var newY = y+1;
                            if(newY<vert-1){ // if not at the end of the matrix
                                while(that.verTable[x+newY*(horz-1)].type=="VerLine"){ // if the line continues
                                    newY++;
                                    ys.push(newY);
                                    if(newY>=vert-1){
                                        break;
                                    }
                                }
                            }
                            var value = 0;
                            for(var i = 0; i<ys.length;i++){
                                //console.log(x,ys[i],value,that.table[ys[i]*horz+x]);
                                value = value + that.table[ys[i]*horz+x].outputValue;
                            }
                            that.verTable[index].outputValue = value>0?1:0;
                    
                        }
                        y++;
                    }
                }

            }

            // update the display for variables that may have changed
            that.ioElements.forEach(element =>{
                if(element.type != 'input'){
                    element.value = values[element.name];
                    element.update();
                }
            });
            
        } else { // If not simulating,
            //console.log("not simulating");
            //console.log(that)
            // put all elements as offline
            for (var index=0; index<horz*vert; index++){
                that.table[index].status = "offline";
                that.table[index].update();
            }
            for (var index=0; index<(horz-1)*(vert-1); index++){
                that.verTable[index].status = "offline";
                that.table[index].update();
            }
            //clearInterval(that.intervalId)
        }

    }
    
    //console.log("Got to the simulation part")
    var that = this;
    this.intervalId = window.setInterval(this.update,10);


    this.eraseAll = function() {
        var index = 0;
        for (var l = 0; l < this.size.y ; l++){
            for (var c = 0; c < this.size.x; c++){
                clickFunction(that.table[index], "Empty", that.table, index++);
            }
        }
    //    console.log(table);
        index = 0;
        for (var l = 0; l < this.size.y-1 ; l++){
            for (var c = 0; c < this.size.x-1; c++){
                clickFunction(that.verTable[index], "Empty", that.table, index++);
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