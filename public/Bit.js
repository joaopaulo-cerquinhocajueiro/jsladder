// Object that represents a binary memory element - inputs, outputs and internal memory

function Bit(name,pos,type){
    this.name = name;
    this.pos = pos;
    this.type = type;
    this.value = 0;

    this.draw = function(){
        push();
        translate(this.pos.x*colSize,this.pos.y*linSize); // Move to the position
        scale(colSize,linSize); // Scale to the actual element size
        stroke(0);
        strokeWeight(0.01);
        if(this.value == 0){
            fill(0,0,150);
        } else {
            fill(150,0,0);
        }
        rect(-0.2,-0.2,0.4,0.4,0.1);
        noStroke();
        fill(0);
        textSize(0.3); 
        textAlign(CENTER,BOTTOM);
        text(this.name,0,0.5)
        pop();
    }

    this.mouseIsOver = function() {
        if((mouseX >= (this.pos.x-0.2)*colSize) && (mouseX < (this.pos.x+0.2)*colSize) && (mouseY >= (this.pos.y-0.2)*linSize) && (mouseY < (this.pos.y+0.3)*linSize)){
            return Boolean(true);
        } else {
            return Boolean(false);
        }
    }

    this.toggle = function(){
        this.value = 1-this.value;
    }
}