	function $_(id,obj,holder){
		var el = document.getElementById(id);if(!el){return null;}
		if(obj){for(var o in obj){if(o.indexOf('.')==0){el.style[o.replace(/^./,'')] = obj[o];continue;}el[o] = obj[o];}}
		if(holder){holder.appendChild(el);}
		return $fix(el);
	}
	function $fix(elem,obj,holder){
		elem = extend(elem,{
			$T: function(tag){ return this.getElementsByTagName(tag); },
			applyAttrib: function(obj){for(var o in obj){if(o.indexOf(".")==0){this.style[o.replace(/^./,"")] = obj[o];continue;}this[o] = obj[o];}return this;},
			empty: function(){while(this.firstChild){this.removeChild(this.firstChild);}return this;},
			isChildNodeOf: function(parent){var isChild = false;var child = this;while(child.parentNode && !isChild){if(child.parentNode == parent){var isChild = true;continue;}child = child.parentNode;}return isChild;},
			outerHeight: function(){var s = window.getComputedStyle(this,null);return (this.offsetHeight+parseInt(s.paddingTop)+parseInt(s.paddingBottom));},
			innerHeight: function(){var s = window.getComputedStyle(this,null);return (this.offsetHeight-parseInt(s.paddingTop)-parseInt(s.paddingBottom));},
			outerWidth: function(){var s = window.getComputedStyle(this,null);return (this.offsetWidth+parseInt(s.paddingLeft)+parseInt(s.paddingRight));},
			innerWidth: function(){var s = window.getComputedStyle(this,null);return (this.offsetWidth-parseInt(s.paddingLeft)-parseInt(s.paddingRight));}
		});
		if(obj){for(var o in obj){if(o.indexOf('.')==0){elem.style[o.replace(/^./,'')] = obj[o];continue;}elem[o] = obj[o];}}
		if(holder){holder.appendChild(elem);}
		return elem;
	}
	function $A(iterable){
		if(!iterable){return [];}
		if(iterable.toArray){return iterable.toArray();}
		var length = iterable.length || 0, results = new Array(length);
		while (length--) results[length] = iterable[length];
		results = extend(results,{
			append:function(arr){for(var a=0; a<arr.length; a++){this.push(arr[a]);}return this;},
			each: function(fun){for(var i=0; i<this.length; i++){fun.call(this,this[i],i);}},
			empty: function(){this.splice(0,this.length);return this;},
			find: function(elem){for(var i=0; i<this.length; i++){if(this[i]==elem){return i;}};return -1;},
			cleanEmptyValues: function(){for(var i=0; i<this.length; i++){if(this[i]==''){this.splice(i,1);}};return this;}
		});
		return results;
	}
	function $C(tag,obj,holder){var el = document.createElement(tag);return $fix(el,obj,holder);}
	function $T(tag,elem){if(elem){return elem.getElementsByTagName(tag);}return document.getElementsByTagName(tag);}

	function $execWhenExists(funcName,func){
		if(typeof window[funcName] != 'function'){
			var l = 'launcher_'+funcName+Math.floor(Math.random()*10000);
			$T('BODY')[0][l] = window.setInterval(function(){if(typeof window[funcName] == 'function'){func();window.clearInterval($T('BODY')[0][l]);}},100);
		}else{func();}
	}
	function $execWhenTrue(e,func){
		/*if($T("BODY")[0].l){return;}*/var a = eval(e);
		if(!a){var l = "launcher_"+e+Math.floor(Math.random()*10000);$T("BODY")[0][l] = window.setInterval(function(){var a = eval(e);if(a){func();window.clearInterval($T("BODY")[0][l]);}},100);
		}else{func();}
	}

	function $capitalize(str){return str.replace(/\w+/g,function(a){return a.charAt(0).toUpperCase()+a.slice(1).toLowerCase();});}
	function $getElementStyle(obj,styleProp){if(obj.currentStyle){return obj.currentStyle[styleProp];}if(window.getComputedStyle){return document.defaultView.getComputedStyle(obj,null).getPropertyValue(styleProp);}}
	function $getOffsetLeft(el){var ol = 0;while(el.parentNode){ol += el.offsetLeft-parseInt($getElementStyle(el,'padding-left'));el = el.parentNode;}return ol;}
	function $getOffsetTop(el){var ot = 0;while(el.parentNode){ot += el.offsetTop-parseInt($getElementStyle(el,'padding-top'));el = el.parentNode;}return ot;}
	function $getOffsetPosition(el){return el.getBoundingClientRect();}
	function $htmlEntitiesDecode(html){if(!html){return "";}return html.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");};
	function $htmlEntitiesEncode(html){if(!html){return "";}return html.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\\/g,"");};
	function $round(num){
		num = num.toString();
		if(num.indexOf('.') == -1){return num;}
		num = (parseFloat(num)*1000).toString().split('.')[0];
		if(parseInt(num[num.length-1])>4){if(num[0]!='-'){num = (parseInt(num)+10).toString();}else{num = (parseInt(num)-10).toString();}}
		num = (parseInt(num)/10).toString();
		num = num.split('.')[0];
		num = (parseInt(num)/100).toString();
		return num;
		
	}
	function $toUrl(elem){var str = '';for(var a in elem){str += a+'='+((elem[a].toString().match(/\&/)) ? escape(elem[a].toString()) : elem[a].toString())+'&';}return str.replace(/&$/,'');}

	function extend(destination,source){for(var property in source){destination[property] = source[property];}return destination;}
	function isEmpty(elem){if(!elem || elem == ""){return true;}return false;}
	function print_r(obj,i){
		var s="";if(!i){i = "    ";}else{i += "    ";}
		if(obj.constructor == Array || obj.constructor == Object){
			for(var p in obj){
				if(!obj[p]){s += i+"["+p+"] => NULL\n";continue;};
				if(obj[p].constructor == Array || obj[p].constructor == Object){
					var t = (obj[p].constructor == Array) ? "Array" : "Object";
					s += i+"["+p+"] => "+t+"\n"+i+"(\n"+print_r(obj[p],i)+i+")\n";
				}else{s += i+"["+p+"] => "+obj[p]+"\n";}
			}
		}
		return s;
	}
	function $parseForm(f){var ops = {};$A(f.$T("INPUT")).append(f.$T("TEXTAREA")).append(f.$T("SELECT")).each(function(el){if(el.type=="checkbox"){ops[el.name] = el.checked;return;}if(el.type=="radio" && !el.checked){return;}ops[el.name] = el.value;});return ops;}
	function jsonEncode(obj){if(JSON.stringify){return JSON.stringify(obj);}}
	function jsonDecode(str){
		if(isEmpty(str)){return {errorCode:999,errorDescription:"La cadena está vacía, revise la API o el COMANDO"};}
		if(str.match("<title>404 Not Found</title>")){return {errorCode:999,errorDescription:"La URL de la API es errónea: 404"};}
		if(!JSON || !JSON.parse){return eval("("+str+")");}
		try{return JSON.parse(str);}catch(err){return {errorCode:999,errorDescription:str};}
	}
	function jsonClassEncode(obj){
		var s='';
		if(obj.constructor == Array){s+='['};
		if(obj.constructor == Object){s+='{'};
		for(var p in obj){
			if(!obj[p]){s += "'"+p+"':NULL,";continue;};
			if(obj[p] == "[object HTMLDivElement]" && !isEmpty(obj[p].id)){obj[p] = "$_('"+obj[p].id+")";}
			if(obj[p].constructor == Array || obj[p].constructor == Object){s+="'"+p+"':"+jsonClassEncode(obj[p])+",";}
			else{s += "'"+p+"':"+JSON.stringify(obj[p].toString())+",";}
		}
		s = s.replace(/,$/,'');
		if(obj.constructor == Array){s+=']'};
		if(obj.constructor == Object){s+='}'};
		return s;
	}
	/*==INI-INCLUDE-FILES==*/
	function include_once(file,type){
		/* type = (css || js) */
		if(type){var ext = type;}else{/**/var ext = file.match(/(css|js)$/);if(!ext){return;}else{ext = ext[1];}/**/}
		var fileType = ext.replace(/js/i,'script').replace(/css/i,'link');
		var baseName = file.match(/[^\/]*$/);
		var included = false;
		$A($fix($T('HEAD')[0]).$T(fileType.toUpperCase())).each(function(elem){/**/if((elem.src && elem.src == file) || (elem.href && elem.href == file)){included=true;}/**/});
		if(!included){eval("include"+ext.toUpperCase()+"('"+file+"');");}
	}
	function includeJS(file){return $C('SCRIPT',{src:file,type:'text/javascript'},$T('head')[0]);}
	function includeCSS(file){return $C('LINK',{href:file,rel:'stylesheet',type:'text/css'},$T('head')[0]);}
	/* DEPRECATED */function wodernLoadCSS(file){includeCSS(file)}
	/* DEPRECATED */function wodernLoadJS(file){includeJS(file);}
	/*==END-INCLUDE-FILES==*/

	/*==INI-COOKIE-MANAGEMENT==*/
	function cookieTake(cookieName){var value = document.cookie.match('(?:^|;)\\s*' + cookieName.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)');return cookieName =  value ? value[1] : value;}
	function cookieSet(cookieName,value,expDays){var exdate = new Date();exdate.setDate(exdate.getDate()+expDays);document.cookie = cookieName+"="+escape(value)+((expDays==null) ? "" : ";expires="+exdate.toGMTString());}
	function cookieRemove(cookieName){document.cookie = cookieName+"=;expires=Thu, 01-Jan-1970 00:00:01 GMT";}
	function cookiesToObj(){
		var cookies = document.cookie.replace(/;[ ]?/g,";").split(";");if(isEmpty(cookies)){return {};}
		var obj = {};$A(cookies).each(function(elem){elem = elem.match(/([^=]*)=(.*)/);obj[unescape(elem[1])]=unescape(elem[2]);});return obj;
	}
	function cookiesToArr(){
		var cookies = document.cookie.replace(/;[ ]?/g,";").split(";");if(isEmpty(cookies)){return [];}
		var arr = [];$A(cookies).each(function(elem){elem = elem.match(/([^=]*)=(.*)/);arr.push({cookieName:unescape(elem[1]),cookieValue:unescape(elem[2])});});return arr;
	}
	/*==END-COOKIE-MANAGEMENT==*/

	var TEMPLATES = new Object();
	function $downloadTemplate(templatePath,callBack){
		if(TEMPLATES[templatePath]){callBack(TEMPLATES[templatePath]);
		}else{ajaxPetition(templatePath,"",function(ajax){TEMPLATES[templatePath]=ajax.responseText;callBack(ajax.responseText);});}
	}

	var Class = function(properties){
		function type(el,type){ return (el instanceof type);}
		var klass = function(){return (arguments[0] !== null && this.init && type(this.init, Function)) ? this.init.apply(this, arguments) : this;};
		klass.prototype = properties;klass.constructor = Class;return klass;
	};
	extend(Function.prototype,{
		argumentNames: function(){var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');return names.length == 1 && !names[0] ? [] : names;},
		bind: function(){if(arguments.length < 2 && typeof(arguments[0]) == "undefined"){return this};var __method = this, args = $A(arguments), object = args.shift();return function(){return __method.apply(object, args.concat($A(arguments)));}}
	});

	function ajaxObject(){
		var xmlhttp=false;
		try{xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}catch(E){xmlhttp = false;}}
		if(!xmlhttp && typeof XMLHttpRequest!='undefined'){xmlhttp = new XMLHttpRequest();}
		return xmlhttp;
	}
	function ajaxPetition(url,params,callback){
		if(!url){return;}if(!params){params = '';}
		var method = 'GET';if(url.match(/\.php$/)){method = 'POST';}

		var rnd = Math.floor(Math.random()*10000);
		var ajax = new ajaxObject();
		ajax.open(method,url+'?rnd='+rnd,true);
		ajax.onreadystatechange=function(){if(ajax.readyState==4){callback(ajax);return;}}
		ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		ajax.send(params);
	}

	var VAR_apps = Object();
	var VAR_appsPath = 'resources/apps/';
	function launchApp(appName,holder,params,remoteAppPath){
		var ap = (remoteAppPath) ? remoteAppPath : VAR_appsPath;
		if(VAR_apps[appName]){VAR_apps[appName].init(holder,params);return;}
		for(a in {'js':null,'css':null}){include_once(ap+appName+'/index.'+a,a);}
		$execWhenTrue("!isEmpty(window['"+appName+"'])",function(){VAR_apps[appName] = new window[appName](holder,params ? params : null);});
	}

	var VAR_schedules = Object();
	var VAR_schedulerRun = false;
	var VAR_schedulerDelay = 10000;
	function schedulerAdd(funcName,func){VAR_schedules[funcName] = func;}
	function schedulerExec(){if(!VAR_schedulerRun){return;}for(var a in VAR_schedules){VAR_schedules[a]();}}
	function schedulerRun(st){VAR_schedulerRun = st ? true : false;}
	function schedulerRestart(){clearInterval(window.scheduler);window.scheduler = setInterval(schedulerExec,VAR_schedulerDelay);}
	window.scheduler = setInterval(schedulerExec,VAR_schedulerDelay);

	function createThemeWindow(id){
		if($_("wod_"+id)){return $_("wod_"+id);}
		var w = $C("DIV",{className:"wodTheme",id:"wod_"+id});
		var d = $C("DIV",{className:"wodThemeHeaderLeft"},w);
		var d = $C("DIV",{className:"wodThemeHeaderRight"},d);
			$C("DIV",{className:"wodThemeHeaderCenter"},d);
		var d = $C("DIV",{className:"wodThemeContainerLeft"},w);
		var d = $C("DIV",{className:"wodThemeContainerRight"},d);
			$C("DIV",{className:"wodThemeContainerCenter",id:"wod_"+id+"_container",".position":"relative"},d);
		var d = $C("DIV",{className:"wodThemeFooterLeft"},w);
		var d = $C("DIV",{className:"wodThemeFooterRight"},d);
			$C("DIV",{className:"wodThemeFooterCenter"},d);
		return w;
	}
	function window_destroy(el,ev){
		while(el.parentNode && el.className!="wodTheme"){el = el.parentNode;}if(!el.parentNode){return;}
		var afterRemove = function(){};if(el.afterRemove){afterRemove=el.afterRemove;}
		el.parentNode.removeChild(el);if(ev){ev.stopPropagation();}afterRemove();
	}

	var VAR_wodInfo = {zIndex:40,marginRight:1};
	function createThemeInfo(id,style,indicatorOffsetLeft){return info_create(id,style,false,indicatorOffsetLeft);}/* DEPRECATED */
	function info_create(id,style,holder,indicatorOffsetLeft){
		var prev = $_("info_"+id);if(prev){if(holder){holder.appendChild(prev);}return prev;}
		if(!style){var style = {};}extend(style,{'id':'info_'+id,'className':'wodInfo',onclick:function(e){e.stopPropagation();},'.zIndex':VAR_wodInfo.zIndex++});
		if(!holder){holder = $T("BODY")[0];}

		var w = $C("DIV",style,holder);
		var d = w.infoIndicator = $C("DIV",{className:"wodInfoIndicator"},w);
		var d = $C("DIV",{className:"wodInfoHeaderLeft"},w);var d = $C("DIV",{className:"wodInfoHeaderRight"},d);$C("DIV",{className:"wodInfoHeaderCenter"},d);
		var d = $C("DIV",{className:"wodInfoContainerLeft"},w);var d = $C("DIV",{className:"wodInfoContainerRight"},d);
			w.infoContainer = $C("DIV",{className:"wodInfoContainerCenter",'infoWindow':w,id:"info_"+id+"_container",".position":"relative"},d);
		var d = $C("DIV",{className:"wodInfoFooterLeft"},w);var d = $C("DIV",{className:"wodInfoFooterRight"},d);$C("DIV",{className:"wodInfoFooterCenter"},d);

		var indicatorOffsetLeft = ((indicatorOffsetLeft) ? indicatorOffsetLeft : 10);
		if(indicatorOffsetLeft!="center"){if(indicatorOffsetLeft < 0){indicatorOffsetLeft = w.offsetWidth+indicatorOffsetLeft;};indicatorOffsetLeft+="px";}
		w.infoIndicator.style.backgroundPosition = indicatorOffsetLeft+" top";

		var pos = $getOffsetPosition(w);var rpos = ($T("BODY")[0].offsetWidth)-pos.left-pos.width;
		/* If the infoBox is out the page, fix it to the right border */
		if(rpos < VAR_wodInfo.marginRight){w.style.left = w.offsetLeft+rpos-VAR_wodInfo.marginRight+"px";w.infoIndicator.style.backgroundPosition = parseInt(indicatorOffsetLeft)+(rpos*-1)+VAR_wodInfo.marginRight+"px top";}
		return w;
	}
	function removeThemeInfo(el,ev){info_remove(el,ev);}/* DEPRECATED */
	function info_remove(el,ev){info_destroy(el,ev);}
	function info_destroy(el,ev){
		while(el.parentNode && el.className!="wodInfo"){el = el.parentNode;}
		if(!el.parentNode){return;}
		if(el.parentNode.className.match(/ pressed$/)){el.parentNode.className = el.parentNode.className.replace(/ pressed$/,'');}
		var afterRemove = function(){};if(el.afterRemove){afterRemove=el.afterRemove;}
		el.parentNode.removeChild(el);
		if(ev){ev.stopPropagation();}
		afterRemove();
	}

	function createGnomeButton(text,callback,variant){return gnomeButton_create(text,callback,false,variant);}/* DEPRECATED */
	function gnomeButton_create(text,callback,holder,variant){
		if(!variant){variant = "gnomeButton";}
		var bt = d = $C("DIV",{className:"button "+variant+"Unpressed"});
		bt.buttonContainer = d = $C("DIV",{className:"buttonCenter",innerHTML:text},$C("DIV",{className:"buttonRight"},$C("DIV",{className:"buttonLeft"},d)));
		bt.onmousedown = function(e){e.preventDefault();bt.className = bt.className.replace(variant+"Unpressed",variant+"Pressed");};
		bt.onmouseup = d.onmouseout = function(){bt.className = bt.className.replace(variant+"Pressed",variant+"Unpressed");}
		bt.onclick = function(e){callback(e,bt);};
		if(holder){holder.appendChild(bt);}
		return bt;
	}

	/*==INI-EFFECTS==*/
	function eTweenStart(elem,interval){
		if(!interval){interval=50;}
		if(elem.eTween){window.clearInterval(elem.eTween);}
		elem.eTweenMode = "decr";
		elem.fvalue = 0.0;
		elem.eTween = window.setInterval(function(){
			if(elem.eTweenMode == "incr"){fvalue = (parseFloat(elem.fvalue)+0.11)+"".substring(0,3);}
			else{fvalue = (parseFloat(elem.fvalue)-0.11)+"".substring(0,3);}
			if(fvalue>(0.9)){fvalue=1;elem.eTweenMode = "decr";}
			if(fvalue<(0.1)){fvalue=0;elem.eTweenMode = "incr";}
			elem.style.opacity = elem.fvalue = fvalue;
		},interval);
	}
	function eTweenStop(elem){
		if(elem.eTween){window.clearInterval(elem.eTween);}
		fvalue = parseFloat(elem.fvalue);
		elem.eTween = window.setInterval(function(){
			fvalue = (parseFloat(elem.fvalue)+0.11)+"".substring(0,3);
			if(fvalue>(0.9)){
				fvalue=1;
				elem.style.opacity = elem.fvalue = fvalue;
				window.clearInterval(elem.eTween);
				elem.eTween = false;
			}
			elem.style.opacity = elem.fvalue = fvalue;
		},50);
	}
	function eFadein(elem,callback,interval){
		if(!interval){interval=50;}
		var fvalue = 0.0;
		if(elem.eFade){window.clearInterval(elem.eFade);elem.eFade = false;fvalue = elem.style.opacity ? elem.style.opacity : 0.0;}
		elem.style.visibility = "visible";
		elem.style.opacity = elem.fvalue = fvalue;
		elem.eFade = window.setInterval(function(){
			fvalue = (parseFloat(elem.fvalue)+0.11)+"".substring(0,3);
			elem.style.opacity = elem.fvalue = fvalue;
			if(fvalue>(0.9)){
				elem.style.opacity = elem.fvalue = 1;
				window.clearInterval(elem.eFade);elem.eFade = false;
				if(callback){callback(elem);}
			}
		},interval);
	}
	function eFadeout(elem,callback,interval){
		if(!interval){interval=50;}
		var fvalue = 1;
		if(elem.eFade){window.clearInterval(elem.eFade);elem.eFade = false;fvalue = elem.style.opacity ? elem.style.opacity : 1;}
		elem.style.opacity = elem.fvalue = fvalue;
		elem.eFade = window.setInterval(function(){
			fvalue = (parseFloat(elem.fvalue)-0.11)+"".substring(0,3);
			elem.style.opacity = elem.fvalue = fvalue;
			if(fvalue<(0.1)){
				elem.style.visibility = "hidden";
				elem.style.opacity = elem.fvalue = 0;
				window.clearInterval(elem.eFade);elem.eFade = false;
				if(callback){callback(elem);}
			}
		},interval);
	}
	/*Time:la posicion del tiempo, Begin:tamaño inicial del contenedor, LeftOffset:tamaño que tiene que incrementar el contenedor, Duration: Debe ser mayor que time */
	function easeInOutCubic(t,b,c,d){if((t /= d / 2) < 1){return c / 2 * t * t * t + b;}return c / 2 * ((t -= 2) * t * t + 2) + b;}
	function eEaseHeight(elem,heightChange,callback,time,interval,absoluteHeight){
		if(!time){time = 1000;}
		if(!interval){interval = 50;}
		if(elem.eEaseH){window.clearInterval(elem.eEaseH);elem.eEaseH = false;}
		if(!elem.innerHeight){$fix(elem);}
		var initHeight = elem.innerHeight();var t = 0;
		if(absoluteHeight){heightChange = (heightChange-initHeight);}
		elem.eEaseH = window.setInterval(function(){
			var w = easeInOutCubic(t,initHeight,heightChange,time);
			t += interval;elem.style.height = w+"px";
			if(t >= time){elem.style.height = (initHeight+heightChange)+"px";window.clearInterval(elem.eEaseH);elem.eEaseH = false;if(callback){callback(elem);}}
		},time/interval);
	}
	function eEaseWidth(elem,widthChange,callback,time,interval,absoluteWidth){
		if(!time){time = 1000;}
		if(!interval){interval = 50;}
		if(elem.eEaseW){window.clearInterval(elem.eEaseW);elem.eEaseW = false;}
		if(!elem.innerWidth){$fix(elem);}
		var initWidth = elem.innerWidth();var t = 0;
		if(absoluteWidth){widthChange = (widthChange-initWidth);}
		elem.eEaseW = window.setInterval(function(){
			var w = easeInOutCubic(t,initWidth,widthChange,time);
			t += interval;elem.style.width = w+"px";
			if(t >= time){elem.style.width = (initWidth+widthChange)+"px";window.clearInterval(elem.eEaseW);elem.eEaseW = false;if(callback){callback(elem);}}
		},time/interval);
	}
	/*==FIN-EFFECTS==*/
