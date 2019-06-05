// function populateFrom(y,x,horizontal,vertical,elements, checked){
//     console.log(horizontal)
//     var previous = []
//     // console.log(x,y,vertical[x-1][y]);
//     elements.forEach(element => {
//         if ((element.i == y) && (element.j == x-1)){
//             previous.push(element.index);
//         }
//     });
//     return previous;
// }

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'teste.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function codeRepr(element){
    var text;
    switch (element.type) {
        default:
            text = element.type + "(" + element.name + ", node" + element.i + ")";
            break;
    }
    return text;
}


function makeSequence(inOuts,contacts,coils){
    var novoInOuts = inOuts;
    var sequence = [];

    function solveRep(contact){
        // console.log(contact);
        sequence.push(codeRepr(contact));
        // console.log(codeRepr(contact));
        if(contact.i != 0){
            var inOutNode = inOuts.find(node=>{return node.number==contact.i;});
            var contactIndexes = inOutNode.outputs;
            contactStack =  contactStack.concat(contactIndexes);
            for(var i = 0;i<contactIndexes.length-1;i++){
                sequence.push("OR();");
            }

        }
    }

    var contactStack = [];
    while(coils.length>0){
        item = coils.pop(); // Get the last coil
        var actualNode = item.i;
        sequence.push(codeRepr(item));
        var toBeRemoved = []; // needed to remove the coils from the list after using them
        coils.forEach((coil,cIndex) =>{
            // console.log(coil,cIndex);
            if(coil.i==actualNode){ // Check if the coil is on the same node as the previous one.
                sequence.push(codeRepr(coil) + ";");
                // sequence.push("DUP();");
                toBeRemoved.push(cIndex);
                // console.log("É mesmo nó.")
            }
        });
        // console.log(coils);
        toBeRemoved.reverse().forEach(cIndex =>{
            coils.splice(cIndex,1);
        });
    }
    while(novoInOuts.length>0){
        // console.log(coils);
        var inOutNode = novoInOuts.pop();
        console.log(inOutNode);
        if (inOutNode.number != 0){
            var text = "node" + inOutNode.number + " = ";
            if(inOutNode.outputs.length>1){
                text += "or( ";
                text += inOutNode.outputs.map(contactIdx => {return codeRepr(contacts[contactIdx])}).join(", ");
                text += ");";
            } else if(inOutNode.outputs.length == 1){
                var contact = contacts[inOutNode.outputs[0]];
                text += codeRepr(contact) + ";";
            } else{
                text += "0;"
            }
            sequence.push(text);    
        } 
        // var contactIndexes = inOutNode.outputs;
        // contactStack =  contactStack.concat(contactIndexes);
        // // console.log(contactStack,contactIndexes);
        // sequence.push(" node" + actualNode + " = ");
        // for(var i = 0;i<contactIndexes.length-1;i++){
        //     sequence.push("OR();");
        // }
        // // console.log(sequence,contactStack);
        // while(contactStack.length>0){
        //     solveRep(contacts[contactStack.pop()]);
        //     // console.log(contactStack);
        // }
        console.log(sequence);
    }
// while(novoInOuts.length>0){
    //     var node = novoInOuts.shift();
    //     node.inputs(f)
    //     console.log(node.number,node.inputs,node.outputs);
    // }
    return sequence;
}

function init() {
    loadJSON(function(response) {
     // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        var content = document.getElementById('content');
        var rep = '<h1>Contents of json file</h1>';
        rep += '<ul>';
        var fields = ['horSize', 'verSize', 'variables', 'horizontal', 'vertical']
        var code = document.getElementById('code');
        var codeText = "// Code automatically generated from ladder\n\n#include \"arduinoladder.h\"\n\n// Variables\n"
        fields.forEach(element => {
           rep += '<li> ' + element +' '+ actual_JSON[element] + '</li>';
        });
        var inputPins = [2,3,4,5,6,7];
        var outputPins = [8,9,10,11,12,13];
        var indexIn = 0;
        var indexOut = 0;
        actual_JSON['variables'].forEach(variable => {
           rep += '<li> ' + variable.name + ' is ' + variable.type + ' </li>';
           if (variable.type == 'input'){
               codeText += 'const int pin' + variable.name + ' = ' + inputPins[indexIn++] + ';\n';
           }
           index = 0;
           if (variable.type == 'output'){
               codeText += 'const int pin' + variable.name + ' = ' + outputPins[indexOut++] + ';\n';
           }
        });
        rep += '</ul>'
//        content.innerHTML = rep;
        content.innerHTML += '<h1>Node Representation</h1>';
        var nodes = nodeRepr(actual_JSON);
        text = ''
        nodes.forEach(line =>{
            text += line +'<br/>';
        });    
        content.innerHTML += text;
        var htmlmatrix = document.getElementById('matrix');
        var horizontal = actual_JSON['horizontal'];
        var vertical = actual_JSON['vertical'];
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
        // console.log(elements);
        htmlmatrix.innerHTML += '<h1>Elements</h1>';
        htmlmatrix.innerHTML += '<h3>Contacts</h3>';
        contacts.sort(function(a,b){
            return a.o-b.o;
        }).forEach(item =>{
            htmlmatrix.innerHTML += item.type + '(' + item.name + ') from ' + item.i + ' to ' + item.o + '<br/>';
        });
        htmlmatrix.innerHTML += '<h3>Coils</h3>';
        coils.sort(function(a,b){
            return a.i-b.i;
        }).forEach(item =>{
            htmlmatrix.innerHTML += item.type + '(' + item.name + ') from ' + item.i + '<br/>';
        });

        // inOuts is used to map the contacts connected to each node
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
        console.log(inOuts,contacts,coils);

        console.log("Sequencia a partir de inOuts");
        sequence = makeSequence(inOuts,contacts,coils);
        console.log(sequence);
        htmlmatrix.innerHTML += '<h1>Sequencing</h1>';



        codeText += '\n';
        actual_JSON['variables'].forEach(variable => {
            codeText += 'int ' + variable.name +';\t// '+variable.type+'\n';
        });
        codeText += '\nvoid setup(){\n';
        actual_JSON['variables'].forEach(variable => {
            switch (variable.type) {
                case 'input': // define como input
                    codeText += '\tIO(pin' + variable.name + ', INPUT);\n';
                    // codeText += '\tdigitalWrite(pin' + variable.name + ', LOW);\n\n';
                    break;
                case 'output': // define como saída, com valor inicial 0
                    codeText += '\tIO(pin' + variable.name + ', OUTPUT);\n';
                    codeText += '\tpin' + variable.name + '.write(LOW);\n';
                    break;
                case 'counter': // não faz nada
                    codeText += '\t' + variable.name + ' = 0;\n';
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
            if(variable.type=='input'){
                codeText += '\t' + variable.name + ' = digitalRead(pin' + variable.name + ');\n';
            }
        });
        codeText += '\n\t//Execute the code\n\t';
        /// Here goes the code to be executed
        codeText += sequence.reverse().join('\n\t');
        codeText += '\n\n\t//Write all outputs\n';
        actual_JSON['variables'].forEach(variable => {
            if(variable.type=='output'){
                codeText += '\tdigitalWrite(pin' + variable.name + ', ' + variable.name + ');\n';
            }
        });
        codeText += '}\n\n';
        code.innerHTML = codeText;

        
        // // Get the contacts that have the actualNode as outputs
        // var inOutNode = inOuts.find(node=>{return node.number==actualNode;});
        // var contactIndexes = inOutNode.outputs;
        // var splits = [];
        // // for n contacts in a node, have to get n-1 ORs
        // for(var i = 0; i < (contactIndexes.length-1); i++){
        //     sequence.push("OR");
        // }
        // while(contactIndexes.length>0){
        //     thisContactIndex = contactIndexes.pop();
        //     thisContact=contacts[thisContactIndex];
        //     sequence.push(codeRepr(thisContact));
        //     actualNode = thisContact.i;
        //     if (actualNode>0){
        //         var inputs = inOuts.find(node=>{
        //             return node.number==actualNode;
        //         }).inputs; 
        //         // console.log(inputs);
        //     }
        //     // console.log(thisContact);
        // }
        // console.log(sequence);
    });

};



// function graphMap(contacts,initial,final){
//     if(hasPath(contacts,initial,final)){
//         var directContacts = contacts.filter(contact => {
//             return (contact.i == initial && contact.o == final)
//         });
//         // console.log(directContacts);
//         if(directContacts.length>1){
//             return "or("+directContacts.join(",")+")";
//         } else if(directContacts.length>0){
//             return codeRepr(directContacts[0]);
//         } else {
//             var links = [];
//             for(var intNode = initial + 1;intNode<final;intNode++){
//                 if(hasPath(contacts,initial,intNode) && hasPath(contacts,intNode,final)){

//                 }
//                 links.push(graphMap(contacts,intNode,final));
//             }
//             return "and("+links.join(",")+")";
//         }
//         if (initial == final){
//             return " ";
//         } else if (0==0){
//             return "-";
//         } else {
//             return "+";
//         }
//     } else {
//         return "";
//     }

// }

function hasPath(contacts,initial,final){
    nodes = [initial];
    // console.log(nodes.filter(node=>{return node == final}).length);
    while(nodes.length>0 && nodes.filter(node=>{return node == final}).length==0){
        // console.log("entrou");
        var node = nodes.splice(0,1)[0];
        var inContacts = contacts.filter(contact=>{
            return contact.i == node;
        });
        inContacts.forEach(contact=>{
            nodes= nodes.concat(contact.o);
        });
        // console.log(nodes,final);
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
            // console.log(lineNumber,colNumber,nodeMatrix[lineNumber][colNumber])
        // }
            // if((lineNumber== 1) && (colNumber == 2)){
            //     // console.log(lineNumber,colNumber,matrix[lineNumber][colNumber])
            //     newMatrix[lineNumber][colNumber] = 0;
            // }
        }
    }
    // console.log(nodeMatrix);
    return nodeMatrix;
}

document.addEventListener('DOMContentLoaded', init, false);
