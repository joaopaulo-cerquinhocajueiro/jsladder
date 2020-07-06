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
        this.label = this.shape.text(this.name).move(20,-22).font({
            family:   'Lucida'
        , size:     15
        , anchor:   'middle'
        }).stroke({width:0}).addClass("variable").addClass("text");
        this.shape.move(this.posX, this.posY);
        this.label.dblclick(event =>{
            var boundingRect = event.target.getBoundingClientRect();
            sel = document.createElement('input');
            document.body.appendChild(sel);
            sel.setAttribute('type', 'text');
            console.log(event);
            sel.setAttribute('value', event.target.innerHTML);
            sel.id='label';
            sel.className += 'selector';
            sel.style.left = boundingRect.x;
            sel.style.top = boundingRect.y;
            sel.style.width = 50;
            sel.style.display = 'block';
            sel.focus();        // that.setPoint = 0;
            sel.select();
            sel.addEventListener("mouseout",event =>{
                if(isNewName(elementTable.ioElements,event.target.value)){
                    changeElementName(that.name,event.target.value);
                    that.name = event.target.value;
                    // console.log(that)
                    that.update();
                //this.timerDelaySelector.style.display = 'none';
                    // event.target.style.display = 'none';    
                }
                event.target.parentNode.removeChild(event.target);
            });
        });
    }

    var that = this;

    this.drawOutput = function(){
        that.display = that.shape.rect(40,20).radius(10).stroke('black').fill(that.value?'red':'blue');
    }

    this.drawInput = function(){
        that.shape.rect(40,20).radius(5).fill('white').stroke('black');
        that.toggle = that.shape.rect(25,20).radius(5);
        that.toggle.click(function(){
            that.value = 1-that.value;
            if(that.value == 0){
                that.toggle.move(0,0).fill('blue');
            } else {
                that.toggle.move(15,0).fill('red');
            }
        });
        console.log(that);
        if(that.value == 0){
            that.toggle.move(0,0).fill('blue');
        } else {
            that.toggle.move(15,0).fill('red');
        }
//        rect(pos,-0.2,0.3,0.4,0.15);
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
        this.label.plain(this.name).move(20,-17);
    }

    this.json = function(){
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}