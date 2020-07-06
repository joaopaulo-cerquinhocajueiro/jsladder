var horz,vert;
SVG.on(document, 'DOMContentLoaded', function() {
    console.log(jsonObject);
    horz = jsonObject.horSize;
    vert = jsonObject.verSize;
    var inputs = [];
    var memories = [];
    var outputs = [];
    jsonObject.variables.forEach(variable => {
        if (variable.type == 'input'){
            inputs.push(variable.name);
        }
        if (variable.type == 'memory'){
            memories.push(variable.name);
        }
        if (variable.type == 'output'){
            outputs.push(variable.name);
        }
    });
    var svgTable = SVG('table').size('100%', '100%').viewbox(0,0,800,600);
    var svgIO = SVG('io').size('100%', '100%').viewbox(0,0,200,600);;

    io = new IOView(svgIO, inputs, memories, outputs);
    elementTable = new ElementTable(svgTable, horz, vert, io.coisos);
    elementTable.writeJson(jsonObject);
    io.writeJson(jsonObject);
    elementTable.ioElements = io.coisos;
    elementTable.simulating = true;
});


// var buttonInputs = [];
// var dispMemories = [];
// var dispOutputs = [];

function indexFromXY(x,y){
    return y*horz+x;
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }


function resize(width,height) {
//    if (width < 200) {
//        horz = floor(width/20);
//    } else {
//        horz = 10;
//    }
//    if (height < 140) {
//        vert = floor(height/20);
//    } else {
//        vert = 7;
//    }
    colSize = floor(0.9*width / (1.8*horz));
    linSize = floor(0.9*height / (1,1*vert));
    if (colSize < linSize) {
        linSize = colSize;
//        vert = floor(height/linSize);
    } else {
        colSize = linSize;
//        horz = floor(width/colSize);        
    }
//    console.log("colSize: "+colSize);
//    console.log("linSize: "+linSize);
}



function eraseAll() {
    elementTable.eraseAll();
}

function saveCode(){
    var filename = "teste";
    var blob = new Blob([elementTable.json()], {type: "text/json;charset=utf-8"});
    saveAs(blob, filename+".json");
 //   console.log(elementTable.json())
}

function simulate(e){
    elementTable.simulating = ! elementTable.simulating;
    var simButton = e.target;
    if(elementTable.simulating){
        simButton.style.backgroundColor = "#4C50AF";
        simButton.innerHTML = "Stop simulation";
    } else {
        simButton.style.backgroundColor = "#4CAF50";
        simButton.innerHTML = "Simulate";
    }
    //console.log(elementTable.simulating);
}


