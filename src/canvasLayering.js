class Layer{
    constructor(size,name,whole,position){
        this.size=size;
        this.name=name;
        this.whole=whole;
        this.position=position||[0,0];
        this.whole.idCounter++;
        this.layerData=[];
        this.layerImage=[];
        this.id=this.whole.idCounter;
        this.positionLayer=this.whole.layers.length;
        this.canvas=document.createElement("canvas");
        this.canvas.width=this.size[0];
        this.canvas.height=this.size[1];
        this.context=this.canvas.getContext("2d");
        this.visible=true;
        this.rgb=[];
        this.ycbcr=[];
        this.alpha=[];
        this.jas=0;
        this.alphaProcesingData=100;
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
    rotate(angle){
        this.layer.scene.context.rotate(angle * Math.PI / 180);
        this.ImageData();
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
    RGBtoYCbCr(){
        var width = this.size[0];
        var height= this.size[1];
        var pocethodnot= width*height*3;
        var data = this.rgb;
        var ycbcr=[];
        for(var i=0; i<pocethodnot;i=i+3){
            var r =data[i]
            var g =data[i+1];
            var b = data[i+2];
            var y = Math.floor(r*0.299+g*0.587+b*0.114);
            var cb= Math.floor(r *(-0.16874)+g*(-0.33126)+ b*0.50000 + 128);
            var cr=Math.floor(r*0.50000+g*(-0.41869)+ b*(-0.08131) + 128);
            ycbcr.push(y,cb,cr);
        }
        this.ycbcr=ycbcr;
        this.ImageData();
    }
    YCbCrtoRGB(){   
        var ycbcr=this.ycbcr;
        var rgb = this.rgb;
        for(var i=0;i<ycbcr.length;i=i+3){
            rgb[i]=Math.floor(ycbcr[i]+(ycbcr[i+2]-128)*1.402);
            rgb[i+1]=Math.floor(ycbcr[i]+(ycbcr[i+1]-128)*-0.34414+(ycbcr[i+2]-128)*-0.71414);
            rgb[i+2]=Math.floor(ycbcr[i]+(ycbcr[i+1]-128)*1.772);
        }
        this.ImageData();
    }
    brightness(value){
        var EV = value-this.jas;
        this.jas=value;
        var sirka=this.size[0];
        var vyska=this.size[1];
        var data=this.ycbcr;
        var pocetdata=sirka*vyska*3;
        var coef=Math.pow(2,EV);
        for(var x=0;x<=pocetdata;x+=3){
            var jas = Math.floor(data[x]*coef);
            if(jas<255){
              data[x]=jas;
            }
            else{
              data[x]=255;
            }
        }
        this.YCbCrtoRGB()
    }
    alphaProcesing(procent){
        if(procent<0){
            procent=0;
        }
        else if(procent>100){
            procent=100;
        }
        var length=this.alpha.length;
        for(var i=0;i<length;i++){
            var hodnota=(this.alpha[i]/this.alphaProcesingData)*procent;
            if(hodnota>255){
                this.alpha[i]=255;
            }
            else{
                this.alpha[i]=hodnota;
            }
        }
        this.ImageData();
        this.alphaProcesingData=procent;
        canvas.render();
    }
    
    ImageDataStarted(){
        this.layerImage=this.layer.scene.context.getImageData(0,0,this.size[0],this.size[1]);
        this.layerData=this.layerImage.data;
        this.rgb=[];
        this.alpha=[]
        for(var i=0; i<this.size[0]*this.size[1]*4;i=i+4){
            this.rgb.push(this.layerData[i]);
            this.rgb.push(this.layerData[i+1]);
            this.rgb.push(this.layerData[i+2]);
            this.alpha.push(this.layerData[i+3]);
        }
        this.ImageData();
        console.log(this.layerImage)
    }
    /* analyze and make Image Data for render */
    ImageData(){
        var width = this.size[0];
        var height= this.size[1];
        var pocethodnot= width*height*3;
        var plus=0;
        for(var i=0;i<pocethodnot;i=i+3){
            this.layerData[i+plus]=this.rgb[i]
            this.layerData[i+1+plus]=this.rgb[i+1]
            this.layerData[i+2+plus]=this.rgb[i+2]
            this.layerData[i+3+plus]=this.alpha[plus];
            plus++;
        }
        this.layer.scene.context.putImageData(this.layerImage,0,0);
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
        this.histogramDataY=[];
        this.histogramDataR=[];
        this.histogramDataG=[];
        this.histogramDataB=[];
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
        this.histogram();
    }
    histogram(){
        var data = this.context.getImageData(0,0,this.size[0],this.size[1]).data;
        var y=[];
        var r=[];
        var g=[];
        var b=[];
        for(var i=0;i<256;i++){
            y.push(0);
            r.push(0);
            b.push(0);
            g.push(0);
        }
        for(var x=0;x<this.size[0]*this.size[1]*4;x=x+4){
            var ynew= Math.floor(0.3*data[x]+0.59*data[x+1]+0.11*data[x+2])
            y[ynew]++;
            r[data[x]]++;
            g[data[x+1]]++;
            b[data[x+2]]++;
        }
        this.histogramData=[];
        this.histogramDataY.push(y);
        this.histogramDataR.push(r);
        this.histogramDataG.push(g);
        this.histogramDataB.push(b);
    }
}
