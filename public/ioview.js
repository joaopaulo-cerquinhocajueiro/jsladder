function IOView(svg, inputs, memories, outputs, counters, analogInputs){
    this.svg = svg;
    this.inputs = inputs;
    this.outputs = outputs;
    this.memories = memories;
    this.counters = counters;
    this.analogInputs = analogInputs;

    distanceY = 50;

    this.coisos = [];

    this.create = function(inputs, memories, outputs, counters, analogInputs){
        this.coisos = [];
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
        this.svg.text('outputs').move(180,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=distanceY+20;
        
        outputs.forEach(output => {
            this.coisos.push(new Bit(output,160,posY,"output",this.svg));
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
            this.coisos.push(new Value(counter,260,posY,"counter",this.svg,5));
            posY +=distanceY*1.5;
        });

         posY -=distanceY-10;
        this.svg.text('Analog').move(280,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=distanceY+25;

        analogInputs.forEach(coiso => {
            this.coisos.push(new Value(coiso,260,posY,"analogInput",this.svg,5));
            posY +=distanceY;
        });

        this.coisos.forEach(item => {
            item.draw();
        });



    }

    this.create(this.inputs,this.memories,this.outputs,this.counters,this.analogInputs);

    this.writeJson = function(codeObject){
        var variablesRead = codeObject.variables;
        var inputs = [];
        var memories = [];
        var outputs = [];
        var counters = [];
        var analogInputs = [];
        variablesRead.forEach(variable =>{
            switch(variable.type){
            case 'input': inputs.push(variable.name);
                break;
            case 'memory': memories.push(variable.name);
                break;
            case 'output': outputs.push(variable.name);
                break;
                case 'counter': counters.push([variable.name,variable.setPoint]);
                break;
            }
        });
        this.create(inputs,memories,outputs,counters,analogInputs);
    }
}