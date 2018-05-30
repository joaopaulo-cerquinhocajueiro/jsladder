// Object that represents a binary memory element - inputs, outputs and internal memory

function Bit(name,posX,posY,type,svg){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.svg = svg;
    this.value = 0;
    this.shape = this.svg.group();
    this.toggle = null;

    this.draw = function(){
        if(this.type=="input"){
            this.drawInput()
        } else {
            this.drawOutput()
        }
        this.label = this.shape.text(this.name).move(20,-50).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        }).stroke({width:0}).addClass("variable").addClass("text");
        this.shape.move(this.posX, this.posY);
        
    }

    var that = this;

    this.drawOutput = function(){
        that.display = that.shape.rect(40,40).radius(15).stroke('black').fill(that.value?'red':'blue');
    }

    this.drawInput = function(){
        that.shape.rect(40,40).radius(15).fill('white').stroke('black');
        that.toggle = that.shape.rect(30,40).radius(15)

        if(that.value == 0){
            that.toggle.move(0,0).fill('blue');
        } else {
            that.toggle.move(10,0).fill('red');
        }
//        rect(pos,-0.2,0.3,0.4,0.15);
    }

    if(this.type == 'input'){
        this.shape.click(function(){
            that.value = 1-that.value;
            if(that.value == 0){
                that.toggle.move(0,0).fill('blue');
            } else {
                that.toggle.move(10,0).fill('red');
            }
        });
    }

    this.update = function(){
        if(this.type == 'input'){
            if(this.value == 0){
                this.toggle.move(0,0).fill('blue');
            } else {
                this.toggle.move(10,0).fill('red');
            }
        } else {
            this.display.fill(this.value?'red':'blue');
        }
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}