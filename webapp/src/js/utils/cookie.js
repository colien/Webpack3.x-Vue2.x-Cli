
(function (global, factory) {
	/* eslint-disable no-undef */
	// CommonJS、CMD规范检查
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	// AMD规范检查
	typeof define === 'function' && define.amd ? define(factory) : (global.CookieUtils = factory());
	/* eslint-enable no-undef */
})(this, function () { 
	//写cookies 
	function setCookie(name,value,time){
		var strsec = getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec*1);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+" ; domain=" + buildDomain().domain + " ; path=/";
	}
	function getsec(str){
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
		if (str2=="s"){
			return str1*1000;
		}
		else if (str2=="h"){
			return str1*60*60*1000;
		}
		else if (str2=="d"){
			return str1*24*60*60*1000;
		}
	}
	//读取cookies 
	function getCookie(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	//删除cookies 
	function delCookie(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null)
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}

	/* 构建域名  */
	function buildDomain(){
		var host = window.location.host;
		var index = parseInt(host.indexOf(".khticket"));
		var domain = "localhost";
		var condition = "localhost";
		if(index > -1){
			domain = host.substring(index);
			var urlTemp = host.substring(0,index);
			var devCondition = urlTemp.substring(urlTemp.indexOf("www")+3);
			if(devCondition != ""){
				condition = devCondition;
			}else{
				condition = "";
			}
		}
		return {
			domain : domain,
			condition : condition
		}
	}

	return {
		setCookie : setCookie,
		getCookie : getCookie,
		delCookie : delCookie,
		buildDomain : buildDomain
	}
})
