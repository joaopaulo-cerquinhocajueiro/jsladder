class Silo {
    constructor(svg,elementId){
        this.svg = svg;
//        console.log(this.svg);
        this.element = this.svg.contentDocument.getElementById(elementId);
        //console.log(this.svg);
        this.y0 = this.element.y.baseVal.value;
        this.hmax = this.element.height.baseVal.value;
        this.h = this.hmax;
        //this.element = svg.contentDocument.getElementById(elementId);
    }
    setH = (newH)=>{
        this.element.height.baseVal.value = newH;
        this.element.y.baseVal.value = this.y0+this.hmax-newH;
    }
    increase = (amount)=>{
        // console.log(this);
        if (this.h>this.hmax-amount){
            this.h = this.hmax;
        } else {
            this.h = this.h + amount;
        }
        this.setH(this.h);
    }
    decrease = (amount)=>{
        console.log(this,"decrease")
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
        this.value = 0;
        this.type = 'output';
        this.name = 'valvula';
    }
    update = ()=>{
        if (this.value == 1){
            this.element.style.fill = "rgb(0,255,0)";
        } else {
            this.element.style.fill = "rgb(255,0,0)";
        }
    }
    json = ()=>{
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
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
        this.value = 0;
        this.type = 'output';
        this.name = 'selector';
    }
    update = ()=>{
        this.left = this.value == 1;
        if (this.left){
            this.selL.style.visibility = "visible";
            this.selR.style.visibility = "hidden";
            if(this.valve.value == 1){
                this.gL.style.visibility = "visible";
            } else {
                this.gL.style.visibility = "hidden";
            }
            this.gR.style.visibility = "hidden";
        } else {
            this.selR.style.visibility = "visible";
            this.selL.style.visibility = "hidden";
            if(this.valve.value == 1){
                this.gR.style.visibility = "visible";
            } else {
                this.gR.style.visibility = "hidden";
            }
            this.gL.style.visibility = "hidden";
        }
    }
    json = ()=>{
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}

class Sensor {
    constructor(svg,elementId,silo){
        this.svg = svg;
        this.silo = silo;
        this.element = svg.contentDocument.getElementById(elementId);
        this.h = this.element.y.baseVal.value + 0.5*this.element.height.baseVal.value-this.silo.y0;
        this.out = false;
        this.value = 0;
        this.type = 'input';
        this.name = elementId;
    }
    update = ()=>{
        this.out = ((this.silo.hmax-this.silo.h) <= this.h);
        if(this.out){
            this.value = 1;
            this.element.style.fill="rgb(255,0,0)";
        } else {
            this.value = 0;
            this.element.style.fill="rgb(0,255,0)";
        }
    }
    json = ()=>{
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}

class Silos{
    constructor(svg,memories,counters){
        //console.log(this);
        this.svg = svg.contentDocument;
        //this.element = this.svg.getElementById('svg1');
        this.svg = svg;
        this.tank1 = new Silo(this.svg,'tank1Fill');
        this.tank2 = new Silo(this.svg,"tank2fill");
        this.tank3 = new Silo(this.svg,"tank3fill");

        this.valve = new Valve(this.svg,"valve");

        this.selector = new Selector(this.svg,this.valve);

        this.sensors =  [new Sensor(this.svg,"t1l",this.tank1),
                    new Sensor(this.svg,"t2l",this.tank2),
                    new Sensor(this.svg,"t2h",this.tank2),
                    new Sensor(this.svg,"t3l",this.tank3),
                    new Sensor(this.svg,"t3h",this.tank3)];
    
        this.inputs =  ["Valvula", "Direcao"];
        this.outputs = this.sensors;
        this.memories = memories;
        this.counters = counters;
        this.coisos = [this.valve, this.selector].concat(this.sensors);

        //this.create(null,this.memories,this.counters);
                
    }

    create(inputs, memories, counters){
        //this.svg.clear();
        var posY = 0;
        this.svg.text('inputs').move(30,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
            posY+=distanceY+20;
        inputs.forEach(input => {
            this.coisos.push(new Bit(input,10,posY,"input",this.svg));
            posY +=distanceY;
        });
        
        posY = 0;
        this.svg.text('mem').move(105,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=distanceY+20;
        
        memories.forEach(memory => {
            this.coisos.push(new Bit(memory,85,posY,"memory",this.svg));
            posY +=distanceY;
        });
        
        posY = 0;
        this.svg.text('counters').move(280,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=distanceY+20;
        counters.forEach(counter => {
            this.coisos.push(new Value(counter,260,posY,"counter",this.svg));
            posY +=distanceY*1.5;
        });

        this.coisos.forEach(item => {
            item.draw();
        });
    }

    reset(){
        this.tank1.h=this.tank1.hmax;
        this.tank1.setH(this.tank1.hmax);
        this.tank2.h=0;
        this.tank3.h=0;
        this.tank2.setH(0);
        this.tank3.setH(0);
    }

    simulate = ()=>{
        // this.valve.update();
        // this.selector.update();
        // let s = window.sistema;
        // console.log(s,this);
    
        for(var i=0;i<this.sensors.length;i++){
            this.sensors[i].update();
        }
        
        if(this.valve.value==1){
            this.tank1.decrease(1.0);
            if (this.tank1.h>0){
                if(this.selector.left){
                    this.tank2.increase(1.0);
                } else {
                    this.tank3.increase(1.0);
                }    
            }
        }
        this.tank1.increase(0.6);
        this.tank2.decrease(0.3);
        this.tank3.decrease(0.3);
    }
}

//


// window.addEventListener("load", function() {

//     document.getElementById("bValve").addEventListener("click",function(evt){
//         if(valve.on){
//             valve.on = false;
//             evt.srcElement.value = "Válvula desligada";
//         } else {
//             valve.on = true;
//             evt.srcElement.value = "Válvula ligada";
//         }
//     });

//     document.getElementById("bSel").addEventListener("click",function(evt){
//         if(selector.left){
//             selector.left = false;
//             evt.srcElement.value = "Direita";
//         } else {
//             selector.left = true;
//             evt.srcElement.value = "Esquerda";
//         }
//     });

//     setInterval(simulate,100);
               
// });
