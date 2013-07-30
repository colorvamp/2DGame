#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
animBase = """<html>
<head>
	<script type='text/javascript' src="http://sombraencounter.com/testing/coreJS/coreJS.js"></script>
	<script type='text/javascript'>
		var VAR_animLimit = %num%;
		function animate(){
			var a = $_('anim');
			if(a.firstChild != a.lastChild){return;}
			var i = a.firstChild;
			var num = i.src.match(/[0-9]+/);
			if(!a.inverse){num++;}else{num--;}
			if(num > VAR_animLimit){num -= 2;a.inverse = true;};
			if(num < 0){num += 2;a.inverse = false;}
			var src = i.src.replace(/[0-9]+\.png$/,num+'.png');
			var n = $C('IMG',{'src':src,'.opacity':0},a);
			eFadein(n,false,10);
			eFadeout(i,function(el){el.parentNode.removeChild(el);},30);
		}
	</script>
	<style>
		#anim{margin:100px;width:70px;height:100px;position:relative;}
		#anim > img{top:0;left:0;width:70px;height:100px;position:absolute;}
		#anim > img:last-child{z-index:2;}
	</style>
</head>
<body onload='window.setInterval(animate,800);'>
	<div id='anim'><img src='char/%name%/stand/0.png'/></div>
</body>
</html>""";

for char in os.listdir('./char/'):
	print 'FOUND ('+char+'):';
	count = 0;
	for u in os.listdir('./char/'+char+'/stand/'):count += 1;
	if count == 1:print ' NOT ENOUGHT IMAGES TO ANIM -> '+str(count);continue;
	#escribir el fichero
	f = open('anim_'+char+'.html','w');
	f.write(animBase.replace('%num%',str(count-1)).replace('%name%',char));
	f.close();
	print ' PROCESED IMAGES -> '+str(count);
