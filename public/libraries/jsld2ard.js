

function codeRepr(element){
    var text;
    switch (element.type) {
        case "ContactTON":
        case "ContactTOF":
        case "ContactTP":
            text = element.type + "(timer" + element.tIdx + ", node" + element.i + ")";
            break; 
        case "ContactNO":
        case "ContactNC":
        case "CoilNO":
        case "CoilNC":
        default:
            text = element.type + "(" + element.name + ", node" + element.i + ")";
            break;
    }
    return text;
}


function makeSequence(inOuts,contacts,coils){
    var novoInOuts = inOuts;
    var sequence = [];

    while(coils.length>0){
        item = coils.pop(); // Get the last coil
        var actualNode = item.i;
        sequence.push(codeRepr(item) + ";");
        var toBeRemoved = []; // needed to remove the coils from the list after using them
        coils.forEach((coil,cIndex) =>{
            if(coil.i==actualNode){ // Check if the coil is on the same node as the previous one.
                sequence.push(codeRepr(coil) + ";");
                toBeRemoved.push(cIndex);
            }
        });
        toBeRemoved.reverse().forEach(cIndex =>{
            coils.splice(cIndex,1);
        });
    }
    while(novoInOuts.length>0){
        // console.log(coils);
        var inOutNode = novoInOuts.pop();
        // console.log(inOutNode);
        if (inOutNode.number != 0){
            var text = "node" + inOutNode.number + ".write(";
            if(inOutNode.outputs.length>1){
                text += inOutNode.outputs.map(contactIdx => {return codeRepr(contacts[contactIdx])}).join(" || ");
            } else if(inOutNode.outputs.length == 1){
                var contact = contacts[inOutNode.outputs[0]];
                text += codeRepr(contact);
            } else{
                text += "0"
            }
            text += ");";
            sequence.push(text);    
        } 
    }
    return sequence;
}

function jsld2ard(jsonFile,callback) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(jsonFile);
    codeText = "// Code automatically generated from ladder\n\n";
    codeText += '#include "arduinoladder.h"\n\n// Pins\n';
    var inputPins = [2,3,4,5,6,7];
    var outputPins = [13,8,9,10,11,12];
    var indexIn = 0;
    var indexOut = 0;
    actual_JSON['variables'].forEach(variable => {
        if (variable.type == 'input'){
            codeText += 'const int pin' + variable.name + ' = ' + inputPins[indexIn++] + ';\n';
        }
        index = 0;
        if (variable.type == 'output'){
            codeText += 'const int pin' + variable.name + ' = ' + outputPins[indexOut++] + ';\n';
        }
    });
    var nodes = nodeRepr(actual_JSON);
    var horizontal = actual_JSON['horizontal'];
    var contacts = [];
    var coils = [];
    var coiso;
    for(var i = 0;i<horizontal.length;i++){
        // Para todos os contatos
        for(var j = 0;j<horizontal[0].length-1;j++){
            if(horizontal[i][j]!="Empty" && horizontal[i][j]!="HorLine"){
                coiso ={type:horizontal[i][j].type,name:horizontal[i][j].name,i:nodes[i][j],o:nodes[i][j+1],isCoil:false};
                contacts.push(coiso);
            }
        }
        // Para as bobinas
        var j=horizontal[0].length-1;
        // console.log(horizontal[i][j]);
        if(horizontal[i][j]!="Empty"){
            coiso ={type:horizontal[i][j].type,name:horizontal[i][j].name,i:nodes[i][j],isCoil:true};
            coils.push(coiso);
        }
    }
    var inOuts = [];
    contacts.forEach((contact,cIndex)=>{
        var isNewINode = true;
        var isNewONode = true;
        inOuts.forEach((node,nodeIndex) =>{
            if(contact.i == nodeIndex){
                isNewINode = false;
                node.inputs.push(cIndex);
            }
            if(contact.o == nodeIndex){
                isNewONode = false;
                node.outputs.push(cIndex);
            }
        });
        if(isNewINode){
            inOuts[contact.i] = {number:contact.i,inputs:[cIndex],outputs:[]};
        }
        if(isNewONode){
            inOuts[contact.o] = {number:contact.o,inputs:[],outputs:[cIndex]};
        }
    });
    // console.log(inOuts,contacts,coils);

    codeText += "\n// Nodes\n"
    inOuts.forEach(node =>{
        codeText += "Node node" + node.number + ";\n";
    });

    codeText += '\n// Variables\n';
    actual_JSON['variables'].forEach(variable => {
        switch (variable.type) {
            case 'input': // define como input
                codeText += 'IO ' + variable.name + '(pin' + variable.name + ', INPUT);\n';
                // codeText += '\tdigitalWrite(pin' + variable.name + ', LOW);\n\n';
                break;
            case 'output': // define como saída, com valor inicial 0
                codeText += 'IO ' + variable.name + '(pin' + variable.name + ', OUTPUT);\n';
                break;
            case 'counter': // não faz nada
                codeText += 'Counter ' + variable.name + '(' + variable.setPoint + ');\n';
                break;
            case 'memory': // não faz nada
                codeText += 'Mem ' + variable.name + ';\n';
            default:
                break;
        }
    });

    codeText += '\n// Timers\n';
    timerCounter = 0;
    for(var i = 0;i<contacts.length;i++){
        var contact = contacts[i];
        if (contact.type == "ContactTON" || contact.type == "ContactTOF" || contact.type == "ContactTP"){
            var type;
            switch(contact.type){
                case "ContactTON": type = 0;
                break;
                case "ContactTOF": type = 1;
                break;
                case "ContactTP": type = 2;
                break;

            }
            contact.tIdx = timerCounter;
            contacts[i].tIdx = timerCounter++;
            codeText += "Timer timer" + contact.tIdx + "(" + type + ", " + contact.name*1000 + ");\n"
        } 
    }
//    console.log(contacts);

    sequence = makeSequence(inOuts,contacts,coils);

    codeText += '\nvoid setup(){\n';
    codeText += '\n\tnode0.write(HIGH); // Node 0 is the phase - it is always HIGH\n\n'
    actual_JSON['variables'].forEach(variable => {
        switch (variable.type) {
            case 'input': // define como input
                // codeText += '\tpinMode(pin' + variable.name + ', INPUT);\n';
                // codeText += '\tdigitalWrite(pin' + variable.name + ', LOW);\n\n';
                break;
            case 'output': // define como saída, com valor inicial 0
                codeText += '\t' + variable.name + '.write(LOW);\n';
                break;
            case 'counter': // não faz nada
                // codeText += '\t' + variable.name + ' = 0;\n';
                break;
            case 'memory': // não faz nada
            default:
                break;
        }
    });
    codeText += '}\n\n';
    // Start the arduino loop
    codeText += 'void loop(){\n\t//Read all inputs\n';
    actual_JSON['variables'].forEach(variable => {
        if(variable.type == 'input' || variable.type == 'memory'){
            codeText += '\t' + variable.name+ '.getValue();\n';
        }
    });
    codeText += '\n\t//Execute the code\n\t';
    /// Here goes the code to be executed
    codeText += sequence.reverse().join('\n\t');
    codeText += '\n\n\t//Write all outputs\n';
    actual_JSON['variables'].forEach(variable => {
        if(variable.type=='output'){
            codeText += '\t' + variable.name + '.updateOutput();\n';
        }
    });
    codeText += '}\n\n';
    callback(codeText);
};

function hasPath(contacts,initial,final){
    nodes = [initial];
    while(nodes.length>0 && nodes.filter(node=>{return node == final}).length==0){
        var node = nodes.splice(0,1)[0];
        var inContacts = contacts.filter(contact=>{
            return contact.i == node;
        });
        inContacts.forEach(contact=>{
            nodes= nodes.concat(contact.o);
        });
    }
    return nodes.length > 0;
}

function nodeRepr(jsonRepr){
    var horizontal = jsonRepr['horizontal'];
    var vertical = jsonRepr['vertical'];
    var horSize = jsonRepr['horSize'];
    var verSize = jsonRepr['verSize'];
    // Inicializa a matriz com os nós com todos os valores -1
    var nodeMatrix = new Array(verSize);
    for(var lineNumber=0;lineNumber<verSize;lineNumber++){
        nodeMatrix[lineNumber] = new Array(horSize).fill(-1);
    }
    // console.log(nodeMatrix);
    var node = 1; // O nó 0 é a barra esquerda
    for(var lineNumber=0;lineNumber<verSize;lineNumber++){ // para todas as linhas
        for(var colNumber=0;colNumber<horSize;colNumber++){ // para todas colunas
            if(colNumber>0){ // se não for na coluna inicial
                if(lineNumber>0){ // se não for na linha inicial
                    if(vertical[lineNumber-1][colNumber-1]=="VerLine"){ // Checa se tem linha vertical acima
                        nodeMatrix[lineNumber][colNumber] = nodeMatrix[lineNumber-1][colNumber] // e coloca o nó anterior
                        // Problema se o elemento anterior é uma linha horizontal. Pode ter conflito na numeração
                        if((horizontal[lineNumber][colNumber-1]=="HorLine")&&(nodeMatrix[lineNumber][colNumber]!=nodeMatrix[lineNumber][colNumber-1])){
                            // Consideramos como certa a da linha horizontal e trocamos
                            var wrong = nodeMatrix[lineNumber][colNumber-1];
                            var right = nodeMatrix[lineNumber][colNumber];
                            console.log("conflito",wrong,right);
                            for(var i = 0;i<=lineNumber;i++){
                                for(var j = 0;j<=colNumber;j++){
                                    if(nodeMatrix[i][j]==wrong){
                                        nodeMatrix[i][j]=right;
                                    }
                                }
                            }
                        }
                    } 
                }
                // se tinha uma coisa na célula anterior
                if(horizontal[lineNumber][colNumber-1]!="Empty"&& nodeMatrix[lineNumber][colNumber] == -1){
                    if(horizontal[lineNumber][colNumber-1]=="HorLine"){ // Se for uma linha horizontal, é o mesmo nó
                        nodeMatrix[lineNumber][colNumber] = nodeMatrix[lineNumber][colNumber-1]
                    } else { // Se for outra célula, cria outro nó
                        nodeMatrix[lineNumber][colNumber] = node++;
                    }
                }
            }
             // Se tiver alguma coisa na célula seguinte e ainda não foi definida
            if(horizontal[lineNumber][colNumber]!="Empty"  && nodeMatrix[lineNumber][colNumber] == -1){
                if(colNumber==0){ // Se é na barra esquerda, o nó é zero
                    nodeMatrix[lineNumber][colNumber] = 0;
                } else if(horizontal[lineNumber][colNumber-1]=="HorLine"){ // Se for uma linha horizontal, é o mesmo nó
                    nodeMatrix[lineNumber][colNumber] = nodeMatrix[lineNumber][colNumber-1]
                } else { // Se for outra célula, cria outro nó
                    nodeMatrix[lineNumber][colNumber] = node++;
                }
            }
        }
    }
    return nodeMatrix;
}