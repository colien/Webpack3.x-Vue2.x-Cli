
import promise from 'es6-promise';
promise.polyfill();
import axios from 'axios';
import qs from 'qs';

import capacityHintBox from "capacityHintBox";
const CallWeakHint = capacityHintBox.CallWeakHint;

import i18nData from "js/utils/language.js";

var env = process.env.NODE_ENV;

axios.defaults.baseURL = '';			// 配置axios的默认URL
axios.defaults.withCredentials = false;	// 配置允许跨域携带cookie
axios.defaults.timeout = 120000;		// 配置超时时间 2min
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';									// 标识这是一个 ajax 请求
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';		// 设置 contentType
axios.defaults.headers.common['Accept'] = "*/".concat( "*" );	// 设置 dataType
//axios.defaults.responseType = 'json';							// 设置 response 类型
axios.interceptors.request.use(config => {return config}, error => {return Promise.reject(error);});		// axios 拦截器 配置请求拦截
axios.interceptors.response.use(
	response => {
		// 假设后台将请求重定向到了登录页，则data里面存放的就是登录页的源代码，这里须要找到data是登录页的证据(标记)
		try{
			const resText = JSON.stringify(response.data);
			if (resText.indexOf('loginTimeOut') > -1) {
				if(env != "development"){
					try{
						parent.location.href = resText.substring(14, resText.length - 1) + "?backUrl=" + (GetQueryString("omsParentUrl") || encodeURIComponent(window.location.href));
					}catch(e){
						window.location.href = resText.substring(14, resText.length - 1) + "?backUrl=" + encodeURIComponent(window.location.href);
					}
					return;
				}
			}
		}catch(e){
			console.error(e);
		}
		return response;
	}, 
	error => {
		var result = {
			code : 1,
			errMsg : i18n.failedGetDataRequestException,
			errObj : error,
		};
		try{
			if(error.status == 488){
				result.errMsg = i18n.notHavePermissionAccessOperateFeature;
				CallWeakHint(result.errMsg,"btn-error");
			}
			var errText = error.data || "";
			if (errText.indexOf('loginTimeOut') > -1) {
				if(env != "development"){
					try{
						parent.location.href = errText.substring(13) + "?backUrl=" + (GetQueryString("omsParentUrl") || encodeURIComponent(window.location.href));
					}catch(e){
						window.location.href = errText.substring(13) + "?backUrl=" + encodeURIComponent(window.location.href);
					}
					return;
				}
			}
		}catch(e){
			console.log(e);
		}
		return Promise.reject(result);
	}
);		// axios 拦截器 配置响应拦截

const ACCEPT = {		// Accept 代表发送端（客户端）希望接受的数据类型
	"*": "*/".concat( "*" ),
	text: "text/plain",
	html: "text/html",
	xml: "application/xml, text/xml",
	json: "application/json, text/javascript"
};
const CONTENTTYPE = {	// Content-Type 代表发送端（客户端|服务器）发送的实体数据的数据类型。
	'json' : 'application/json; charset=UTF-8',
	'x-www-form-urlencoded' : 'application/x-www-form-urlencoded; charset=UTF-8',
	'form-data' : "multipart/form-data",	// type = file 的时候用
	'text' : 'text/plain',
	'xml' : 'text/xml',
}

const i18n = i18nData.getI18nData()

/* 请求成功处理 */
const reqSuccess = (response,succCallBack) => {
	typeof succCallBack === "function" && succCallBack(response);
}

/* 请求错误处理 */
const reqError = (error,errCallBack,succCallBack) => {
	if(typeof errCallBack === "boolean" && errCallBack && typeof succCallBack === "function"){	// boolean 类型并且为 true 才会合并到 succCallBack 处理
		succCallBack(error);	
	}else if(typeof errCallBack === "function"){
		errCallBack(error); 
	}
}
/* 转化拼接请求参数 */
const transformParams = (params) => {
	if(typeof params === "string" && params){
		return params;
	}else if(typeof params === "object" && params){
		try{
			return qs.stringify(params,{ allowDots: true }) +'&_v=' + new Date().getTime(); // 处理缓存
		}catch(e){
			console.log(e);
			return "";
		}
	}
	return "";
}

/* 获取浏览器参数 */
const GetQueryString = (name) => {
	const reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	const r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return "";
}

/* 
  GET 请求 
  url : 请求地址
  params : 请求参数，要为对象 {}
  succCallBack : 请求成功的回调函数
  errCallBack : 请求失败的回调函数，有两种值
				1. function (error) 请求出错的回调方法
				2. boolean (true/false)	true 将请求出错的逻辑合并到成功的回调函数一起处理,false 不处理
  return : promise 对象，优先级 succCallBack 和 errCallBack > 外部 then 和 catch
*/
export const getRequest = (url,params,succCallBack,errCallBack) => {
	return new Promise((resolve, reject) => {
		resolve = typeof succCallBack === "function" ? succCallBack : resolve;
		reject = typeof errCallBack === "function" || typeof errCallBack === "boolean" ? errCallBack : reject;
		axios.get(url,{
			params : params,
			paramsSerializer : transformParams,
		}).then(function (response) {
			reqSuccess(response.data,resolve);
		}).catch(function (error) {
			reqError(error.response,reject,resolve);
		});
	})
	
	/*
	url = stitchingParams(url,params);
	axios.get(url).then(function (response) {
		reqSuccess(response.data,succCallBack);
	}).catch(function (error) {
		reqError(error.response,errCallBack,succCallBack);
	});
	*/	
}
/* 
  POST 请求
  url : 请求地址
  params : 请求参数，要为对象 {}
  succCallBack : 请求成功的回调函数
  errCallBack : 请求失败的回调函数，有两种值
				1. function (error) 请求出错的回调方法
				2. boolean (true/false)	true 将请求出错的逻辑合并到成功的回调函数一起处理,false 不处理
  return : promise 对象，优先级 succCallBack 和 errCallBack > 外部 then 和 catch
*/
export const postRequest = (url,params,succCallBack,errCallBack) =>{
	return new Promise((resolve, reject) => {
		resolve = typeof succCallBack === "function" ? succCallBack : resolve;
		reject = typeof errCallBack === "function" || typeof errCallBack === "boolean" ? errCallBack : reject;
		axios.post(url,params,{
			transformRequest: [transformParams],	// 这个地方需要转换参数，不然的话所有参数都会成为对象的 key
		}).then(function (response) {
			reqSuccess(response.data,resolve);
		}).catch(function (error) {
			reqError(error.response,reject,resolve);
		});
	})
	
	/*axios.post(url,params,{
		transformRequest: [transformParams],	// 这个地方需要转换参数，不然的话所有参数都会成为对象的 key
	}).then(function (response) {
		reqSuccess(response.data,succCallBack);
	}).catch(function (error) {
		reqError(error.response,errCallBack,succCallBack);
	});*/
}
/* 
  可自己根据需要扩展
  config : 配置
  succCallBack : 请求成功的回调函数
  errCallBack : 请求失败的回调函数，有两种值
				1. function (error) 请求出错的回调方法
				2. boolean (true/false)	true 将请求出错的逻辑合并到成功的回调函数一起处理,false 不处理
		succCallBack 和 errCallBack 可以形参设置，也可以在 config 中配置，外部形参会覆盖config 里面的
  return : promise 对象，优先级 succCallBack 和 errCallBack > config 中配置 success 和 error > 外部 then 和 catch
*/
export const extendAxios = (config,succCallBack,errCallBack) => {
	
/* config 示例
	{ 
		url : url, 
		method : "POST", 
		data : params, 
		dataType : "JSON",													// 就是设置 header 中的 Accept 
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",	// 就是设置 header 中的 Content-Type
		baseURL : '',														// 配置axios的默认URL
		withCredentials : false,											// 配置允许跨域携带cookie
		timeout : 120000,													// 超时时间
		headers: {
			'X-Requested-With' : 'XMLHttpRequest',					// 请求通信类型，已有默认
			'Content-Type' : 'application/x-www-form-urlencoded',	// 设置请求实体类型，优先级低于 contentType 参数
			'Accept' : 'application/json, text/javascript, *',		// 希望返回实体类型，优先级低于 dataType 参数
		},
		success : function(data){},	// 这里的 成功的回调函数和失败的回调函数 如果在 形参上（succCallBack,errCallBack）设置了，就可以不在这设，二选一
		error : function(data){}	// error 可以是 function 也可以是 boolean, 和 errCallBack 数据类型一样
	} */

	if(typeof config !== "object"){
		CallWeakHint(i18n.requestParamsIncorrect,"btn-error");
		return ;
	}
	if(config.method && config.method.toLocaleUpperCase() === "GET"){
		config.params = config.data;	// get 用的是 params
		config.paramsSerializer = transformParams;
		config.data = null;				// post 用的 data
	}
	if(config.dataType){
		config.headers =  config.headers || {};
		config.headers["Accept"] = ACCEPT[config.dataType.toLocaleLowerCase()] || config.dataType;
	}
	if(config.contentType){
		config.headers =  config.headers || {};
		config.headers["Content-Type"] = CONTENTTYPE[config.contentType.toLocaleLowerCase()] || config.contentType;
	}
	// 如果没有或者是 x-www-form-urlencoded 需要转化一下参数
	if(!config.contentType || (config.contentType && config.contentType.toLocaleLowerCase().indexOf("x-www-form-urlencoded") > -1 )){
		config.transformRequest = [transformParams];
	}

	if(!succCallBack && config.success){
		succCallBack = config.success;
		config.success = null;
	}
	if(!errCallBack && config.error){
		errCallBack = config.error;
		config.error = null;
	}

	return new Promise((resolve, reject) => {
		resolve = typeof succCallBack === "function" ? succCallBack : resolve;
		reject = typeof errCallBack === "function" || typeof errCallBack === "boolean" ? errCallBack : reject;
		axios(config)
		.then(function (response) {
			reqSuccess(response.data,resolve);
		}).catch(function (error) {
			reqError(error.response,reject,resolve);
		});
	});
}