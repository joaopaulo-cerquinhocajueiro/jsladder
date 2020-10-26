function VaiEVolta(svg, memories, counters){
    this.svg = svg;
    this.inputs =  ["ComandoEsq", "ComandoDir","comandoLiga","comandoDesliga", "fdcEsq", "fdcDir"];
    this.outputs = ["motorEsq","motorDir", "Alarme"];
    this.memories = memories;
    this.counters = counters;

    distanceY = 50;

    this.fdcDir = {"type":"input",
                   "name":"fdcDir",
                   "value":0,
                   "shape":this.svg,
                   "draw":function(){
                    //    console.log("Should draw line");
                       this.line = this.shape.line(520, 450, 520, 550).addClass("line").stroke(this.value?"red":"blue");
                   },
                   "update":function(){
                        this.line.stroke(this.value?'red':'blue');
                    },
                    "json":function(){
                     var returnValue = {};
                     returnValue['type'] = this.type;
                     returnValue['name'] = this.name;
                     return returnValue;
                    }
                };
    this.fdcEsq = {"type":"input",
                   "name":"fdcEsq",
                   "value":0,
                   "shape":this.svg,
                   "draw":function(){
                    //    console.log("Should draw line");
                       this.line = this.shape.line(20, 450, 20, 550).addClass("line").stroke(this.value?"red":"blue");
                   },
                   "update":function(){
                        this.line.stroke(this.value?'red':'blue');
                   },
                   "json":function(){
                    var returnValue = {};
                    returnValue['type'] = this.type;
                    returnValue['name'] = this.name;
                    return returnValue;
                   }
                };
    this.motorEsq = {"type":"output",
                     "name":"motorEsq",
                     "value":0,
                     "draw":function(){},
                     "update":function(){},
                     "json":function(){
                     var returnValue = {};
                     returnValue['type'] = this.type;
                     returnValue['name'] = this.name;
                     return returnValue;
                     }
                    };
    this.motorDir = {"type":"output","name":"motorDir","value":0,"draw":function(){},"update":function(){},
            "json":function(){
                var returnValue = {};
                returnValue['type'] = this.type;
                returnValue['name'] = this.name;
                return returnValue;
            }
        };
    this.alarme = {"type":"output","name":"Alarme","value":0,"draw":function(){},"update":function(){},
        "json":function(){
            var returnValue = {};
            returnValue['type'] = this.type;
            returnValue['name'] = this.name;
            return returnValue;
            }
        };

    this.coisos = [this.fdcEsq, this.fdcDir, this.motorEsq, this.motorDir, this.alarme];

    this.create = function(inputs, memories, counters){
        this.svg.clear();
        posY = 0;
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

        // Desenho da simulação
        // this.carrinho = this.svg.group().rect(40,20).radius(10).stroke('black').fill('none').move(100,500);
        this.carrinho = this.svg.image('carro.png',150,80).move(200,480);
        this.svg.image("muro.png",50,50).move(-40,500);
        this.svg.image("muro.png",50,50).move(-40,475);
        this.svg.image("muro.png",50,50).move(580,500);
        this.svg.image("muro.png",50,50).move(580,475);
        //  console.log(this.fdcEsq);
        // this.fdcEsq.draw();
        that = this
        this.intervaloSimul = setInterval(function(){
            if (simulating){
                // console.log("Simulando");
                if (that.motorDir.value == 1 && that.carrinho.bbox().x<470){
                    that.carrinho.dx(50);
                } else if(that.motorEsq.value == 1 && that.carrinho.bbox().x>-30){
                    that.carrinho.dx(-50);
                }
                that.fdcEsq.value = that.carrinho.bbox().x<-5 && that.carrinho.bbox().x>-80;
                that.fdcDir.value = that.carrinho.bbox().x>400 && that.carrinho.bbox().x<520;
                that.fdcEsq.update();
                that.fdcDir.update();
            } else {
                // console.log("Não simulando");
                sistema.carrinho.x(200);
            }
        },100);
    }

    this.create(["comandoEsq","comandoDir","comandoLiga","comandoDesl"],this.memories,this.counters);

    this.writeJson = function(codeObject){
        var variablesRead = codeObject.variables;
        var inputs = [];
        var memories = [];
        var outputs = [];
        var counters = [];
        variablesRead.forEach(variable =>{
            switch(variable.type){
            case 'input': inputs.push(variable.name);
                break;
            case 'memory': memories.push(variable.name);
                break;
            case 'output': outputs.push(variable.name);
                break;
                case 'counter': counters.push(variable.name);
                break;
            }
        });
        this.create(inputs,memories,outputs,counters);
    }
}
