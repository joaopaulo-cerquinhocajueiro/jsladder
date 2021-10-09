"use strict";
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
    this.counterCoils = ["CoilUp", "CoilDn", "CoilTSet", "CoilTReset"];
    this.counterContacts = ["Contact0", "ContactDone"];
    this.compContact = "ContactComp";
    this.visible = false;

    this.clickFunction = function(element, newType, table, index){
        // var posX = element.posX;
        // var posY = element.posY;
        // var name = element.name;
        if(!simulating){
            element.shape.clear();
            element.type = newType;
            element.draw();
            element.toolTip = "off";
            element.update();
        }
    }
    this.selectVariable = false;
    this.simulating = false;
    this.selectionLoc;

    for (var i = 1; i < this.horSize; i++) {
        this.svg.line(100*i,50,100*i,100*(this.verSize-0.5)).stroke('darkGray');
        this.svg.text(i.toString()).addClass('tableText').move(100*(i-0.5),-20);
    }
    this.svg.text(this.horSize.toString()).addClass('tableText').move(100*(this.horSize-0.5),-20);
    for (var i = 0; i <= this.verSize-1; i++) {
        this.svg.line(0,100*(i+0.5),100*this.horSize,100*(i+0.5)).stroke('darkGray');
        this.svg.text(String.fromCharCode(i+65)).addClass('tableText').move(-25,100*(i+0.4));
    }

    this.coilArea = this.svg.rect(100,100*this.verSize).fill({opacity:0.2,color:'magenta'}).radius(10).move(100*(this.horSize-1),0);

    this.phaseLine = this.svg.line(0,0,0,this.verSize*100).stroke({width:10,color:'black'});
    this.groundLine = this.svg.line(this.horSize*100,0,this.horSize*100,this.verSize*100).stroke({width:10,color:'black'});
     
    var index = 0;
    for (var l = 0; l < this.verSize-1 ; l++){
        for (var c = 0; c < this.horSize-1; c++){
            this.verTable[index] = new GElement("", 'Empty', c*100+50, l*100+50, this.svg);
            this.verTable[index++].update();
        }
    }
    index = 0;
    for (var l = 0; l < this.verSize ; l++){
        for (var c = 0; c < this.horSize; c++){
            this.table[index] = new GElement(" ", 'Empty', c*100, l*100, this.svg);
            this.table[index++].update();
        }
    }


    // Create the HTML elements to change the names and/or values of the elements
    this.timerDelaySelector = document.createElement('input');
    document.body.appendChild(this.timerDelaySelector);
    this.timerDelaySelector.setAttribute('type', 'number');
    this.timerDelaySelector.setAttribute('value', 3.0);
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

    this.counterSelector = document.createElement('select');
    document.body.appendChild(this.counterSelector);
    this.counterSelector.id = 'counterSelector';
    this.counterSelector.className += 'selector';

    this.compSelector = document.createElement('div');
    document.body.appendChild(this.compSelector);
    this.compSelector.id = "compSelector";
    this.compSelector.className += "divSelector"
    
    this.leftSelector = document.createElement('select');
    this.compSelector.appendChild(this.leftSelector);
    this.leftSelector.id = 'leftSelector';
    this.leftSelector.className += 'inSelector';

    this.opSelector = document.createElement('select');
    this.compSelector.appendChild(this.opSelector);
    this.opSelector.id = 'opSelector';
    this.opSelector.className += 'inSelector';
    let compOptions = [">","<",">=","<=","==","!="];
    for(let i=0; i<6;i++){
        var option = document.createElement("option");
        option.value = option.text = compOptions[i];
        this.opSelector.add(option);
    }

    this.rightSelector = document.createElement('input');
    this.rightSelector.setAttribute('type', 'number');
    this.rightSelector.setAttribute('value', 10);
    this.compSelector.appendChild(this.rightSelector);
    this.rightSelector.id = 'rightSelector';
    this.rightSelector.className += 'inSelector';

    //Populate the lists
    var that = this;
    this.ioElements.forEach(element =>{
        if(element.type == 'input'|| element.type == 'output' || element.type == 'memory'){
            var option = document.createElement("option");
            option.value = option.text = element.name;
            that.contactSelector.add(option);
            if (element.type !='input'){
                var option = document.createElement("option");
                option.value = option.text = element.name;
                that.coilSelector.add(option);
            }    
        } else if(element.type == 'counter'){
            var option = document.createElement("option");
            option.value = option.text = element.name;
            that.counterSelector.add(option);
            var op2 = document.createElement("option");
            op2.value = op2.text = element.name;
            that.leftSelector.add(op2);
        } else if(element.type == "analogInput"){
            var op2 = document.createElement("option");
            op2.value = op2.text = element.name;
            that.leftSelector.add(op2);
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
    var changeComp = function(e){
        generalElement.name = that.leftSelector.value;
        generalElement.left = that.leftSelector.value;
        generalElement.op = that.opSelector.value;
        generalElement.right = that.rightSelector.value;
        generalElement.update();
        // console.log(e);
        e.target.style.display = 'none';
    }

    var that = this;
    ['change','mouseout'].forEach(function(evt){
        that.contactSelector.addEventListener(evt, changeLabel);
        that.coilSelector.addEventListener(evt, changeLabel);
        that.counterSelector.addEventListener(evt, changeLabel);
        that.timerDelaySelector.addEventListener(evt, changeLabel);
    });
    this.compSelector.addEventListener('mouseleave',changeComp);

    this.setLabel = function(element,generalType){
        generalElement = element;
        //console.log(element.shape.rbox().x,element.shape.rbox().y);
        var x = element.shape.rbox().x;
        var y = element.shape.rbox().y;
        var w = element.shape.rbox().w;
        var sel;
        switch(generalType){
            case "contact": element.label.tspan(that.contactSelector.value);
                sel = that.contactSelector ;
            break;
            case "timer": element.label.tspan('1.0');
                sel = that.timerDelaySelector ;
            break;
            case "coil": element.label.tspan(that.coilSelector.value);
                sel = that.coilSelector;
            break;
            case "counterCoil":
            case "counterContact": element.label.tspan(that.counterSelector.value);
                sel = that.counterSelector;
            break;
            case "compContact":
                sel = that.compSelector;
                element.left = that.leftSelector.value;
                element.label.tspan(element.left);
                element.op = that.opSelector.value;
                element.right = that.rightSelector.value;
            break;
        }
        sel.style.left = x;
        sel.style.top = y;
        sel.style.width = w;
        sel.style.display = 'block';
        sel.focus();
        if(generalType=="compContact"){
            for(let i = 0; i<sel.childElementCount;i++){
                sel.children[i].style.display = 'block';
            }
        }
            
    }
    this.selectContact = function(){ //Function when selects the variable of a contact
        var item = varList.value();
        //console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    this.selectCoil = function(){ //Function when selects the variable of a coil
        var item = coilList.value();
        //console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    this.selectTime = function(){ //Function when selects the time of a timer
        var item = parseInt(timeInput.value());
        if (item < 0)
            item = 0;
        if (item > 1000)
            item = 1000;
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    this.selectCounter = function(){ //Function when selects the variable of a counter
        var item = counterList.value();
        console.log(item)
        elementTable.table[selectionLoc.x+selectionLoc.y*horz].name = item;
    }
    // Creates the dropdown list of variables for a contact
    var that = this;
    this.setGUI = function(){
    this.table.forEach(function(element,index,origTable){
        element.update();
        if((index+1)%that.horSize == 0){ //if on the last column

            element.shape.mouseout(function(e){
                if(!simulating){
                    if(toolBar.selectedShape.type == 'Eraser' ||
                    toolBar.selectedShape.type == 'Hand' || 
                    that.counterCoils.indexOf(toolBar.selectedShape.type) > -1 ||
                    that.coils.indexOf(toolBar.selectedShape.type) > -1){
                            element.box.attr('fill-opacity',0.0);
                    }
                }
            });

            element.shape.mouseover(function(e){
                if(!simulating){
                    if(toolBar.selectedShape.type == 'Eraser' ||
                    toolBar.selectedShape.type == 'Hand' || 
                    that.counterCoils.indexOf(toolBar.selectedShape.type) > -1 ||
                    that.coils.indexOf(toolBar.selectedShape.type) > -1){
                            element.box.attr('fill-opacity',0.2);
                    }
                }
            });

            element.shape.mousedown(function(){
                if(!simulating){
                    // If using the eraser
                    if(toolBar.selectedShape.type == "Eraser"){
                        element.name = "";
                        that.clickFunction(element,"Empty",origTable,index); // add an empty element
                    } else if(toolBar.selectedShape.type == "Hand"){ // If using the Hand
                        if(that.coils.indexOf(element.type) > -1){ // If the clicked element is a coil
                            that.setLabel(element,"coil");
                        } else if(that.counterCoils.indexOf(element.type) > -1){ // If the clicked element is a coil
                            that.setLabel(element,"counterCoil");
                        }
                    } else if(that.coils.indexOf(toolBar.selectedShape.type) > -1){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"coil");
                    } else if(that.counterCoils.indexOf(toolBar.selectedShape.type) > -1){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"counterCoil");
                    }
                }
            });    
        } else {
            element.shape.mousedown(function(){
                if(!simulating){
                    if(toolBar.selectedShape.type == "Eraser"){
                        element.name = "";
                        that.clickFunction(element,"Empty",origTable,index);
                    } else if(toolBar.selectedShape.type == "Hand"){ // If using the Hand
                        if(that.contacts.indexOf(element.type) > -1){ // If the clicked element is a coil
                            that.setLabel(element,"contact");
                        } else if(that.counterContacts.indexOf(element.type) > -1){ // If the clicked element is a coil
                            that.setLabel(element,"counterContact");
                        } else if(that.timers.indexOf(element.type) > -1){ // If the clicked element is a coil
                            that.setLabel(element,"timer");
                        } else if(toolBar.selectedShape.type == that.compContact){ // If the clicked element is a coil
                        that.setLabel(element,"compContact");
                        }
                    } else if(toolBar.selectedShape.type == 'DrawLine'){
                        element.name = "";
                        that.clickFunction(element,'HorLine',origTable,index);
                    } else if(that.contacts.indexOf(toolBar.selectedShape.type) > -1){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"contact");
                    } else if(that.timers.indexOf(toolBar.selectedShape.type) > -1){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"timer");
                    } else if(that.counterContacts.indexOf(toolBar.selectedShape.type) > -1){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"counterContact");
                    } else if(toolBar.selectedShape.type == that.compContact){
                        that.clickFunction(element,toolBar.selectedShape.type,origTable,index);
                        that.setLabel(element,"compContact");
                    }
                }
            });

            element.shape.mouseout(function(e){
                if(!simulating){
                    if(toolBar.selectedShape.type == 'DrawLine' ||
                    toolBar.selectedShape.type == 'Eraser' ||
                    toolBar.selectedShape.type == 'Hand' || 
                    that.counterContacts.indexOf(toolBar.selectedShape.type) > -1 ||
                    that.timers.indexOf(toolBar.selectedShape.type) > -1 || 
                    that.contacts.indexOf(toolBar.selectedShape.type) > -1){
                            element.box.attr('fill-opacity',0.0);
                    }
                }
            });

            element.shape.mouseover(function(e){
                if(!simulating){
                    if(toolBar.selectedShape.type == 'DrawLine' || 
                    toolBar.selectedShape.type == 'Eraser' ||
                    toolBar.selectedShape.type == 'Hand' || 
                    that.counterContacts.indexOf(toolBar.selectedShape.type) > -1 || 
                    that.timers.indexOf(toolBar.selectedShape.type) > -1 || 
                    that.contacts.indexOf(toolBar.selectedShape.type) > -1){
                            element.box.attr('fill-opacity',0.2);
                    }
                    // Determina se tem um botão do mouse apertado e se sim, qual é
                    var whichButton = e.buttons === undefined? e.which : e.buttons;
                    // Se for o botão 1 (esquerdo)
                    if (whichButton == 1){
                        // Se estiver com a ferramenta de desenhar, continua o traço
                        if(toolBar.selectedShape.type == 'DrawLine'){
                            element.name = "";
                            that.clickFunction(element,'HorLine',origTable,index);
                        // Se estiver com a ferramenta de apagar, continua apagando
                        } else if(toolBar.selectedShape.type == "Eraser"){
                            element.name = "";
                            that.clickFunction(element,"Empty",origTable,index);
                        }
                    } else {

                    }
                }
            });
        }
    });

    this.verTable.forEach(function(element,index,origTable){
        element.update();
        //var that = this;
        element.shape.mouseout(function(e){
            if(!simulating){
                if(toolBar.selectedShape.type == 'DrawLine' ||
                toolBar.selectedShape.type == 'Eraser'){
                        element.box.attr('fill-opacity',0.0);
                }
            }
        });

        element.shape.mouseover(function(e){
            if(!simulating){
                if(toolBar.selectedShape.type == 'DrawLine' || 
                toolBar.selectedShape.type == 'Eraser'){
                        element.box.attr('fill-opacity',0.2);
                }
            }
        });

        element.shape.mousedown(function(){
            if(!simulating){
                //that.clickFunction(element,"HorLine",origTable,index)
                if(toolBar.selectedShape.type == 'DrawLine'){
                    that.clickFunction(element,'VerLine',origTable,index)
                } else if(toolBar.selectedShape.type == 'Eraser'){
                    that.clickFunction(element,'Empty',origTable,index)
                }
            }
        });

        element.shape.mouseover(function(e){
            if(!simulating){
                var whichButton = e.buttons === undefined? e.which : e.buttons;
                if (whichButton == 1){
                    if(toolBar.selectedShape.type == 'DrawLine'){
                        that.clickFunction(element,'VerLine',origTable,index);
                    } else if(toolBar.selectedShape.type == "Eraser"){
                        that.clickFunction(element,"Empty",origTable,index);
                    }
                }
            }
        });
    });

    }
    this.setGUI();

    
    
    this.update = function() {
        if (that.simulating){ // If simulating
            that.phaseLine.stroke('red');
            that.groundLine.stroke('blue');
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

            // TODO This should be executed only by the last table
            that.ioElements.forEach(element =>{
                globalValues[element.name] = element.value;
            });
            that.ioElements.forEach(element =>{
                if(element.type == 'counter'){
                    setPoints[element.name] = element.setPoint;
                }
            });
            // console.log(setPoints);

            // Update all elements
//            console.log(horz);
            for(var x=0;x<horz;x++){ // for each column
                //console.log(x)
                var y = 0; //For the first line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    that.table[index].inputValue = 1; // the input Value is 1
                } else if(that.verTable[y*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line down, get the value from the vertical line
                    that.table[index].inputValue = that.verTable[y*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line, get the value from the previous element
                    that.table[index].inputValue = that.table[index-1].outputValue;
                }
                // Update the variable value
                that.table[index].varValue = globalValues[that.table[index].name];
                // if is a counter contact, has to get also the setPoint
                if(that.counterContacts.indexOf(that.table[index].type)>-1){
                    that.table[index].sp = setPoints[that.table[index].name];
                }
                // and call solve on the element
                that.table[index].solve();
                for(y=1;y<vert-1;y++){ // for the middle lines
                    var index = indexFromXY(x,y);
                    if(x==0){ // if in the beginning of a line
                        that.table[index].inputValue = 1; // the input Value is 1
                    } else if(that.verTable[y*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line down, get the value from the vertical line
                        that.table[index].inputValue = that.verTable[y*(horz-1)+x-1].outputValue;
                    } else if(that.verTable[(y-1)*(horz-1)+x-1].type=="VerLine"){ // if there is a line up, get the value from the vertical line
                        that.table[index].inputValue = that.verTable[(y-1)*(horz-1)+x-1].outputValue;
                    } else { // if there is no vertical line, get the value from the previous element
                        that.table[index].inputValue = that.table[index-1].outputValue;
                    }
                    that.table[index].varValue = globalValues[that.table[index].name];
                    // if is a counter contact, has to get also the setPoint
                    if(that.counterContacts.indexOf(that.table[index].type)>-1){
                        that.table[index].sp = setPoints[that.table[index].name];
                    }
                    // and call solve on the element
                    that.table[index].solve();
                }
                var y = vert-1; //For the last line
                var index = indexFromXY(x,y);
                if(x==0){ // if in the beginning of a line
                    that.table[index].inputValue = 1; // the input Value is 1
                } else if(that.verTable[(y-1)*(horz-1)+x-1].type=="VerLine"){ // if there is a vertical line up
                    that.table[index].inputValue = that.verTable[(y-1)*(horz-1)+x-1].outputValue;
                } else { // if there is no vertical line
                    that.table[index].inputValue = that.table[index-1].outputValue;
                }
                that.table[index].varValue = globalValues[that.table[index].name];
                // if is a counter contact, has to get also the setPoint
                if(that.counterContacts.indexOf(that.table[index].type)>-1){
                    that.table[index].sp = setPoints[that.table[index].name];
                }
                // and call solve on the element
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
                            // for all y's that have a vertical line, above or below
                            for(var i = 0; i<ys.length;i++){
                                // if the element before is "empty", there is no outputValue
                                if(!(that.table[ys[i]*horz+x].outputValue === undefined)){
                                    value = value + that.table[ys[i]*horz+x].outputValue;
                                }
                            }
                            // if at least one outputValue is 1:
                            that.verTable[index].outputValue = value>0?1:0;
                    
                        }
                        y++;
                    }
                }

            }

            // update the display for variables that may have changed
            that.ioElements.forEach(element =>{
                if(element.type != 'input'){
                    element.value = globalValues[element.name];
                    // console.log("updated "+element.name + ": "+element.value);
                    element.update();
                }
            });
            
        } else { // If not simulating,
            that.phaseLine.stroke('black');
            that.groundLine.stroke('black');
            // put all elements as offline
            for (var index=0; index<horz*vert; index++){
                // If it is a timer, return to zero
                if(that.timers.indexOf(that.table[index].type)>-1){
                    that.table[index].oldInputValue = 0;
                    that.table[index].isCounting = false;
                    that.table[index].timeLength = that.table[index].type=='ContactTOF'?1.0:0.0; // goes form 0 to 1
                }
                that.table[index].status = "offline";
                that.table[index].update();
            }
            for (var index=0; index<(horz-1)*(vert-1); index++){
                that.verTable[index].status = "offline";
                that.verTable[index].update();
            }
            //clearInterval(that.intervalId)
        }

    }
    
    //console.log("Got to the simulation part")
    var that = this;
    this.intervalId = window.setInterval(this.update,20);


    this.eraseAll = function() {
        var index = 0;
        for (var l = 0; l < this.verSize ; l++){
            for (var c = 0; c < this.horSize; c++){
                that.table[index].name=" ";
                that.clickFunction(that.table[index], "Empty", that.table, index++);
            }
        }
    //    console.log(table);
        index = 0;
        for (var l = 0; l < this.verSize-1 ; l++){
            for (var c = 0; c < this.horSize-1; c++){
                that.clickFunction(that.verTable[index], "Empty", that.table, index++);
            }
    }
        
    }

    this.jsonTable = function(){
        var tableJSON = [];
        var verTableJSON = [];
        index=0;
        for (var l = 0; l < this.verSize ; l++){
            tableJSON[l] = [];
            for (var c = 0; c < this.horSize; c++){
                tableJSON[l][c] = this.table[index++].json();
            }
        }
        index = 0;
        for (var l = 0; l < this.verSize-1 ; l++){
            verTableJSON[l] = [];
            for (var c = 0; c < this.horSize-1; c++){
                verTableJSON[l][c] = this.verTable[index++].json();
            }
        }
        return JSON.stringify({"horizontal":tableJSON,"vertical":verTableJSON,"horSize":this.horSize,"verSize":this.verSize},null,2);
    }

    this.jsonVar = function(){
        var varJSON = [];
        this.ioElements.forEach(element =>{
            varJSON.push(element.json());
        });
        return JSON.stringify(varJSON,null,2);
    }


    this.writeJson = function(codeObject){
        var horTableRead = codeObject.horizontal;
        var verTableRead = codeObject.vertical;
        var index = 0;  
        for (var i=0;i<verTableRead.length;i++){
            for (var j=0;j<verTableRead[i].length;j++){
                //console.log(i,j,verTableRead[i][j]);
                // console.log(this.verTable);
                this.verTable[index].shape.clear();
                this.verTable[index] = new GElement(' ', verTableRead[i][j], 100*j+50, 100*i+50, this.svg);
                this.verTable[index++].update();
            }
        }
        index = 0;  
        for (var i=0;i<horTableRead.length;i++){
            for (var j=0;j<horTableRead[i].length;j++){
                this.table[index].shape.clear();
                if(horTableRead[i][j]=='HorLine' || horTableRead[i][j]=='Empty'){
                    this.table[index++] = new GElement(' ',horTableRead[i][j],100*j,100*i,this.svg);
                } else if(horTableRead[i][j].name=='ContactComp') {

                } else {
                    this.table[index] = new GElement(horTableRead[i][j].name,horTableRead[i][j].type,100*j,100*i,this.svg);
                    this.table[index].op = horTableRead[i][j].op;
                    this.table[index++].right = horTableRead[i][j].right;
                }
            }
        }
        this.setGUI();
    
    }

    this.hide = function(){
        this.table.forEach(element =>{
            element.hide();
        });
        this.verTable.forEach(element =>{
            element.hide();
        });
        this.coilArea.hide();
    }

    this.show = function(){
        this.table.forEach(element =>{
            element.show();
        });
        this.verTable.forEach(element =>{
            element.show();
        });
        this.coilArea.show();
    }
}