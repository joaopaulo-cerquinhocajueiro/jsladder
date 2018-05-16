function ToolBar(svg) {
    this.svg = svg;
//    this.pos = pos;
    this.elements = [new ContactNO('',10,000,this.svg),
                     new ContactNC('',10,100,this.svg), 
                     new ContactRise('',10,200,this.svg),
                     new ContactFall('',10,300,this.svg),
                     new DrawLine(130,400,this.svg),
                     new CoilNO('',130,000,this.svg),
                     new CoilNC('',130,100,this.svg),
                     new CoilSet('',130,200,this.svg),
                     new CoilReset('',130,300,this.svg),
                     new Eraser(130,500,this.svg),
                     new Hand(130,600,this.svg),
                     new ContactTON('',10,400,this.svg),
                     new ContactTOF('',10,500,this.svg),
                     new ContactTP('',10,600,this.svg)]
    this.selectedShape = this.elements[10];
    this.selectedShape.status = "selected"
//    this.svg.line(0,0,50,50).stroke({width:4})
    this.elements.forEach(element => {
        element.update();
        // element.shape.mouseover(function(){
        //     element.status = "selected";
        //     element.update();
        //     //console.log(element);
        // });
        that = this;    
        element.shape.click(function(){
            console.log(that.selectedShape, element.status)
            that.selectedShape.status="offline";
            that.selectedShape.update();
            element.status = "selected";
            element.update();
            that.selectedShape = element;
            console.log(that.selectedShape, element.status)
        });
    });
    

}
