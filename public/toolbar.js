function ToolBar(svg) {
    this.svg = svg;
//    this.pos = pos;
    this.elements = [new GElement('', 'ContactNO',   10,   0, this.svg),
                     new GElement('', 'ContactNC',   10, 100, this.svg), 
                     new GElement('', 'ContactRise', 10, 200, this.svg),
                     new GElement('', 'ContactFall', 10, 300, this.svg),
                     new GElement('', 'DrawLine',   130, 400, this.svg),
                     new GElement('', 'CoilNO',     130, 000, this.svg),
                     new GElement('', 'CoilNC',     130, 100, this.svg),
                     new GElement('', 'CoilSet',    130, 200, this.svg),
                     new GElement('', 'CoilReset',  130, 300, this.svg),
                     new GElement('', 'Eraser',     130, 500, this.svg),
                     new GElement('', 'Hand',       130, 600, this.svg),
                     new GElement('', 'ContactTON',  10, 400, this.svg),
                     new GElement('', 'ContactTOF',  10, 500, this.svg),
                     new GElement('', 'ContactTP',   10, 600, this.svg)]
    this.selectedShape = this.elements[10]; // Hand
    this.selectedShape.status = "selected"
//    this.svg.line(0,0,50,50).stroke({width:4})
    this.elements.forEach(element => {
        element.update();
        // element.shape.mouseover(function(){
        //     element.status = "selected";
        //     element.update();
        //     //console.log(element);
        // });
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
