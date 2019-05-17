// Object that represents a binary memory element - inputs, outputs and internal memory

function Value(name,posX,posY,type,svg){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.svg = svg;
    this.value = 2;
    this.setPoint = 2;
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

        that.spDisp = that.shape.text(that.setPoint.toString()).move(20,-8).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
        
        that.valDisp = that.shape.text(that.value.toString()).move(20,-28).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("text");
        
    }

    this.update = function(){
        that.spDisp.plain(that.setPoint.toString());
        that.spDisp.move(20,22);
        that.valDisp.plain(that.value.toString());
        that.valDisp.move(20,2);
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        returnValue['setPoint'] = this.setPoint;
        return returnValue;
    }
}