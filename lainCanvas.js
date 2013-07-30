var lainCanvas = new Class({
	/* blurCompensation: en ocasiones los procesadores de gama baja fallan bastante en operaciones de
	 * doble precisión, por lo que la imágen blur se verá desplazada, más aún con cada sample, este
	 * parámetro se usa para corregir la desviación en cada sample.
	 */
	vars: {blurCompensation:0},
	init: function(){},
	getContext: function(elem){
		if(!elem.tagName && elem.tagName.toUpperCase() != "CANVAS"){return;}
		var ctx = elem.getContext("2d");ctx.canvasWidth = elem.width;ctx.canvasHeight = elem.height;
		ctx = extend(ctx,{
			$arc: function(x,y,radius,startAngle,endAngle,anticlockwise){this.arc(x,y,radius,startAngle,endAngle,anticlockwise);return this;},
			$at: function(obj){for(var o in obj){this[o] = obj[o];}return this;},
			$beginPath: function(){this.beginPath();return this;},
			$bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y){this.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);return this;},
			$clip: function(){this.clip();return this;},
			$closePath: function(){this.closePath();return this;},
			$createLinearGradient: function(x1,y1,x2,y2,start,end){var g = this.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,start);g.addColorStop(1,end);this.fillStyle = g;return this;},
			$drawImage: function(img,x,y,w,h){/* drawImage no permite pasar false o null como w o h */if(!w || !h){this.drawImage(img,x,y);return this;}else{this.drawImage(img,x,y,w,h);return this;}},
			$empty: function(offsetTop,offsetRight,offsetBottom,offsetLeft){
				offsetTop = parseFloat(offsetTop) || 0;offsetRight = parseFloat(offsetRight) || 0;offsetBottom = parseFloat(offsetBottom) || 0;offsetLeft = parseFloat(offsetLeft) || 0;
				this.clearRect(0+offsetLeft,0+offsetTop,this.canvasWidth+offsetRight,this.canvasHeight+offsetBottom);return this;
			},
			$fill: function(){this.fill();return this;},
			$fillRect: function(x,y,width,height){this.fillRect(x,y,width,height);return this;},
			$fillText: function(text,x,y){this.fillText(text,x,y);return this;},
			$horizontalLine: function(y){this.$beginPath().$moveTo(0,y-1).$lineTo(this.canvasWidth,y-1).$lineTo(this.canvasWidth,y).$lineTo(0,y).$closePath().$fill();return this;},
			$lineTo: function(x,y){this.lineTo(x,y);return this;},
			$moveTo: function(x,y){this.moveTo(x,y);return this;},
			$restore: function(){this.restore();return this;},
			$save: function(){this.save();return this;},
			$scale: function(x,y){this.scale(x,y);return this;},
			$stroke: function(){this.stroke();return this;},
			$strokeText: function(text,x,y){this.strokeText(text,x,y);return this;},
			$translate: function(x,y){this.translate(x,y);return this;}
		});
		return ctx;
	},
	newImage: function(src,callback){var img = new Image();img.onload = function(){callback(img);};img.src = src;},
	image_resize: function(src,width,height,adjust,callback){return this.imageResize(src,width,height,adjust,callback);},
	imageResize: function(src,width,height,adjust,callback){
		this.newImage(src,function(img){
			var $maxWidth = width;var $maxHeight = height;var $imgWidth = img.width;var $imgHeight = img.height;
			$imgRatio = $imgWidth/$imgHeight;$maxRatio = $maxWidth/$maxHeight;

			switch(adjust){
				case 'max':if($imgRatio>$maxRatio){$maxHeight = $imgHeight * ($maxWidth/$imgWidth);}else{$maxWidth = $imgWidth * ($maxHeight/$imgHeight);}break;
				case 'min':if($imgRatio>$maxRatio){$maxWidth = $imgWidth * ($maxHeight/$imgHeight);}else{$maxHeight = $imgHeight * ($maxWidth/$imgWidth);}break;
				case 'none':break;
				default:return;
			}

			if(width > $maxWidth){width = $maxWidth;}
			if(height > $maxHeight){height = $maxHeight;}

			var canvas = $C('CANVAS',{'width':width,'height':height});var ctx = this.getContext(canvas);

			$offsetLeft = (width - $maxWidth)/2;
			$offsetTop = (height - $maxHeight)/2;
			ctx.drawImage(img,$offsetLeft,$offsetTop,$maxWidth,$maxHeight);

			callback(canvas.toDataURL('image/png'));
		}.bind(this));
	},
	imageBlur: function(img,passes){
		var canvas = $C('CANVAS',{width:img.width,height:img.height});
		var ctx = this.getContext(canvas).$drawImage(img,0,0);
		img = ctx.getImageData(0,0,img.width,img.height);
		var i,j,k,n,w = img.width,h = img.height,im = img.data,rounds = passes || 0,pos = step = jump = inner = outer = arr = 0;
		for(n=0;n<rounds;n++){for(var m=0;m<2;m++){
			outer = h;inner = w;step = 4;
			if(m){outer = w;inner = h;step = w*4;}
			for(i=0;i<outer;i++){jump = m === 0 ? i*w*4 : 4*i;for(k=0;k<3;k++){
				pos = jump+k;arr = 0;arr = im[pos]+im[pos+step]+im[pos+step*2];im[pos] = Math.floor(arr/3);arr += im[pos+step*3];im[pos+step] = Math.floor(arr/4);
				arr += im[pos+step*4];im[pos+step*2] = Math.floor(arr/5);
				for(j = 3; j < inner-2; j++){arr = Math.max(0,arr-im[pos+(j-2)*step]+im[pos+(j+2)*step]);im[pos+j*step] = Math.floor(arr/5);}
				arr -= im[pos+(j-2)*step];im[pos+j*step] = Math.floor(arr/4);arr -= im[pos+(j-1)*step];im[pos+(j+1)*step] = Math.floor(arr/3);
			}}
		}}
		ctx.putImageData(img,0,0);
		return canvas.toDataURL('image/png');
		return img;
	},
	blurEffect: function(r,samples){
		if(!samples){samples = 2;}
		var blur = $C('canvas',{width:r.width,height:r.height});var bctx = this.getContext(blur);bctx.drawImage(r,0,0);
		var aux = $C('canvas',{width:r.width,height:r.height});var actx = this.getContext(aux);

		var pW = r.width/4;var pH = r.height/4;
		/* blurCompensation normalmente debe ser 0 */
		for(var i = 0;i<samples;i++){actx.drawImage(blur,0,0,pW,pH);bctx.$empty().drawImage(aux,0,0,pW,pH,0,0,r.width,r.height);}
		return blur;
	}
});
