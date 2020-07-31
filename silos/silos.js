class Silo {
    constructor(svg,elementId){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById(elementId);
        this.y0 = this.element.y.baseVal.value;
        this.hmax = this.element.height.baseVal.value;
        this.h = this.hmax;
    }
    setH(newH){
        this.element.height.baseVal.value = newH;
        this.element.y.baseVal.value = this.y0+this.hmax-newH;
    }
    increase(amount){
        if (this.h>this.hmax-amount){
            this.h = this.hmax;
        } else {
            this.h = this.h + amount;
        }
        this.setH(this.h);
    }
    decrease(amount){
        if (this.h < amount){
            this.h = 0;
        } else {
            this.h = this.h - amount;
        }
        this.setH(this.h);
    }
}

class Valve {
    constructor(svg,elementId){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById(elementId);
        this.on = false;
    }
    update(){
        if (this.on){
            this.element.style.fill = "rgb(0,255,0)";
        } else {
            this.element.style.fill = "rgb(255,0,0)";
        }
    }
}

class Selector {
    constructor(svg,valve){
        this.svg = svg;
        this.valve = valve;
        this.selR = svg.contentDocument.getElementById("selR");
        this.selL = svg.contentDocument.getElementById("selL");
        this.gR = svg.contentDocument.getElementById("grainR");
        this.gL = svg.contentDocument.getElementById("grainL");
        this.left = true;
    }
    update(){
        if (this.left){
            this.selL.style.visibility = "visible";
            this.selR.style.visibility = "hidden";
            if(this.valve.on){
                this.gL.style.visibility = "visible";
            } else {
                this.gL.style.visibility = "hidden";
            }
            this.gR.style.visibility = "hidden";
        } else {
            this.selR.style.visibility = "visible";
            this.selL.style.visibility = "hidden";
            if(this.valve.on){
                this.gR.style.visibility = "visible";
            } else {
                this.gR.style.visibility = "hidden";
            }
            this.gL.style.visibility = "hidden";
        }
    }
}

class Sensor {
    constructor(svg,elementId,silo){
        this.svg = svg;
        this.silo = silo;
        this.element = svg.contentDocument.getElementById(elementId);
        this.h = this.element.y.baseVal.value + 0.5*this.element.height.baseVal.value-this.silo.y0;
        this.out = false;
    }
    update(){
        this.out = ((this.silo.hmax-this.silo.h) >= this.h);
        if(this.out){
            this.element.style.fill="rgb(255,0,0)";
        } else {
            this.element.style.fill="rgb(0,255,0)";
        }
    }
}

var silos, tank1, tank2, tank3;
var valve;
var selector;
var sensors;

window.addEventListener("load", function() {
    console.log("Carregou");
    silos = document.getElementById('silos');
    tank1 = new Silo(silos,'tank1Fill');
    tank2 = new Silo(silos,"tank2fill");
    tank3 = new Silo(silos,"tank3fill");

    valve = new Valve(silos,"valve");

    selector = new Selector(silos,valve);

    sensors =  [new Sensor(silos,"t1l",tank1),
                new Sensor(silos,"t2l",tank2),
                new Sensor(silos,"t2h",tank2),
                new Sensor(silos,"t3l",tank3),
                new Sensor(silos,"t3h",tank3)];

    // tank1.h=0;
    tank2.h=0;
    tank3.h=0;
    // tank1.setH(0);
    tank2.setH(0);
    tank3.setH(0);

    document.getElementById("bValve").addEventListener("click",function(evt){
        if(valve.on){
            valve.on = false;
            evt.srcElement.value = "Válvula desligada";
        } else {
            valve.on = true;
            evt.srcElement.value = "Válvula ligada";
        }
    });

    document.getElementById("bSel").addEventListener("click",function(evt){
        if(selector.left){
            selector.left = false;
            evt.srcElement.value = "Direita";
        } else {
            selector.left = true;
            evt.srcElement.value = "Esquerda";
        }
    });

    setInterval(simulate,100);
               
});

function simulate(){
    valve.update();
    selector.update();
    for(var i=0;i<sensors.length;i++){
        sensors[i].update();
    }

    if(valve.on){
        tank1.decrease(1.0);
        if (tank1.h>0){
            if(selector.left){
                tank2.increase(1.0);
            } else {
                tank3.increase(1.0);
            }    
        }
    }
    tank1.increase(0.6);
    tank2.decrease(0.3);
    tank3.decrease(0.3);
}
