/* 公用JS方法 */
(function (global, factory) {
	/* eslint-disable no-undef */
	// CommonJS、CMD规范检查
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	// AMD规范检查
	typeof define === 'function' && define.amd ? define(factory) : (global.jsUtils = factory());
	/* eslint-enable no-undef */
})(this, function () { 
	'use strict';
	// 暴露公共方法 
	return {
		/*获取地址栏参数*/
		GetQueryString : function (name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)
				return unescape(r[2]);
			return "";
		},
		/*  判断是否为空  */
		isNullOrEmpty : function (str) {
			if (str == null) return true;
			if (str == undefined || str == "undefined") return true;
			if (str == "") return true;
			if (str.length == 0) return true;
			if (!/[^(^\s*)|(\s*$)]/.test(str)) return true;
			return false;
		},
		/*判断是否为空*/
		isNotEmpty : function (obj) {
			return !this.isNullOrEmpty(obj);
		},
		/*  判断是否为整数数字 */
		isNumber : function (n) {  
			return !this.isNaN(parseFloat(n)) && isFinite(n) && n%1 === 0; 
		},
		/* 获取字符串中的所有数字  */
		getNum : function (text){
			var value = text.replace(/[^0-9]/ig,""); 
			return value;
		},
		/* 获取字符串中的所有字母 */
		getLetter : function (text){
			var value = text.replace(/[^a-zA-Z]/ig,""); 
			return value;
		},
		/* 判断输入内容是否含有小写字母 */
		isContainLowercase : function (str){
			var reg = /.*[a-z]+.*/;
			if(reg.test(str)){    
				return true;
			}else{
				return false;
			}
		},
		/*  判断是否含有大写字母 */
		isContainUpper : function (str){       
			if (/^[a-z]+$/.test(str)){
			   return true;
			} 
			return false;
		},
		/* 判断是否为全英文大写或全中文 */
		isValidTrueName : function (str){
			var reg = /^[A-Z u4E00-u9FA5]+$/;
			if(reg.test(str)){
				return false;
			}
			return true;
		},
		/*  键盘弹起转化成小写 */
		keyUpToLowerCase : function (obj){
			obj.value = obj.value.toLowerCase();
		},
		dateUtil : {
			/*
			 * 取传入日期是星期几
			 * 使用方法：dateUtil.nowFewWeeks(new Date());
			 * @param date{date} 传入日期类型
			 * @returns {星期四，...}
			 */
			nowIsWeeks:function(date){
				if(date instanceof Date){
					var dayNames = new Array(7,1,2,3,4,5,6);
					return dayNames[date.getDay()];
				} else{
					return "Param error,date type!";
				}
			},
		},
	};
});

/*  去除字符串两端的空格  */
String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

Date.prototype.dateFormat = function (format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds(), //millisecond
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] == obj) {  
            return true;  
        }  
    }  
    return false;  
};
Array.prototype.removeByValue = function(val) {
	 for(var i=0; i<this.length; i++) {
	    if(this[i] == val) {
	      this.splice(i, 1);
	      break;
	    }
	 }
};