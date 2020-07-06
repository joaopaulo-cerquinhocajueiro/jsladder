function VaiEVolta(svg, memories, counters){
    this.svg = svg;
    this.inputs =  ["ComandoEsq", "ComandoDir", "fdcEsq", "fdcDir"];
    this.outputs = ["motorEsq","motorDir", "Alarme"];
    this.memories = memories;
    this.counters = counters;

    distanceY = 50;

    this.fdcEsq = {"type":"input","name":"fdcEsq","value":0,"draw":function(){},"update":function(){}};
    this.fdcDir = {"type":"input","name":"fdcDir","value":0,"draw":function(){},"update":function(){}};
    this.motorEsq = {"type":"output","name":"motorEsq","value":0,"draw":function(){},"update":function(){}};
    this.motorDir = {"type":"output","name":"motorDir","value":0,"draw":function(){},"update":function(){}};
    this.alarme = {"type":"output","name":"Alarme","value":0,"draw":function(){},"update":function(){}};

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
        this.carrinho = this.svg.image('carro.png',100,50).move(100,500);
        that = this
        this.intervaloSimul = setInterval(function(){
            if (this.elementTable.simulating){
                console.log("simulando");
                if (that.motorDir.value == 1){
                    that.carrinho.dx(5);
                } else if(that.motorEsq.value == 1){
                    that.carrinho.dx(-5);
                }
            }
        },100);
    }

    this.create(["comandoEsq","comandoDir"],this.memories,this.counters);

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