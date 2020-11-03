class Ovo {
    constructor(svg){
        this.svg = svg;
        this.estado = 0;
        this.aniCounterMax = 2;
        this.aniCounter = 0;
        this.ovos = [
            this.svg.contentDocument.getElementById("ovoinicial"),
            this.svg.contentDocument.getElementById("ovo1"),
            this.svg.contentDocument.getElementById("ovo2"),
            this.svg.contentDocument.getElementById("ovo3")];
        this.crack = this.svg.contentDocument.getElementById("rachadura");
        for(let i = 1;i<4;i++){
            this.ovos[i].style.visibility = "hidden";
        }
        this.crack.style.visibility = "hidden";
    }
    update(){
        switch(this.estado){
            case 0: if (sistema.portinhola.aberto){
                this.estado = 1;
                }
                break;
            case 1: if(++this.aniCounter>=this.aniCounterMax){
                this.estado = 2;
                this.aniCounter = 0;
                }
                break;
            case 2: if(++this.aniCounter>=this.aniCounterMax){
                if(sistema.panela.h >= 0.6*sistema.panela.hmax){
                    this.estado = 3;
                } else {
                    this.estado = 4;
                }
                this.aniCounter = 0;
                }
                break;
            default: break;
        }
        for(let i = 0;i<4;i++){
            if(this.estado == i){
                this.ovos[i].style.visibility="visible";
            } else {
                this.ovos[i].style.visibility="hidden";
            }
        }
        if(this.estado == 4){
            this.ovos[3].style.visibility="visible";
            this.crack.style.visibility="visible";
        } else {
            this.crack.style.visibility="hidden";
        }
    }
}

class Panela {
    constructor(svg){
        this.svg = svg;
//        console.log(this.svg);
        this.pan = this.svg.contentDocument.getElementById('panela');
        //console.log(this.svg);
        this.aguaBaixo = this.svg.contentDocument.getElementById('aguaBaixo');
        this.aguaTopo = this.svg.contentDocument.getElementById('aguaTopo');
        this.y0 = this.aguaTopo.y.baseVal.value;
        this.hmax = this.aguaTopo.height.baseVal.value;
        this.h = 0;
        this.present = false;
        this.hide();
        //this.element = svg.contentDocument.getElementById(elementId);
    }
    setH = (newH)=>{
        this.aguaTopo.height.baseVal.value = newH;
        this.aguaTopo.y.baseVal.value = this.y0+this.hmax - newH;
        if(this.h>0){
            this.aguaBaixo.style.visibility = "visible";
            this.aguaTopo.style.visibility = "visible";
        } else {
            this.aguaBaixo.style.visibility = "hidden";
            this.aguaTopo.style.visibility = "hidden";
        }
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
        // console.log(this,"decrease")
        if (this.h < amount){
            this.h = 0;
        } else {
            this.h = this.h - amount;
        }
        this.setH(this.h);
    }
    show = ()=>{
        this.pan.style.visibility = "visible";
        if(this.h>0){
            this.aguaBaixo.style.visibility = "visible";
            this.aguaTopo.style.visibility = "visible";
        }
        this.present = true;
    }
    hide = ()=>{
        this.pan.style.visibility = "hidden";
        this.aguaBaixo.style.visibility = "hidden";
        this.aguaTopo.style.visibility = "hidden";
        this.h = 0;
        this.setH(this.h);
        this.present = false;
    }
}

class Valve {
    constructor(svg,elementId){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById(elementId);
        console.log(this, this.svg,this.element);
        this.value = 0;
        this.type = 'output';
        this.name = elementId;
    }
    update = ()=>{
        if (this.value == 1){
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(0,255,0)";
                    }
                }
                x.style.stroke = "rgb(0,255,0)";
            }
        } else {
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(255,0,0)";
                    }
                }
                x.style.stroke = "rgb(255,0,0)";
            }
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
    constructor(svg){
        this.svg = svg;
        this.PO = svg.contentDocument.getElementById("PO");
        this.POfechado = svg.contentDocument.getElementById("POfechado");
        this.POaberto = svg.contentDocument.getElementById("POaberto");
        this.POaberto.style.visibility = "hidden";
        this.aberto = false;
        this.value = 0;
        this.type = 'output';
        this.name = 'PO';
    }
    update = ()=>{
        this.aberto = this.value == 1;
        if (this.aberto){
            this.POaberto.style.visibility = "visible";
            this.POfechado.style.visibility = "hidden";
            this.PO.style.stroke = "rgb(0,255,0)";
        } else {
            this.POaberto.style.visibility = "hidden";
            this.POfechado.style.visibility = "visible";
            this.PO.style.stroke = "rgb(255,0,0)";
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
    constructor(svg,elementId){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById(elementId);
        this.out = false;
        this.value = 0;
        this.type = 'input';
        this.name = elementId;
    }
    update = ()=>{
        switch(this.name){
            case "SN": this.value = sistema.panela.h > 0.9*sistema.panela.hmax?1:0;
                break;
            case "SPP": this.value = sistema.panela.present?1:0;
                break;
            case "SG": this.value = sistema.valveGas.value;
        }
        if (this.value == 1){
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(0,255,0)";
                    }
                }
                x.style.stroke = "rgb(0,255,0)";
            }
        } else {
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(255,0,0)";
                    }
                }
                x.style.stroke = "rgb(255,0,0)";
            }
        }
    }
    json = ()=>{
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}

class SensorTemp {
    constructor(svg){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById("temperature");
        this.out = false;
        this.value = 0;
        this.temperature = 20.0;
        this.y0 = this.element.y.baseVal.value-3*this.element.height.baseVal.value;
        this.hmax = this.element.height.baseVal.value*4;
        this.h = 0;
        this.type = 'input';
        this.name = "ST";
    }
    update = ()=>{
        if(sistema.panela.present){
            if (sistema.fogo.style.visibility == "visible"){
                this.temperature += 0.02*(100.0-this.temperature);
                console.log("Updating temp",this.temperature);
            } else {
                this.temperature -= 0.2*(this.temperature-20.0);
            }
        }  else {
            this.temperature = 20;
        }
        var h = (this.temperature-20.0)*this.hmax/80.0;
        this.element.height.baseVal.value = h;
        this.element.y.baseVal.value = this.y0 + this.hmax - h;


        this.value = this.temperature>80? 1: 0;
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

class Centelha{
    constructor(svg){
        this.svg = svg;
        this.element = svg.contentDocument.getElementById("centelha");
        console.log(this, this.svg,this.element);
        this.value = 0;
        this.type = 'output';
        this.name = 'centelha';
    }
    update = ()=>{
        if (this.value == 1){
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(0,255,0)";
                    }
                }
                x.style.stroke = "rgb(0,255,0)";
            }
        } else {
            for(let x of this.element.children){
                if(x.childElementCount>0){
                    for(let y of x.children){
                        y.style.stroke = "rgb(255,0,0)";
                    }
                }
                x.style.stroke = "rgb(255,0,0)";
            }
        }
    }
    json = ()=>{
        var returnValue = {};
        returnValue['type'] = this.type;
        returnValue['name'] = this.name;
        return returnValue;
    }
}

class Egginator{
    constructor(svg,memories,counters){
        //console.log(this);
        //this.svg = svg.contentDocument;
        //this.element = this.svg.getElementById('svg1');
        this.svg = svg;
        this.panela = new Panela(this.svg);

        this.valveAgua = new Valve(this.svg,"VA");
        this.valveGas = new Valve(this.svg,"VG");

        this.centelha = new Centelha(this.svg);

        this.portinhola = new Selector(this.svg);

        this.SN = new Sensor(this.svg,"SN");
        this.SPP = new Sensor(this.svg,"SPP");
        this.SG = new Sensor(this.svg,"SG");

        this.ST = new SensorTemp(this.svg);
    
        this.ovo = new Ovo(this.svg);
        
        this.aguaSaindo = this.svg.contentDocument.getElementById("aguaSaindo");
        this.aguaSaindo.style.visibility = "hidden";

        this.fogo = this.svg.contentDocument.getElementById("fogo");
        this.fogo.style.visibility = "hidden";

        this.inputs =  [this.SPP, this.SN, this.SG, this.ST];
        this.outputs = [this.valveAgua,this.valveGas,this.centelha,this.portinhola];
        this.coisos = this.inputs.concat(this.outputs);

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
        // console.log(this.portinhola);
        this.portinhola.value = 0;
        this.portinhola.update();
        this.centelha.value = 0;
        this.centelha.update();
        this.ovo.estado = 0;
        this.ovo.update();
        this.panela.present = false;
        // this.panela.update();
        this.valveAgua.value = 0;
        this.valveAgua.update();
        this.valveGas.value = 0;
        this.valveGas.update();
        this.fogo.style.visibility = "hidden";
        this.SPP.update();
        this.SG.update();
        this.SN.update();
        this.ST.temperature = 20;
        this.ST.update();
    }

    simulate = ()=>{

        for(let x of this.outputs){
            x.update();
        }
        if(this.valveAgua.value == 1){
            this.aguaSaindo.style.visibility = "visible";
            if(this.panela.present){
                this.panela.increase(2);
            }
        } else {
            this.aguaSaindo.style.visibility = "hidden";
        }
        // this.panela.update();
        this.ovo.update();
        if(this.valveGas.value == 0){
            this.fogo.style.visibility = "hidden";
        } else {
            if(this.centelha.value == 1){
                this.fogo.style.visibility = "visible";
            }
        }
        for(let x of this.inputs){
            x.update();
        }
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
