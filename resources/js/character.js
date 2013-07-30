var character = new Class({
	vars: {holder:false,charName:false,charIMG:false,isOnRange:false},
	anim: {standLIMIT:3},
	init: function(charName,ops,anim){
		var holder = $_('mapCharacters');
		var left = _body.offsetWidth-ops.right-67;
		var top = _body.offsetHeight-ops.bottom-100;
		var zIndex = top+100;

		var img = $C('IMG',{id:'char_'+charName,'.left':left,'.top':top,'.zIndex':zIndex},holder);
		this.vars = extend(this.vars,{'holder':holder,'charName':charName,'charIMG':img});
		this.anim = extend(this.anim,anim);
		if(!ops.noRange || ops.noRange === false){
			_zww.ellipse_registerEllipse(charName,{'X':70+left-(67/2),'Y':35+top+(100-40),'width':70,'height':35,'isOnRange':false,
				onRangeIn:function(){this.onRangeIn();}.bind(this),
				onRangeOut:function(){this.onRangeOut();}.bind(this)}
			);
		}
		this.stand();
	},
	stand: function(){
		var i = this.vars.charIMG;
		if(this.anim.standLIMIT == 1){i.src = 'char/'+this.vars.charName+'/stand/0.png';return;}
		if(i.animate){window.clearInterval(i.animate);i.animate = false;}

		i.animate = window.setInterval(function(){
			var num = i.src.match(/[0-9]+/);
			if(!i.inverse){num++;}else{num--;}
			if(num > this.anim.standLIMIT){num -= 2;i.inverse = true;};
			if(num < 0){num += 2;i.inverse = false;}
			i.src = 'char/'+this.vars.charName+'/stand/'+num+'.png';
		}.bind(this),500);
	},
	onRangeIn: function(){
		_zww.ellipse_setOnRange(this.vars.charName,true);
		if(this.vars.isOnRange){return;}this.vars.isOnRange = true;
		this.saySomething();
	},
	onRangeOut: function(){
		_zww.ellipse_setOnRange(this.vars.charName,false);
		this.vars.isOnRange = false;
		var m = $_('message_'+this.vars.charName);
		m.parentNode.removeChild(m);
	},
	saySomething: function(){
		var img = this.vars.charIMG;
		//FIXME: mapMessages a variable global
		var messageBoxID = 'message_'+this.vars.charName;
		var m = $_(messageBoxID);if(!m){var m = $C('DIV',{id:messageBoxID},$_('mapMessages'));}
		//m.innerHTML = 'holaaa!<ul><li>Hablame de tu gato perdido ...</li><li>¿Donde puedo comprar una caña de pescar?</li></ul>';
		m.innerHTML = 'holaaa!';
		m.style.top = img.offsetTop-m.offsetHeight;m.style.left = img.offsetLeft;
	}
});
