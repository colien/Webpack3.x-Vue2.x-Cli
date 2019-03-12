import { getCookie, setCookie } from './cookie.js'; 
import languageData from './i18nData.js'; 
(function (global, factory) {
	/* eslint-disable no-undef */
	// CommonJS、CMD规范检查
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	// AMD规范检查
	typeof define === 'function' && define.amd ? define(factory) : (global.LenguageUtils = factory());
	/* eslint-enable no-undef */
})(this, function () { 
	/*获取当前浏览器的语言*/
	function userLanguage(){
		var baseLang;
		if (navigator.userLanguage) {
			baseLang = navigator.userLanguage.substring(0,2).toLowerCase();
		} else {
			baseLang = navigator.language.substring(0,2).toLowerCase();
		}
		return baseLang;
	}

	/*获取当前页面的语言*/
	function getLanguage(){
		var lan = getCookie('localeLanguage_jpz_oms');
		var lanFlag;
		if(lan){
			lanFlag = lan;//en_US,zh_CN
		}else{
			//获取当前浏览器的语言
			if(userLanguage() == "zh"){
				lanFlag = "zh_CN";
			}else{
				lanFlag = "en_US";
			}
			setCookie("localeLanguage_jpz_oms",lanFlag,"h12");
		}
		return lanFlag;
	}
	/* 获取当前翻译文件 */
	function getI18nData(){
		return languageData[getLanguage()];
	}
	return {
		getLanguage : getLanguage,
		getI18nData : getI18nData,
	}
})