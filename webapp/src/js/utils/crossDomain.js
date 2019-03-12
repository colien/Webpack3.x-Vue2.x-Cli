/* 
* 控制父窗口生成一个 tab 
* 此方法只能通过 URL 的方式进行打开
*/
(function (global, factory) {
	/* eslint-disable no-undef */
	// CommonJS、CMD规范检查
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	// AMD规范检查
	typeof define === 'function' && define.amd ? define(factory) : (global.CrossDomain = factory());
	/* eslint-enable no-undef */
})(this, function () { 
	'use strict';
	/* 发送跨域请求 
		mark : tab上的一个标示名称，同一类窗口相同，不同类窗口不相同
		markVal : mark的值
		text : tab上显示的名称
		url : tab 上 iframe 要打开的地址 
		isRepeat : 是否可以重复
	*/
	function sendCrossDomain(mark,markVal,text,url,isRepeat){
		if(self == top){
			//如果当前页面是顶层页面就直接新开一个页面。
			window.open(url);
			return;
		}
		/* 如果没有传递参数则表示要关闭当前 tab */
		var data = arguments.length == 0 ? toJson("","","","","","true") : toJson(mark,markVal,text,url,isRepeat,"false");
		window.parent.postMessage(JSON.stringify(data),'*');
	}
	/* 获取跨域 json 数据  */
	function toJson(mark,markVal,text,url,isRepeat,isClose){
		var params = {
			mark : mark,
			markVal : markVal,
			text : text,
			isRepeat : isRepeat,
			isClose : isClose,
			url : url,
			token : "crossMomain",
		};
		return params;
	}
	// 暴露公共方法 
	return {
		sendCrossDomain : sendCrossDomain,
	};
});