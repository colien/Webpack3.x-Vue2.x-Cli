/*
	使用案例一：普通按钮
	functon divClick(){
		var capacity = new Capacity();
		capacity.width="200px";
		capacity.head_content = "温馨提示";
		capacity.body_content = "对于一些指定的供应商我们会进行转码！";
		capacity.foot_item = 3;
		capacity.foot_itemContent[0] = "我知道了";
		capacity.foot_itemContent[1] = "确定";
		capacity.foot_itemContent[1] = "取消";
		capacity.foot_timingNumber[0] = 0;
		capacity.foot_timingNumber[1] = 5;
		capacity.foot_timingNumber[2] = 0;
		capacity.show();	//显示弹框
		// 弹框关闭方法
		capacity.capacityClick = function (data){ //定义弹框关闭后执行的方法 data 为出发的按钮的id 格式为 button1 、button2 根据这个返回值来判断哪个按钮被触发 
			alert(data);
			//要执行的语句 
		}
	}
	使用案例二：form表单提交，根据按钮响应对应的操作
		<form name="myform" onSubmit="return false;" action="http://baidu.com" method="get" id="myform">
			<input onClick="return xianshi();" type="submit" value="提交" />
		</form>

		注意：如果是用 input ,则直接调用 click 函数，
			如果是 type = "submit" 的 input ，则要在 form 元素中添加 onSubmit="return false;" 目的是为了阻塞提交
			然后在 click 函数中去根据按钮的响应出发 form 元素的 submit 事件 
			capacity.capacityClick = function (data){
				document.getElementById("myform").submit();
			}
	使用案例三：快速调用弹框
		CallCapacity({
				head_content:"提示",
				foot_buttonBg:["#000","#666","#00f"],
				capacityClick:capacityFun
			});
		function capacityFun(data){}
		或
		CallCapacity({
				head_content:"提示",
				foot_buttonBg:["#000","#666","#00f"],
				capacityClick:function(data){
					alert(data);
				}
			});
		或
		CallCapacity("提示","快捷方式","确定",capacityFun);
		CallCapacity("","确认删除？","确定",function (data){console.log("1")},function(data){console.log("3")},false);

	author:colien.cheng
	dateTime:2016/08/18
*/
(function (global, factory) {
	/* eslint-disable no-undef */
	// CommonJS、CMD规范检查
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	// AMD规范检查
	typeof define === 'function' && define.amd ? define(factory) : (global.CapacityHintBox = factory());
	/* eslint-enable no-undef */
})(this, function () { 
	try{
		require("./css/default.css");
	}catch(e){console.log(e);}
	/* 弹框对象 */
	function Capacity() {
		var obj = new Object();
		obj.styles = "default",  /* 弹框风格 */
		obj.styleUrl = "capacityHintBox/capacityBox",
		obj.background = "#fff", /* 弹框最外层的背景颜色 */
		obj.width = "400px",	 /* 弹框的宽度 */
		obj.marginTop = '-100px',/* 弹框距离顶部的高度，必须是负值，负号后面数字越大，距离顶部越近 */

		obj.head_background = '#ededed',	/* 弹框头部的背景颜色 */
		obj.head_color = '#333',			/* 弹框头部的字体颜色 */
		obj.head_fontSize = '18px',			/* 弹框头部的字体大小 */
		obj.head_lineHeight = '60px',		/* 弹框头部的字体行高 ，通过改变行高，可以改变头部的高度 */
		obj.head_padding = '0px 45px',		/* 弹框头部的内容padding */
		obj.head_textAlign = 'left',		/* 弹框头部的内容对齐方式 */
		obj.head_content = '',				/* 弹框头部的内容 */
		obj.headCloseBut = false;			/* 是否展示头部的关闭按钮 */

		obj.body_background = '#fff',		/* 弹框内容部分的背景颜色 */
		obj.body_color = '#333',			/* 弹框内容部分的字体颜色 */
		obj.body_fontSize = '13px',			/* 弹框内容部分的字体大小 */
		obj.body_lineHeight = '24px',		/* 弹框内容部分的字体行高 */
		obj.body_content = '',				/* 弹框内容部分的内容*/

		obj.foot_background = '#fff',		/* 弹框底部的背景颜色 */
		obj.foot_height = "40px",			/* 弹框底部的高度 */
		obj.foot_item = 1,					/* 底部有多少个弹框 */
		obj.foot_functionName = new Array(obj.foot_item),	/* 底部每个弹框对应的方法名 */
		obj.foot_itemContent = new Array(obj.foot_item),	/* 底部每个弹框对应的按键内容 */
		obj.foot_timingNumber = new Array(obj.foot_item),	/* 底部按钮对应的定时秒数 */
		obj.foot_buttonId = new Array(obj.foot_item),		/* 底部按钮的 id */
		obj.capacityTimer = new Array(obj.foot_item),		/* 定时器数组 */
		obj.foot_buttonBg = new Array(obj.foot_item),		/* 底部按钮背景颜色 */
		obj.foot_buttonColor = new Array(obj.foot_item),		/* 底部按钮字体颜色 */

		/* 构建弹框头部，仅供内部使用 */
		obj.buildHead = function (){
			var headDiv = document.createElement("div");
			headDiv.setAttribute("id","capacity_head");
			headDiv.className = "msg_h";
			headDiv.style.lineHeight = this.head_lineHeight;
			var headBody = document.createElement("div");
			headBody.setAttribute("id","capacity_head_body");
			headBody.className = "msg_head";
			headBody.style.fontSize = this.head_fontSize;
			headBody.style.color = this.head_color;
			headBody.style.padding = this.head_padding;
			headBody.style.textAlign = this.head_textAlign;
			headBody.innerHTML = this.head_content;
			headDiv.appendChild(headBody);
			var close = document.createElement("b");
			close.setAttribute("id","msg_close");
			close.setAttribute("flagK","true");
			close.className = "msg_close";
			if(!obj.headCloseBut){
				close.style.display = "none";
			}
			headDiv.appendChild(close);
			return headDiv;
		},
		/* 构建弹框主体，仅供内部使用 */
		obj.buildBody = function (){
			var bodyDiv = document.createElement("div");
			bodyDiv.setAttribute("id","capacity_body");
			bodyDiv.innerHTML = this.body_content;
			bodyDiv.className = "msg_c";
			bodyDiv.style.color = this.body_color;
			bodyDiv.style.fontSize = this.body_fontSize;
			bodyDiv.style.lineHeight = this.body_lineHeight;
			return bodyDiv;
		},
		/* 构建弹框底部，仅供内部使用 */
		obj.buildFoot = function (){
			var footDiv = document.createElement("div");
			footDiv.setAttribute("id","capacity_foot");
			footDiv.className = "msg_f";
			footDiv.style.height = this.foot_height;

			for(var i=0 ;i < this.foot_item ;i++){
				var foot_span = document.createElement("span");
				foot_span.setAttribute("id","button"+(i+1));
				foot_span.setAttribute("index",i);
				foot_span.setAttribute("flagK","false");
				foot_span.className = "msg_i";

				if(!obj.isEmpty(this.foot_buttonBg[i])){
					foot_span.style.background = this.foot_buttonBg[i];
				}
				if(!obj.isEmpty(this.foot_buttonColor[i])){
					foot_span.style.color = this.foot_buttonColor[i];
				}
				foot_span.innerHTML = this.foot_itemContent[i];

				if(!obj.isEmpty(obj.foot_timingNumber[i])){
					var foot_span_span = document.createElement("span");
					foot_span_span.setAttribute("id","msg-time"+i);
					foot_span_span.innerHTML = "("+obj.foot_timingNumber[i]+"s)";
					foot_span.appendChild(foot_span_span);
				}
				var fontItemDiv = document.createElement("div");
				fontItemDiv.className ="foot"+this.foot_item;
				fontItemDiv.appendChild(foot_span);
				footDiv.appendChild(fontItemDiv);
			}
			return footDiv;
		},
		/* 创建 style 标签 */
		obj.buildStyle = function(){
			var styleEle = document.createElement("link");  
			styleEle.setAttribute("type", "text/css");
			styleEle.setAttribute("href", obj.getMyPath() + "css/" + obj.styles +".css");
			styleEle.setAttribute("rel", "stylesheet");
			return styleEle;
		},
		/* 创建阴影层  */
		obj.buildYY = function(){
			var YYDiv = document.createElement("div");
			YYDiv.setAttribute("id","msg_yy");
			YYDiv.className = "msg_yy";
			return YYDiv;
		},
		/* 创建弹框 */
		obj.buildCapacity = function(){
			var capaDiv = document.createElement("div");
			capaDiv.setAttribute("id","capacity");
			capaDiv.className = "msg_ magictime slideUpRetourn";
			capaDiv.style.width = this.width;
			capaDiv.style.marginLeft = -parseInt(this.width.substring(0,this.width.length-2))/2 +"px";
			capaDiv.appendChild(obj.buildHead());
			capaDiv.appendChild(obj.buildBody());
			capaDiv.appendChild(obj.buildFoot());
			return capaDiv;
		},
		/* 显示弹框，通过对象供外部调用 */
		obj.capacityShow = function (){
			var oldCapacityDiv = document.getElementById("capacityModel");
			if(!obj.isEmpty(oldCapacityDiv)){
				oldCapacityDiv.parentNode.removeChild(oldCapacityDiv);
			}
			var capacityDiv = document.createElement("div");
			capacityDiv.setAttribute("id","capacityDiv");
			capacityDiv.appendChild(obj.buildCapacity());
			var capacityModel = document.createElement("div");
			capacityModel.setAttribute("id","capacityModel");
			//capacityModel.appendChild(obj.buildStyle());
			capacityModel.appendChild(obj.buildYY());
			capacityModel.appendChild(capacityDiv);	
			document.getElementsByTagName("body")[0].appendChild(capacityModel);	
			var data = this;
			for(var i = 0 ; i<data.foot_item;i++){
				data.foot_buttonId[i] = "button" +(i+1);
			}
			this.alertShow(data);
		},
		obj.alertShow = function (data){	/* 显示弹框，仅供内部使用 */
			document.getElementById("msg_yy").style.display = "block";
			document.getElementById("capacity").style.display = "block";
			/* 禁用滚动条 */
			document.getElementsByTagName("body")[0].style.overflow = "hidden";
			/* 判断弹框高度是否大于当前屏幕 */
			if(data.capacityIsOverWindowHeight(data)){
				document.getElementById("capacity").style.position = "absolute";
				document.getElementById("capacity").style.top = "0";
				document.getElementById("capacity").style.marginTop = "100px";
			}else{
				document.getElementById("capacity").style.marginTop = -(data.capacityHeight()/2) + "px";
			}
			for(var i=0 ;i<data.foot_item;i++){
				if(!obj.isEmpty(data.foot_timingNumber[i])){
					data.capacityLoad(i,data);
				}else{
					document.getElementById(data.foot_buttonId[i]).setAttribute("flagK","true");
				}
			}
			for(var n =0 ;n<data.foot_item;n++){
				document.getElementById(data.foot_buttonId[n]).onclick = function(){
					if(data.hideCapacity(this)){
						data.capacityClick(this.getAttribute("id"));
					}
				};
			}
			document.getElementById("msg_close").onclick = function(){
				if(data.hideCapacity(this)){
					data.capacityCloseClick();
				}
			};
		},
		/* 获取文件路径  */
		obj.getMyPath = function() {
			//如果文件只需
			var scriptArr = document.getElementsByTagName('script');
			var path = "";
			for (var i = 0; i < scriptArr.length; i++) {
				var index = scriptArr[i].src.indexOf(obj.styleUrl);
				if(index != -1){
					path = scriptArr[i].src.substring(0,index+16);
					break;
				}
			}
			return path;
		},
		/* 判断是超出屏幕高度  */
		obj.capacityIsOverWindowHeight = function (data){
			var winHeight = document.getElementById("capacityDiv").offsetHeight;
			var countHeight = 100 + data.capacityHeight();
			if(countHeight >= winHeight){
				return true;
			}
			return false;
		},
		/* 获取弹框高度  */
		obj.capacityHeight = function (){
			return document.getElementById('capacity').offsetHeight;
		},
		/* 定时加载的方法 */
		obj.capacityLoad = function (index,data){
			data.capacityTimer[index] = setInterval(function(){data.capacityUpDate(index,data);},1000);
		},
		/* 更新一秒的方法 */
		obj.capacityUpDate = function (index, data){
			document.getElementById(data.foot_buttonId[index]).setAttribute("flagK","false");
			document.getElementById("msg-time" + index).innerHTML = "("+(data.foot_timingNumber[index]-1)+"s)";
			if(data.foot_timingNumber[index]-1 == 0){
				document.getElementById("msg-time" + index).innerHTML="";
				document.getElementById(data.foot_buttonId[index]).setAttribute("flagK","true");
				clearInterval(data.capacityTimer[index]);
			}
			data.foot_timingNumber[index] = data.foot_timingNumber[index]-1;
		},
		/* 判断是否为空 */
		obj.isEmpty = function (val){
			if (val == null) return true;
			if (val == undefined || val == "undefined") return true;
			if (val == "") return true;
			if (val.length == 0) return true;
			if (!/[^(^\s*)|(\s*$)]/.test(val)) return true;
			return false;
		},
		obj.capacityClick = function(){}; /* 点击关闭按钮的方法 ，供外部使用，且在 alertShow 方法之前调用 */
		obj.capacityCloseClick = function(){}; /* 点击关闭圆圈的方法 ，供外部使用，且在 alertShow 方法之前调用 */
		obj.hideCapacity = function (data){	/* 关闭窗口方法，有返回值，true or false ,供内部使用 */
			if(data.getAttribute("flagK") == "true"){
				/* 启用滚动条 */
				document.getElementsByTagName("body")[0].style.overflow = "auto";
				for(var i =0 ;i < obj.foot_item;i++){
					clearInterval(obj.capacityTimer[i]);	
				}
				var capacityDiv = document.getElementById("capacityModel");
				capacityDiv.parentNode.removeChild(capacityDiv);
				return true;
			}
			return false;
		};
		return obj;
	}

	/* 弱提示对象 */
	function WeakHint(){
		var obj = new Object();
		obj.styles = "default",	/* 提示风格 */
		obj.styleUrl = "capacityHintBox/capacityBox",
		obj.background = "rgba(220, 240, 221, 0.75)",	/* 提示的背景颜色 */
		obj.width = "",						/* 提示的宽度 */
		obj.top = '26px',					/* 提示距离顶部的高度 */
		obj.left = "",						/* 提示距离左边的高度 */
		obj.right = "",						/* 提示距离右边的高度 */
		obj.bottom = "",					/* 提示距离底部的高度 */
		obj.content = '',					/* 提示信息的内容 */
		obj.color = "#282828",				/* 提示信息的颜色值 */
		obj.fontSize = "12px",				/* 提示信息的颜色大小 */
		obj.lineHeight = "28px",			/* 提示信息的行高*/
		obj.padding = "0px 50px",			/* 提示的padding */
		obj.timingNumber = 4,				/* 底部按钮对应的定时秒数 */

		/* 构建提示内容，仅供内部使用 */
		obj.buildWeakHint = function (){
			var weakHint = document.createElement("div");
			weakHint.setAttribute("id","weakHint");
			weakHint.className = "weakHintContent";
			weakHint.style.color = this.color;
			weakHint.style.fontSize = this.fontSize;
			weakHint.style.background = this.background;
			if(!obj.isEmpty(this.padding)){
				weakHint.style.padding = this.padding;
			}
			weakHint.innerHTML = this.content;
			return weakHint;
		},
		/* 创建 style 标签，仅供内部使用 */
		obj.buildStyle = function(){
			var styleEle = document.createElement("link");  
			styleEle.setAttribute("type", "text/css");
			styleEle.setAttribute("href", obj.getMyPath() + "css/" + obj.styles +".css");
			styleEle.setAttribute("rel", "stylesheet");
			return styleEle;
		},
		/* 创建提示，通过对象供外部调用 */
		obj.capacityShow = function (){
			var capacityDiv = document.getElementById("weakHintBox");
			if(!obj.isEmpty(capacityDiv)){
				capacityDiv.parentNode.removeChild(capacityDiv);
			}
			var weakHintBox = document.createElement("div");
			weakHintBox.setAttribute("id","weakHintBox");
			weakHintBox.style.lineHeight = this.lineHeight;
			weakHintBox.style.width = this.width;
			if(obj.isEmpty(this.right) && obj.isEmpty(this.left)){
				weakHintBox.style.transform = "translateX(-50%)";
			}
			if(!obj.isEmpty(this.top)){
				if(obj.isEmpty(this.bottom)){
					weakHintBox.style.top = this.top;
				}
			}
			if(!obj.isEmpty(this.right)){
				if(obj.isEmpty(this.left)){
					weakHintBox.style.right = this.right;
				}
			}
			if(!obj.isEmpty(this.bottom)){
				weakHintBox.style.bottom = this.bottom;
			}
			if(!obj.isEmpty(this.left)){
				weakHintBox.style.left = this.left;
			}
			//weakHintBox.appendChild(obj.buildStyle());
			weakHintBox.appendChild(obj.buildWeakHint());
			document.getElementsByTagName("body")[0].appendChild(weakHintBox);
			this.alertShow();
		},
		/* 显示提示，仅供内部使用 */
		obj.alertShow = function (){	
			var capacityDiv = document.getElementById("weakHintBox");
			capacityDiv.style.display = "block";
			setTimeout(obj.hideCapacity,parseInt(obj.timingNumber)*1000);
		},
		/* 获取文件路径  */
		obj.getMyPath = function () {
			//如果文件只需
			var scriptArr = document.getElementsByTagName('script');
			var path = "";
			for (var i = 0; i < scriptArr.length; i++) {
				var index = scriptArr[i].src.indexOf(obj.styleUrl);
				if(index != -1){
					path = scriptArr[i].src.substring(0,index+16);
					break;
				}
			}
			return path;
		},
		/* 判断是否为空 */
		obj.isEmpty = function (val){
			if (val == null) return true;
			if (val == undefined || val == "undefined") return true;
			if (val == "") return true;
			if (val.length == 0) return true;
			if (!/[^(^\s*)|(\s*$)]/.test(val)) return true;
			return false;
		},
		/* 如果为空或者0 */
		obj.isEmptyNotZero = function (val){
			if(val == "0") return false;
			return obj.isEmpty(val);
		},
		/* 获取对象类型  */
		obj.getObjectType = function (obj){
			return obj.constructor;
		},
		/* 判断是否是对象  */
		obj.isObject = function (obj){
			return typeof obj == "object" && obj.constructor == Object;
		},
		/* 关闭提示方法，供内部使用 */
		obj.hideCapacity = function (){
			var capacityDiv = document.getElementById("weakHintBox");
			if(!obj.isEmpty(capacityDiv)){
				var target = 0;
				var alpha = 30;
				var speed = 0;
				var timer = setInterval(function(){
					if(target > alpha){
						speed = 1;
					}else{
						speed = -1;
					}
					if(alpha == target){
						clearInterval(timer);
						if(!obj.isEmpty(capacityDiv)){
							capacityDiv.parentNode && capacityDiv.parentNode.removeChild(capacityDiv);
							capacityDiv = null;
						}
					}else{
						alpha = alpha + speed;
						capacityDiv.style.filter = 'alpha(opacity='+alpha+')';
						capacityDiv.style.opacity = alpha/100;
					}
				},10);
			}
		};
		return obj;
	}

	/* 快速调用方法弹框 */
	function CallCapacity(){
		var obj = new Capacity();
		if(arguments.length == 1){
			var json = arguments[0];
			for(var key in json){
				for(var attr in obj){
					if(key == attr)
						obj[attr] = json[key];
				}
			}
		}else{
			obj.head_content = arguments[0];
			obj.body_content = arguments[1];
			obj.foot_itemContent[0] = obj.isEmpty(arguments[2]) ? "我知道了" : arguments[2]; 
			obj.capacityClick = obj.isEmpty(arguments[3]) ? obj.capacityClick : arguments[3];
			obj.capacityCloseClick = obj.isEmpty(arguments[4]) ? obj.capacityCloseClick : arguments[4];
			obj.headCloseBut = obj.isEmpty(arguments[5]+"") ? obj.headCloseBut : arguments[5];
		}
		obj.capacityShow();
	}

	/* 快速调用提示方法 */
	function CallWeakHint(){
		var obj = new WeakHint();
		if(obj.isObject(arguments[0])){
			var json = arguments[0];
			for(var key in json){
				for(var attr in obj){
					if(key == attr)
						obj[attr] = json[key];
				}
			}
		}else{
			obj.content = obj.isEmpty(arguments[0]) ? obj.content:arguments[0];
			if(arguments[1] && !isNaN(arguments[1])){
				obj.timingNumber = obj.isEmptyNotZero(arguments[1]) ? obj.timingNumber:arguments[1];
			}else if(arguments[1] && typeof arguments[1] == "string"){
				if(arguments[1] == "btn-error"){
					obj.background = "red";
					obj.color = "#fff";
				}
			}
			obj.timingNumber = obj.isEmptyNotZero(arguments[2]) ? obj.timingNumber:arguments[2];
		}
		obj.capacityShow();
	}
	// 暴露公共方法 
	return {
		CallCapacity,
		CallWeakHint,
	};
});
