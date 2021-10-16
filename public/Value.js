// Object that represents a numerical memory element - analog inputs and counters

function Value(name,posX,posY,type,svg,sp=5){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.svg = svg;
    this.value = 0;
    if(this.type=='counter'){
        this.setPoint = sp;
    }
    this.shape = this.svg.group();
    this.toggle = null;

    this.draw = function(){
        // let name,setpoint;
        // console.log(this.name);
        if(typeof this.name!='string'){
            this.setPoint = this.name[1];
            this.name = this.name[0];
        }
        if(this.type=="counter"){
            this.drawCounter();
        } else if(this.type="analogInput"){
            this.drawAnalogI();
        }
        this.label = this.shape.text(this.name).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("variable").addClass("text").move(25,-18);
        // Controle do renomear o elemento
        this.label.dblclick(event =>{
            var boundingRect = event.target.getBoundingClientRect();
            sel = document.createElement('input');
            document.body.appendChild(sel);
            sel.setAttribute('type', 'text');
            // console.log(event);
            sel.setAttribute('value', event.target.innerHTML);
            sel.id='setPoint';
            sel.className += 'selector';
            sel.style.left = boundingRect.x + boundingRect.width/2 - 25 ;
            sel.style.top = boundingRect.y;
            sel.style.width = 50;
            sel.style.display = 'block';
            sel.focus();        // that.setPoint = 0;
            sel.addEventListener("mouseout",event =>{
                if(isNewName(elementTable.ioElements,event.target.value)){
                    changeElementName(that.name,event.target.value);
                    that.name = event.target.value;
                    // console.log(that)
                    that.update();
                //this.timerDelaySelector.style.display = 'none';
                    // event.target.style.display = 'none';    
                }
                event.target.parentNode.removeChild(event.target);            });
        });
        // that.valDisp.move(25,-28);
        // that.spDisp.move(25,-8);
        // that.label.move(25,-45);
        this.shape.move(this.posX, this.posY);
        that.update();
    }

    var that = this;
    this.drawCounter = function(){
        //console.log(this);
        
        //Value
        this.valGroup = this.shape.group();
        this.valBox = this.valGroup.rect(50,20).radius(2).fill('white').stroke('black');
        this.valGroup.text("V").font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text").move(55,3);
        this.valDisp = this.valGroup.text(that.value.toString()).font({
            family:   'Lucida'
            , size:     15
            , anchor:   'middle'
        }).stroke({width:0}).addClass("text").move(25,3);
        this.valGroup.move(0,0);

        //Setpoint
        this.spGroup = this.shape.group();
        this.spBox = this.spGroup.rect(50,20).radius(2).fill('white').stroke('black').move(0,0);
        this.spGroup.text("S").font({
            family:   'Lucida'
            , size:     15
            , anchor:   'middle'
            }).stroke({width:0}).addClass("text").move(55,3);
            // console.log(this);
        this.spDisp = this.spGroup.text(this.setPoint.toString()).font({
            family:   'Lucida'
            , size:     15
            , anchor:   'middle'
        }).stroke({width:0}).addClass("text").move(25,3);
        this.spGroup.move(0,20);
        

        that.spGroup.click(that.updateValue);
        //that.valBox.click(that.updateValue);
        
    }

    this.drawAnalogI = function(){
        //console.log(this);
        
        //Value
        this.valGroup = this.shape.group();
        this.valBox = this.valGroup.rect(100,20).radius(2).fill('white').stroke('black');
        this.value = 50;
        this.valRect = this.valGroup.rect(this.value,20).radius(2).fill('red');
        this.valDisp = this.shape.text(this.value.toString()).font({
            family:   'Lucida'
            , size:     15
            , anchor:   'middle'
        }).stroke({width:0}).addClass("text").move(110,3);
        this.valGroup.move(0,0);
        that = this;
        this.valGroup.click(function(e){
            that.value = parseInt((e.x-this.rbox().x)*100/this.rbox().w);
            that.update();
        });
    }

    this.updateValue = function(){
        var boundingRect = this.node.getBoundingClientRect();
        sel = document.createElement('input');
        document.body.appendChild(sel);
        sel.setAttribute('type', 'number');
        sel.setAttribute('value', that.setPoint);
        sel.id='setPoint';
        sel.className += 'selector';
        sel.style.left = boundingRect.x;
        sel.style.top = boundingRect.y;
        sel.style.width = boundingRect.width;
        sel.style.display = 'block';
        sel.focus();        // that.setPoint = 0;
        sel.select();
        sel.addEventListener("mouseout",event =>{
            that.setPoint = event.target.value;
            that.update();
        //this.timerDelaySelector.style.display = 'none';
            event.target.style.display = 'none';
        });
        // that.update();
    }

    this.update = function(){
        if(this.type=="counter"){
            that.spDisp.text(that.setPoint.toString());
        } else {
            this.valRect.width(this.value);
        }
        // that.spDisp.move(25,22);
        that.valDisp.text(that.value.toString());
        // that.valDisp.move(25,2);
        that.label.text(that.name);
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        if(this.hasOwnProperty('setPoint')){
            // console.log(this.setPoint)
            returnValue['setPoint'] = this.setPoint;
        }
        return returnValue;
    }
}