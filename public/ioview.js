function IOView(svg, inputs, memories, outputs){
    this.svg = svg;
    this.inputs = inputs;
    this.outputs = outputs;
    this.memories = memories;

    this.coisos = [];

    this.create = function(inputs, memories, outputs){
        this.coisos = [];
        this.svg.clear();
        posY = 0;
        this.svg.text('inputs').move(30,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
            posY+=70;
        inputs.forEach(input => {
            this.coisos.push(new Bit(input,10,posY,"input",this.svg));
            posY +=70;
        });
        
        posY = 0;
        this.svg.text('mem').move(105,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=70;
        
        memories.forEach(memory => {
            this.coisos.push(new Bit(memory,85,posY,"memory",this.svg));
            posY +=70;
        });
        
        posY = 0;
        this.svg.text('outputs').move(180,posY).font({
            family:   'Helvetica'
        , size:     20
        , anchor:   'middle'
        });
        posY+=70;
        
        outputs.forEach(output => {
            this.coisos.push(new Bit(output,160,posY,"output",this.svg));
            posY +=70;
        });

        this.coisos.forEach(item => {
            item.draw();
        });
    }

    this.create(this.inputs,this.memories,this.outputs);

    this.writeJson = function(codeObject){
        var variablesRead = codeObject.variables;
        var inputs = [];
        var memories = [];
        var outputs = [];
        variablesRead.forEach(variable =>{
            switch(variable.type){
            case 'input': inputs.push(variable.name);
                break;
            case 'memory': memories.push(variable.name);
                break;
            case 'output': outputs.push(variable.name);
                break;
            }
        });
        this.create(inputs,memories,outputs);
    }
}