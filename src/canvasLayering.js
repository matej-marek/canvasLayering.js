class Layer{
    constructor(size,name,whole,position){
        this.size=size;
        this.name=name;
        this.whole=whole;
        this.position=position||[0,0];
        this.whole.idCounter++;
        this.imageData="";
        this.id=this.whole.idCounter;
        this.positionLayer=this.whole.layers.length;
        this.canvas=document.createElement("canvas");
        this.canvas.width=this.size[0];
        this.canvas.height=this.size[1];
        this.context=this.canvas.getContext("2d");
        this.visible=true;
        this.imageData=this.context.getImageData(0,0,this.size[0],this.size[1]);
    }
    clear(){
        this.context.clearRect(0, 0, this.size[0], this.size[1])
    }
    importImage(data){
        var img = new Image();
        var that= this;
        img.src=data;
        img.id="foto";
        var pomer=img.width/img.height;
        setTimeout(function(){ 
        that.context.drawImage(img,0,0,that.size[0],that.size[1]);
        that.whole.render(); 
        }, 500);
        
    }
    up(){
        if(this.positionLayer!=this.whole.layers.length){
            var upper_layer=this.whole.layers[this.positionLayer+1];
            this.whole.layers[this.positionLayer+1]=this;
            this.whole.layers[this.positionLayer]=upper_layer;
            this.positionLayer++;
            upper_layer.positionLayer--;
        }
    }
    down(){
        if(this.positionLayer!=0){
            var lower_layer=this.whole.layers[this.positionLayer-1];
            this.whole.layers[this.positionLayer-1]=this;
            this.whole.layers[this.positionLayer]=lower_layer;
            this.positionLayer--;
            lower_layer.positionLayer++;
        }
    }
    visibility(){
        this.visible=!this.visible;
    }
    destroy(){
        this.whole.layers.splice(this.position,1);
    }
    createRect(r,g,b,width,height,left,top){
        r=r||255;
        g=g||255;
        b=b||255;
        width=width||this.size[0];
        height=height||this.size[1];
        left=left||0;
        top=top||0;
        this.context.fillStyle = "#"+r.toString(16).toUpperCase()+g.toString(16).toUpperCase()+b.toString(16).toUpperCase();
        this.context.fillRect(left,top,width,height);
        this.whole.render();
    }
}
class Canvas{
    constructor(size,workspace,style){
        this.size=size;
        this.layers=[];
        this.canvas=document.createElement("canvas");
        this.canvas.width=this.size[0];
        this.canvas.height=this.size[1];
        this.canvas.id="canvas-layers";
        this.canvas.style=style;
        this.idCounter=0;
        this.context=this.canvas.getContext("2d");
        document.getElementById(workspace).appendChild(this.canvas);
    }
    createLayer(name,size){
        size=size||this.size;
        name=name||"Layer "+ this.layers.length.toString(10);
        var layer= new Layer(size, name, this);
        this.layers.push(layer);
        this.render();
        return layer;
    }
    findLayer(name){
        var layerFind=null;
        this.layers.forEach(function(layer){
            console.log(layer.name,name);
            if(layer.name==name){
                layerFind=layer;
            }
        });
        return layerFind;
    }
    clear(){
        this.layers.forEach(function(layer){
            layer.clear();
        });
        this.render();
    }
    clearScene(){
        this.context.clearRect(0,0,this.size[0],this.size[1]);
    }
    render(){
        this.clearScene();
        var that= this;
        this.layers.forEach(function(layer){
            if(layer.visible){
                that.context.drawImage(layer.canvas,0,0,layer.size[0],layer.size[1]);
            }
        });   
    }
}