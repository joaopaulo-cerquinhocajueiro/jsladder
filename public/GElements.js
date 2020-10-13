// Object that represents the graphical elements of a ladder program

function GElement(name, type, posX, posY, svg) {
    this.name = name;
    this.posX  = posX;
    this.posY  = posY;
    this.type = type;
    this.toolTip = "off" ;
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

    // Each element may solve itself, defining its output value in function of its inputValue and varValue
    switch (String(this.type)){
        case "ContactRise":
        case "ContactFall":
        case "CoilUp":
        case "CoilDn":
            this.oldVarValue;
            break;
        case "ContactTON":
        case "ContactTP":
            this.oldInputValue;
            this.isCounting = false;
            this.timeLength = 0.0; // goes form 0 to 1
            this.intervalId;
            break;
        case "ContactTOF":
            this.oldInputValue;
            this.isCounting = false;
            this.timeLength = 1.0; // goes form 0 to 1
            this.intervalId;
            break;
        case "ContactDN":
            this.sp=-1;
            break;
    }
    this.solve = function(){
        // console.log("Solving",this.type)
        switch (String(this.type)){
            case "HorLine":
                this.outputValue = this.inputValue; // same output as the input
            break;
            case "ContactNO":
                this.outputValue = this.inputValue && this.varValue; // 
            break;
            case "ContactNC":
                this.outputValue = this.inputValue && !(this.varValue); // 
            break;
            case "ContactRise":
                this.outputValue = this.inputValue && (this.varValue && !this.oldVarValue); //
                this.oldVarValue = this.varValue; 
            break;
            case "ContactFall":
                this.outputValue = this.inputValue && (!this.varValue && this.oldVarValue); //
                this.oldVarValue = this.varValue; 
            break;
        // update the timers completion bar
            case "ContactTON":
                if( this.inputValue &&  !this.oldInputValue){
                    this.isCounting = true;
                    var that = this;
                    this.intervalId = setInterval(function(){
                        //console.log("triggered Again!",that.timeLength, that.isCounting);
                        that.timeLength += 0.05;
                        if(that.timeLength >= 1.0){
                            that.isCounting = false;
                            that.timeLength = 0.0;
                            clearInterval(that.intervalId);
                            that.update();
                        }
                        that.completionBar.attr('x2',30+that.timeLength*(70-30));
                    }, that.name*50);
                }
                if(this.isCounting) {
                    if(this.inputValue == 0){
                        this.isCounting = false;
                        this.timeLength = 0,0;
                        clearInterval(this.intervalId);
                        that.update();
                        console.log(that.name);
                        this.outputValue = this.inputValue;
                    } else {
                        this.outputValue = 0;
                    }
                } else {
                    this.outputValue = this.inputValue;
                }
                this.oldInputValue = this.inputValue; 
                break;
            case "ContactTOF":
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
                        that.completionBar.attr('x1',30+that.timeLength*(70-30));
                    },this.name*50);
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
                break;

            case "ContactTP":
                if( this.inputValue &&  !this.oldInputValue && !this.isCounting){
                    this.isCounting = true;
                    var that = this;
                    this.intervalId = setInterval(function(){
                        //console.log("triggered Again!",that.timeLength, that.isCounting);
                        that.timeLength += 0.05;
                        if(that.timeLength >= 1.0){
                            that.isCounting = false;
                            that.timeLength = 0;
                            clearInterval(that.intervalId);
                            console.log('End counting')
                            //that.completionBar.attr('x2',30+that.timeLength*(70-30));
                        }
                        that.completionBar.attr('x2',30+that.timeLength*(70-30));
                    },this.name*50);
                }
                if(this.isCounting) {
                    this.outputValue = 1;
                } else {
                    this.outputValue = 0;
                }
                this.oldInputValue = this.inputValue; 
            break;

            case "Contact0":
                if(this.inputValue && this.varValue==0){
                    this.outputValue = 1;
                } else {
                    this.outputValue = 0;
                }
            break;

            case "ContactDone":
                if(this.inputValue && this.varValue==this.sp){
                    this.outputValue = 1;
                } else {
                    this.outputValue = 0;
                }
            break;
            
            case "CoilNO":
                this.outputValue  = this.inputValue;
                globalValues[this.name]  = this.inputValue; //
            break;
            
            case "CoilNC":
                this.outputValue  = this.inputValue;
                globalValues[this.name]  = !this.inputValue; //
            break;
            
            case "CoilSet":
                if(this.inputValue == 1){
                    globalValues[this.name] = 1; //
                }
                this.outputValue = this.inputValue;
            break;
            
            case "CoilReset":
                if(this.inputValue == 1){
                    globalValues[this.name]  = 0; //
                }
                this.outputValue = this.inputValue;
            break;

            case "CoilUp":
                this.outputValue = this.inputValue && !this.oldVarValue; //
                this.oldVarValue = this.inputValue;
                if(this.outputValue){
                    globalValues[this.name]++;
                }
                break;

            case "CoilDn":
                this.outputValue = this.inputValue && !this.oldVarValue; //
                this.oldVarValue = this.inputValue;
                if(this.outputValue){
                    globalValues[this.name]--;
                }
                break;

            case "CoilTSet":
                this.outputValue  = this.inputValue;
                if(this.outputValue){
                    globalValues[this.name] = setPoints[this.name]; //
                }
                break;

            case "CoilTReset":
                this.outputValue  = this.inputValue;
                if(this.outputValue){
                    globalValues[this.name] = 0; //
                }
                break;

        }
    }

    // Each element has its own shape, defined in a square with size 100.
    this.shape = this.svg.group();
    this.draw = function(){
        switch (String(this.type)){
            case "ContactRise":
            case "ContactFall":
                this.oldVarValue;
                break;
            case "ContactTON":
            case "ContactTP":
                this.oldInputValue;
                this.isCounting = false;
                this.timeLength = 0.0; // goes form 0 to 1
                this.intervalId;
                break;
            case "ContactTOF":
                this.oldInputValue;
                this.isCounting = false;
                this.timeLength = 1.0; // goes form 0 to 1
                this.intervalId;
                break;
        }

        if(this.type == "VerLine"){
            this.box=this.shape.rect(20,60).addClass("element").fill({opacity:0.0, color:"#880000"}).move(40,20);
        } else {
            this.box=this.shape.rect(80,60).addClass("element").fill({opacity:0.0, color:"#880000"}).move(10,20);
        }
        switch (String(this.type)){
            case "HorLine":
            this.shape.line(0, 50, 100, 50).addClass("input").addClass("output").addClass("line");
            break;

            case "VerLine":
            this.shape.line(50, 00, 50, 100).addClass("input").addClass("output").addClass("line");
            break;
            
            case "Eraser":
                this.shape.line(25, 25, 75, 75).addClass("line");
                this.shape.line(75, 25, 25, 75).addClass("line");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Eraser",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "Hand":
                this.shape.line(25, 75, 50, 50).addClass("line");
                this.shape.line(50, 50, 30, 50).addClass("line");
                this.shape.line(50, 70, 50, 50).addClass("line");
                //TooTip;
                this.shape.rect(150, 16).fill('#9CFFA0').addClass('toolTip').move(-25,70);
                this.shape.text("Choose the Variable",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "DrawLine":
                this.shape.line(30,80, 50,70).addClass("line");
                this.shape.line(50,70,100,20).addClass("line");
                this.shape.line(30,80, 40,60).addClass("line");
                this.shape.line(40,60, 90,10).addClass("line");
                this.shape.line(90,10,100,20).addClass("line");
                this.shape.line(50,70, 40,60).addClass("line");
                this.shape.line(00,80, 30,80).addClass("line");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Draw Wire",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactNO":
                this.shape.line( 0, 50,  30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20,  30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20,  70, 80).addClass("line").addClass("output");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Contact NO",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactNC":
                this.shape.line(0, 50, 30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20, 30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20, 70, 80).addClass("line").addClass("output");
                this.shape.line(35, 75, 65, 25).addClass("line").addClass("output");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Contact NC",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactRise":
                this.shape.line(0, 50, 30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20, 30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20, 70, 80).addClass("line").addClass("output");
                this.shape.line(40, 70, 50, 70).addClass("line").addClass("output");
                this.shape.line(50, 70, 50, 30).addClass("line").addClass("output");
                this.shape.line(50, 30, 60, 30).addClass("line").addClass("output");
                //TooTip;
                this.shape.rect(150, 16).fill('#9CFFA0').addClass('toolTip').move(-25,70);
                this.shape.text("Contact Rising Edge",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "ContactFall":
                this.shape.line(0, 50, 30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20, 30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20, 70, 80).addClass("line").addClass("output");
                this.shape.line(40, 30, 50, 30).addClass("line").addClass("output");
                this.shape.line(50, 70, 50, 30).addClass("line").addClass("output");
                this.shape.line(50, 70, 60, 70).addClass("line").addClass("output");
                //TooTip;
                this.shape.rect(150, 16).fill('#9CFFA0').addClass('toolTip').move(-25,70);
                this.shape.text("Contact Falling Edge",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactTON":
                //completion bar
                this.completionBar = this.shape.line(30,50,30+this.timeLength*(70-30),50).addClass("input").addClass("line");
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
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Timer TON",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactTOF":
                //completion bar
                this.completionBar = this.shape.line(30+this.timeLength*(70-30),50,70,50).addClass("output").addClass("line");
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
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Timer TOFF",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "ContactTP":
                //completion bar
                this.completionBar = this.shape.line(30,50,30+this.timeLength*(70-30),50).addClass("output").addClass("line");
                //contact
                this.shape.line(0, 50, 30, 50).addClass("input").addClass("line");
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
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Timer TP",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "Contact0":
                this.shape.line(0, 50, 30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20, 30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20, 70, 80).addClass("line").addClass("output");
                // this.shape.line(40, 30, 50, 30).addClass("line").addClass("output");
                // this.shape.line(50, 70, 50, 30).addClass("line").addClass("output");
                // this.shape.line(50, 70, 60, 70).addClass("line").addClass("output");
                this.shape.text('Z',50,50).font({
                    family:   'Helvetica'
                , size:     30
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Counter Z",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "ContactDone":
                this.shape.line(0, 50, 30, 50).addClass("line").addClass("input");
                this.shape.line(70, 50, 100, 50).addClass("line").addClass("output");
                this.shape.line(30, 20, 30, 80).addClass("line").addClass("input");
                this.shape.line(70, 20, 70, 80).addClass("line").addClass("output");
                // this.shape.line(40, 30, 50, 30).addClass("line").addClass("output");
                // this.shape.line(40, 30, 50, 30).addClass("line").addClass("output");
                // this.shape.line(50, 70, 50, 30).addClass("line").addClass("output");
                // this.shape.line(50, 70, 60, 70).addClass("line").addClass("output");
                this.shape.text('DN',50,50).font({
                    family:   'Helvetica'
                , size:     25
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Counter Done",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "CoilNO":
                this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Coil NO",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "CoilNC":
                this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");
                this.shape.line(40, 70, 60, 30).addClass("input").addClass("line");
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Coil NC",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "CoilSet":
                this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
                this.shape.text('S',50,50).font({
                    family:   'Helvetica'
                , size:     30
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Coil Set",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "CoilReset":
                this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
                this.shape.text('R').font({
                    family:   'Helvetica'
                , size:     30
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Coil Reset",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "CoilUp":
                this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");
                //internal
                this.shape.line(60, 40, 50, 40).addClass("output").addClass("line");
                this.shape.line(50, 40, 50, 60).addClass("output").addClass("line");
                this.shape.line(50, 60, 40, 60).addClass("output").addClass("line");
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(150, 16).fill('#9CFFA0').addClass('toolTip').move(0-25,70);
                this.shape.text("Increase Counter",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "CoilDn":
                this.shape.line(0, 50, 25, 50).addClass("output").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("output").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("output").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("output").addClass("line");
                //internal
                this.shape.line(60, 60, 50, 60).addClass("output").addClass("line");
                this.shape.line(50, 40, 50, 60).addClass("output").addClass("line");
                this.shape.line(50, 40, 40, 40).addClass("output").addClass("line");
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(150, 16).fill('#9CFFA0').addClass('toolTip').move(-25,70);
                this.shape.text("Decrease Counter",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;

            case "CoilTSet":
                this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
                this.shape.text('S',50,50).font({
                    family:   'Helvetica'
                , size:     30
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Counter Set",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
            
            case "CoilTReset":
                this.shape.line(0, 50, 25, 50).addClass("input").addClass("line");
                this.shape.line(75, 50, 100, 50).addClass("input").addClass("line");
                this.shape.path('M 40 20 C 20 25, 20 75, 40 80').addClass("input").addClass("line");
                this.shape.path('M 60 20 C 80 25, 80 75, 60 80').addClass("input").addClass("line");
                this.shape.text('R').font({
                    family:   'Helvetica'
                , size:     30
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,35);
                this.shape.text('cnt',50,25).font({
                    family:   'Helvetica'
                , size:     17
                , anchor:   'middle'
                }).addClass("input").addClass("text").move(50,60);
                //TooTip;
                this.shape.rect(100, 16).fill('#9CFFA0').addClass('toolTip').move(0,70);
                this.shape.text("Counter Reset",50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(50,70);
            break;
        }
        // this.shape.line(35, 15, 35, 35).addClass("output");
        this.label = this.shape.text(this.name).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        }).stroke({width:0}).move(50,-10).addClass("variable").addClass("text");
        // this.shape.stroke({ width: 2, color: '#0f0f0f'});
        //this.shape.scale(1/50);
        this.shape.move(this.posX, this.posY);
        this.shape.select(".toolTip").hide();
    }    
    this.draw();
    
    
    // // Consider that the mouse is over a shape if it is not near its horizontal borders
    // this.mouseIsOver = function() {
    //     if((mouseX >= (this.pos.x+this.hBorder)*colSize) && (mouseX < (this.pos.x+this.sizeX-this.hBorder)*colSize) && (mouseY >= this.pos.y*linSize) && (mouseY < (this.pos.y+this.sizeY)*linSize)){
    //         return Boolean(true);
    //     } else {
    //         return Boolean(false);
    //     }
    // }
    
    // Updates a shape
    this.update = function() {
        // Colors for different status
        // console.log(this.status);
        var colorOffline  = "#000000"; // black
        var colorSelected = "#00aa00"; // green
        var colorPreview  = "#cccccc"; // light gray
        var colorLow      = "#0000aa"; // blue
        var colorHigh     = "#aa0000"; // red

        if (this.status == "offline"){
            this.shape.select("line,path,circle").stroke(colorOffline);
            this.shape.select("text").fill(colorOffline);
        } 
        else if (this.status == "selected") {
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


        if(this.toolTip == "on"){
            this.shape.select(".toolTip").show();
        }
        else if(this.toolTip == "off"){
            this.shape.select(".toolTip").hide();
        }

        this.label.text(this.name);
    }

    

    this.toolTip =  function(opacityTip){    
        var tip = svg.group();
        tip.rect(100, 16).fill('#0ff').addClass('tooloTip').move(this.posX,this.posY+50);
        tip.text(this.type,50,50).font({family:   'Arial', size:     14, anchor:   'middle'}).addClass('toolTip').move(this.posX+50,this.posY+ 50);
        tip.opacity(0.5);
    }

    this.hide = function(){
        this.shape.hide();
    }

    this.show = function(){
        this.shape.show();
    }
    //json for saving and restoring
    this.json = function(){
        var returnValue;
        if (this.type == "Empty"){
            returnValue = "Empty";
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

