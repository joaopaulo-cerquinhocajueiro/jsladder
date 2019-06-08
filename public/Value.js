// Object that represents a binary memory element - inputs, outputs and internal memory

function Value(name,posX,posY,type,svg){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.svg = svg;
    this.value = 0;
    this.setPoint = 5;
    this.shape = this.svg.group();
    this.toggle = null;

    var that = this;

    this.draw = function(){
        if(this.type=="counter"){
            this.drawCounter()
        } 
        this.label = this.shape.text(this.name).move(25,-45).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("variable").addClass("text");
        this.label.dblclick(event =>{
            var boundingRect = event.target.getBoundingClientRect();
            sel = document.createElement('input');
            document.body.appendChild(sel);
            sel.setAttribute('type', 'text');
            console.log(event);
            sel.setAttribute('value', event.target.innerHTML);
            sel.id='setPoint';
            sel.className += 'selector';
            sel.style.left = boundingRect.x;
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
        this.shape.move(this.posX, this.posY);
    }

    this.drawCounter = function(){
        that.valBox = that.shape.rect(50,20).radius(2).fill('white').stroke('black');
        that.shape.text("S").move(55,-10).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
        that.spBox = that.shape.rect(50,20).radius(2).fill('white').stroke('black').move(0,20);
        that.shape.text("V").move(55,-30).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");

        that.spDisp = that.shape.text(that.setPoint.toString()).move(25,-8).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
        
        that.valDisp = that.shape.text(that.value.toString()).move(25,-28).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");

        that.spBox.click(that.updateValue);
        //that.valBox.click(that.updateValue);
        
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
        that.spDisp.plain(that.setPoint.toString());
        that.spDisp.move(25,22);
        that.valDisp.plain(that.value.toString());
        that.valDisp.move(25,2);
        that.label.plain(that.name).move(25,-17);
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        returnValue['setPoint'] = this.setPoint;
        return returnValue;
    }
}