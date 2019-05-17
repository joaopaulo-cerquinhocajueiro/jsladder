// Object that represents a binary memory element - inputs, outputs and internal memory

function Value(name,posX,posY,type,svg){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.svg = svg;
    this.value = 0;
    this.setPoint = 0;
    this.shape = this.svg.group();
    this.toggle = null;

    this.draw = function(){
        if(this.type=="counter"){
            this.drawCounter()
        } 
        this.label = this.shape.text(this.name).move(20,-45).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("variable").addClass("text");
        this.shape.move(this.posX, this.posY);
    }

    var that = this;

    this.drawCounter = function(){
        that.shape.rect(40,20).radius(2).fill('white').stroke('black');
        that.shape.text("S").move(45,-10).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
        that.shape.rect(40,20).radius(2).fill('white').stroke('black').move(0,20);
        that.shape.text("V").move(45,-30).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
    }

    this.update = function(){
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        returnValue['setPoint'] = this.setPoint;
        return returnValue;
    }
}