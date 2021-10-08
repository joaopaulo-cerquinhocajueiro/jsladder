function ToolBar(svg) {
    this.svg = svg;
//    this.pos = pos;
    this.elements = [new GElement('', 'ContactNO',    10,   0, this.svg),
                     new GElement('', 'ContactNC',    10,  80, this.svg), 
                     new GElement('', 'ContactRise',  10, 160, this.svg),
                     new GElement('', 'ContactFall',  10, 240, this.svg),
                     new GElement('', 'DrawLine',    130, 320, this.svg),
                     new GElement('', 'CoilNO',      130,   0, this.svg),
                     new GElement('', 'CoilNC',      130,  80, this.svg),
                     new GElement('', 'CoilSet',     130, 160, this.svg),
                     new GElement('', 'CoilReset',   130, 240, this.svg),
                     new GElement('', 'Eraser',      130, 400, this.svg),
                     new GElement('', 'Hand',        130, 480, this.svg),
                     new GElement('', 'ContactTON',   10, 320, this.svg),
                     new GElement('', 'ContactTOF',   10, 400, this.svg),
                     new GElement('', 'ContactTP',    10, 480, this.svg),
                     new GElement('', 'CoilUp',      250,   0, this.svg),
                     new GElement('', 'CoilDn',      250,  80, this.svg),
                     new GElement('', 'CoilTSet',    250, 160, this.svg),
                     new GElement('', 'CoilTReset',  250, 240, this.svg),
                     new GElement('', 'Contact0',    250, 320, this.svg),
                     new GElement('', 'ContactDone', 250, 400, this.svg),
                     new GElement('', 'ContactComp', 250, 480, this.svg)];//,
                     //new GElement('', 'Contact',  250, 480, this.svg)]
    this.selectedShape = this.elements[10]; // Hand
    this.selectedShape.status = "selected"
//    this.svg.line(0,0,50,50).stroke({width:4})
    this.elements.forEach(element => {
        element.toolTip = "off";
        element.update();
        
        
        element.shape.mousemove(function(){
          element.toolTip = "on";
          element.update();
        });

        element.shape.mouseout(function(){
             element.toolTip = "off";
             element.update();
        });

        element.update();

        var that = this;
        //console.log(that);    
        element.shape.click(function(){
            //console.log(element,that,this,that.selectedShape, element.status)
            that.selectedShape.status="offline";
            that.selectedShape.update();
            element.status = "selected";
            element.update();
            that.selectedShape = element;
            //console.log(that.selectedShape, element.status)
        });
    });
    

}
