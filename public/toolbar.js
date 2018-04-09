function ToolBar(pos) {
    this.pos = pos;
    this.no = new ContactNO('',p5.Vector.add(this.pos,createVector(0.1,0)));
    this.nc = new ContactNC('',p5.Vector.add(this.pos,createVector(0.1,1)));
    this.rise = new ContactRise('',p5.Vector.add(this.pos,createVector(0.1,2)));
    this.fall = new ContactFall('',p5.Vector.add(this.pos,createVector(0.1,3)));
    this.hor = new HorLine(p5.Vector.add(this.pos,createVector(0.1,4)));
    this.ver = new VerLine(p5.Vector.add(this.pos,createVector(1.3,4)));
    this.co = new CoilNO('',p5.Vector.add(this.pos,createVector(1.3,0)));
    this.cc = new CoilNC('',p5.Vector.add(this.pos,createVector(1.3,1)));
    this.cs = new CoilSet('',p5.Vector.add(this.pos,createVector(1.3,2)));
    this.cr = new CoilReset('',p5.Vector.add(this.pos,createVector(1.3,3)));
    this.eraser = new Eraser(p5.Vector.add(this.pos,createVector(1.3,5)));
    this.hand = new Hand(p5.Vector.add(this.pos,createVector(1.3,6)))
    this.ton = new ContactTON('',p5.Vector.add(this.pos,createVector(0.1,5)));
    this.tof = new ContactTOF('',p5.Vector.add(this.pos,createVector(0.1,6)));
    this.tp = new ContactTP('',p5.Vector.add(this.pos,createVector(0.1,7)));
    this.selectedShape = this.hand;
    
    this.updateGE = function(element) {
        if(element.mouseIsOver() && element.status != "high"){
            element.status = "selected";
        } else if (element.status != "high"){
            element.status = "offline";
        }
    }
    
    this.update = function() {
        this.updateGE(this.no);
        this.updateGE(this.nc);
        this.updateGE(this.rise);
        this.updateGE(this.fall);
        this.updateGE(this.hor);
        this.updateGE(this.ton);
        this.updateGE(this.tof);
        this.updateGE(this.tp);
        this.updateGE(this.co);
        this.updateGE(this.cc);
        this.updateGE(this.cs);
        this.updateGE(this.cr);
        this.updateGE(this.ver);
        this.updateGE(this.eraser);
        this.updateGE(this.hand);
    }
    
    this.selectGE = function(element) {
        if(element.mouseIsOver()){
            element.status = "high";
            this.selectedShape = element.constructor.name;
        } else {
            element.status = "offline"
        }
    }

    this.select = function() {
        this.selectGE(this.no);
        this.selectGE(this.nc);
        this.selectGE(this.rise);
        this.selectGE(this.fall);
        this.selectGE(this.ton);
        this.selectGE(this.tof);
        this.selectGE(this.tp);
        this.selectGE(this.hor);
        this.selectGE(this.co);
        this.selectGE(this.cc);
        this.selectGE(this.cs);
        this.selectGE(this.cr);
        this.selectGE(this.ver);
        this.selectGE(this.eraser);
        this.selectGE(this.hand);
    }

    this.draw = function() {
        push();
        noFill();
        stroke(0);
        strokeWeight(1);
        rect(pos.x*colSize,pos.y*linSize,2.4*colSize,8.1*linSize);

        this.no.draw();
        this.nc.draw();
        this.rise.draw();
        this.fall.draw();
        this.tp.draw();
        this.tof.draw();
        this.ton.draw();

        this.co.draw();
        this.cc.draw();
        this.cs.draw();
        this.cr.draw();

        this.hor.draw();
        this.ver.draw();

        this.eraser.draw();
        this.hand.draw();

        pop();
    }

}
