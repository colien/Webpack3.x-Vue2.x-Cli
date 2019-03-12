/**
 * Created by DELL on 2016/12/1.
 */
/* 分页公用插件 */
function buildPage(){
	var obj = new Object();
	var paramsArr = arguments;//参数数组对象
	obj.CurrentPage;//当前页数
	obj.PageCount;//总页数
	obj.PageSize;//每页显示数据
	obj.FunName = null;//回调方法
	obj.ResultCount;//总数据条数
	obj.ToPage;//跳转到的页数
	obj.submitState = true;//是否可以跳转页数
	obj.Lan;//语言环境
	obj.selectShow;//是否显示选择分页
	obj.idDiv;//分页存放位置
	obj.Language = {/*中英文数据*/
		    zh_CN:{
		        prev:"上一页",
				next:"下一页",
				total:"共",
				page:"页",
				to:"到",
				confirm:"确定",
				row:"行",
				show:"展示",
				correctPage:"请输入正确的页码!"
		    },
		    en_US:{
		        prev:"Previous",
				next:"Next",
				total:"Total",
				page:"page",
				to:"to",
				confirm:"Go to",
				row:"row",
				show:"show",
				correctPage:"Please enter the correct page No. !"
		    }
		};
	
	/* 跳转到指定页 */
	obj._go = function() {
		if(obj.submitState){
			var pc = ( obj.ToPage == null || obj.ToPage == undefined ) ? obj.CurrentPage : obj.ToPage;/*获取文本框中的当前页码*/
			var pageSize = obj.PageSize;
		    if(obj.FunName == null){
		    	getData(pc,pageSize);
		    }else{
		    	obj.FunName(pc,pageSize);
		    }
		}
	}
	/* 点击分页 */
	obj.gogo = function(data){
	    var pageNum = data.getAttribute("pageNum");
	    var pageSize = obj.PageSize;
	    var currentPage = obj.CurrentPage;
	    if("up" == pageNum){
	        currentPage = parseInt(currentPage)-1;
	    }else if("down" == pageNum){
	        currentPage = parseInt(currentPage)+1;
	    }else if(!isNaN(pageNum)){
	        currentPage = parseInt(pageNum);
	    }
	    if(obj.FunName == null){
	    	getData(currentPage,pageSize);
	    }else{
	    	obj.FunName(currentPage,pageSize);
	    }
	}
	/* 选择每页展示大小  */
	obj.pageSizeChange = function(data){
		obj.PageSize = data.value;
		if(obj.FunName == null){
	    	getData(1,obj.PageSize);
	    }else{
	    	obj.FunName(1,obj.PageSize);
	    }
	}
	/* 分页插件入口 ，创建分页
	 page : 分页信息（总页数，页数大小，当前页数）
	 id : 在那个元素中显示
	 funName : 执行那个方法
	 show : 是否显示页数大小选择
	 */
	obj.doPage = function() { 
		obj.initData();
		
		obj.generatePageChange(obj.PageSize,obj.PageCount,obj.idDiv,obj.selectShow);	/* 创建页数选择 */
		
		var divContent = document.createElement("div");
		divContent.setAttribute("class","divContent");

	    /* 创建上一页节点 */
	    obj.generateUpPart(obj.CurrentPage,divContent);
	    /* 创建页码节点 */
	    obj.generateMiddlePart(obj.PageCount, obj.CurrentPage, divContent);
	    /* 创建下一页节点 */
	    obj.generateDownPart(obj.PageCount, obj.CurrentPage, divContent);
	    /* 创建页面跳转 */
	    obj.generateGoPart(obj.PageCount, obj.CurrentPage,divContent);
	    var clear = document.createElement("p");
	    clear.setAttribute("class","clear");
	    obj.idDiv.appendChild( clear );
	    obj.idDiv.appendChild( divContent );
	}
	/*获取传入参数初始化全局变量*/
	obj.initData = function(){
		obj.idDiv = obj.getElement(paramsArr[3]);
	    obj.ResultCount = (paramsArr[0] == "") ? 0 : paramsArr[0];
		obj.CurrentPage = (paramsArr[1] == "") ? 1 : paramsArr[1];
		obj.PageSize = (paramsArr[2] == "") ? 0 : paramsArr[2];
	    obj.PageCount = (obj.ResultCount % obj.PageSize) == 0 ? (obj.ResultCount / obj.PageSize) : parseInt(obj.ResultCount / obj.PageSize) + 1;
	    obj.FunName = (paramsArr[4] == null || paramsArr[4] == "") ? null : paramsArr[4]; 
	    obj.selectShow = (paramsArr[5] == null || paramsArr[5] == "" || paramsArr[5] == false) ? "none" : "block";
		obj.Lan = (paramsArr[6] == null || paramsArr[6] == "") ? "zh_CN" : paramsArr[6]; 
	    obj.idDiv.innerHTML = "";
	}
	/*判断是class还是id*/
	obj.getElement = function (id){
		var elem = '';
		if( id.indexOf("#") != -1 ){
			elem = document.getElementById(id.substr(1));
		}else if( id.indexOf(".") != -1 ){
			elem = document.getElementsByClassName(id.substr(1))[0];
		}
		return elem;
	}
	/* 创建页码选择 */
	obj.generatePageChange = function(pageSize,pageCount,pageElement,display){
		var pageNumDiv = document.createElement("div");
		pageNumDiv.setAttribute("class","pageNumChange");
		pageNumDiv.setAttribute("style","display:"+display);
		
		var pageNumSpan1 = document.createElement("span");
		pageNumSpan1.innerHTML = obj.Language[obj.Lan].total+" "+obj.ResultCount+ " " + obj.Language[obj.Lan].row + "，"+ obj.Language[obj.Lan].show+"&nbsp;";
		pageNumDiv.appendChild( pageNumSpan1 );
		
		var pageNumSelect = document.createElement("select");
		pageNumSelect.setAttribute("class","pageSize");
		pageNumSelect.onchange = function(){
			obj.pageSizeChange(this);
		}
		var pageNumOption10 = obj.creatOption("10",pageSize == 10 ? true : false);
		pageNumSelect.appendChild( pageNumOption10 );
		
    	var pageNumOption20 = obj.creatOption("20",pageSize == 20?true:false);
	    pageNumSelect.appendChild( pageNumOption20 );
	    
    	var pageNumOption50 = obj.creatOption("50",pageSize == 50?true:false);
	    pageNumSelect.appendChild( pageNumOption50 );
	    
    	var pageNumOption100 = obj.creatOption("100",pageSize == 100?true:false);
	    pageNumSelect.appendChild( pageNumOption100 );
	    
	    pageNumDiv.appendChild( pageNumSelect );
	    
	    var pageNumSpan2 = document.createElement("span");
		pageNumSpan2.innerHTML = "&nbsp;"+obj.Language[obj.Lan].row;
		pageNumDiv.appendChild( pageNumSpan2 );
	    
	    pageElement.appendChild( pageNumDiv );
	}
	/*创建选择每页条数的下拉框选项*/
	obj.creatOption = function (val,state){
		var option = document.createElement("option");
		option.value = val;
		if(state){
			option.setAttribute("selected","selected");
		}
		option.innerHTML = val;
		return option;
	}
	/* 创建上一页节点 */
	obj.generateUpPart = function(currentPage,pageElement){
	    if(currentPage == 1){
	        obj.createSpanPart(pageElement,"preBtn aBtn spanBtnDisabled","false","<span class='icon'></span>"+obj.Language[obj.Lan].prev);
	    }else{
	        obj.createSpanPart(pageElement,"preBtn aBtn","true","<span class='icon'></span>"+obj.Language[obj.Lan].prev,"up");
	    }
	}
	/* 创建分页节点
	 pageElement:父节点
	 className:class名字
	 isClick:是否可以点击
	 text:元素显示内容
	 pageNum:元素标示内容
	 */
	obj.createSpanPart = function(pageElement,className,isClick,text,pageNum){
		var spanPart = document.createElement("span");
		spanPart.setAttribute("class",className);
		if(isClick == "true"){
			spanPart.setAttribute("pageNum",pageNum);
			spanPart.onclick = function(){
				obj.gogo(this);
			};
	    }
	    spanPart.innerHTML = text;
	    pageElement.appendChild(spanPart);
	}
	/*获取第二个和倒数第二个*/
	obj.getCurrent = function(pageCount, currentPage){
	    var begin;
	    var end;
	    if(pageCount <= 9){
	    	if(pageCount>0){
	    		end = pageCount-1;
	    	}else{
	    		end = 0;
	    	}
	        begin = 2;
	    }else{
	        if(currentPage-5 > 0){
	            if(currentPage + 4 < pageCount){
	                begin = currentPage - 2;//左边有...
	                end = currentPage + 2;//右边有...
	            }else{
	                /* 只有左边有 */
	                begin = pageCount - 7;
	                end = pageCount - 1;
	            }
	        }else{
	            /*右边有...*/
	            begin = 2;
	            end = 7;
	        }
	    }
	    return [begin, end];
	}
	/* 创建页码 */
	obj.generateMiddlePart = function(pageCount, currentPage, pageElement) {
	    var beginAndEnd = obj.getCurrent(pageCount, currentPage);//获取开始结束页码
	    var begin = beginAndEnd[0];
	    var end = beginAndEnd[1];
	    if(currentPage==1){
	        obj.createSpanPart(pageElement,"aBtn spanBtnSelected","false",1,1);
	    }else{
	        obj.createSpanPart(pageElement,"aBtn","true",1,1);
	    }
	    if(begin > 2 ){
	        obj.createSpanPart(pageElement,"aBtn spanApostrophe","false","...");
	    }
	    for( var i = begin; i <= end; i++ ){
	        if( i == currentPage ){
	            obj.createSpanPart(pageElement,"aBtn spanBtnSelected","false",i,i);
	        }else{
	            obj.createSpanPart(pageElement,"aBtn","true",i,i);
	        }
	    }
	    if( end < pageCount - 1 ){
	        obj.createSpanPart(pageElement,"aBtn spanApostrophe","false","...");
	    }
	    if( pageCount>1 ){
	        if( currentPage == pageCount ){
	            obj.createSpanPart(pageElement,"aBtn spanBtnSelected","false",pageCount,pageCount);
	        }else{
	            obj.createSpanPart(pageElement,"aBtn","true",pageCount,pageCount);
	        }
	    }
	}
	/* 创建下一页 */
	obj.generateDownPart = function(pageCount,currentPage,pageElement) {
	    if(currentPage >= pageCount){
	        obj.createSpanPart(pageElement,"nextBtn aBtn spanBtnDisabled","false",obj.Language[obj.Lan].next+"<span class='icon'></span>");
	    }else{
	        obj.createSpanPart(pageElement,"nextBtn aBtn","true",obj.Language[obj.Lan].next+"<span class='icon'></span>","down");
	    }
	}
	/* 创建分页跳转 */
	obj.generateGoPart = function(pageCount, currentPage, pageElement){
	    obj.appendSpanNode(pageElement, "&nbsp;&nbsp;"+obj.Language[obj.Lan].total+"&nbsp;"+pageCount+" "+obj.Language[obj.Lan].page,"totalPages");
	    obj.appendSpanNode(pageElement, "&nbsp;&nbsp;&nbsp;"+obj.Language[obj.Lan].to+"&nbsp;");
	    obj.appendInputNode(pageElement,currentPage,"inputPagecode", "text");
	    obj.appendSpanNode(pageElement, "&nbsp;"+obj.Language[obj.Lan].page+"&nbsp;");
	    obj.appendClickNode(pageElement, obj.Language[obj.Lan].confirm, "aSubmit");
	}
	/*生成一个span元素节点*/
	obj.appendSpanNode = function(parentNode, text, className){
		var spanHtml = document.createElement("span");
		spanHtml.setAttribute("class",className);
		spanHtml.innerHTML = text;
	    parentNode.appendChild(spanHtml);
	}
	/*生成一个a元素节点*/
	obj.appendClickNode = function(parentNode, text , className){
		var clickHtml = document.createElement("a");
		clickHtml.setAttribute("class",className);
		clickHtml.onclick = function() {
			obj._go();
		};
		clickHtml.innerHTML = text;
	    parentNode.appendChild(clickHtml);
	}
	/*生成一个input元素节点*/
	obj.appendInputNode = function(parentNode, value, className, type){
		var inputHtml = document.createElement("input");
		inputHtml.setAttribute("class",className);
		inputHtml.setAttribute("type",type);
		inputHtml.onblur = function() {
			obj.getPageCode(this);
			obj.isCorrectPageCode(this);
		};
		inputHtml.value = value;
	    parentNode.appendChild(inputHtml);
	}
	obj.getPageCode = function(data){
		obj.ToPage = data.value;
	}
	obj.isCorrectPageCode = function(data){
		var pc = obj.ToPage;/*获取文本框中的当前页码*/
		if ( ( !/^[1-9]\d*$/.test(pc) ) || pc < 1 || ( pc !=1 && obj.PageCount == 0 ) || pc > obj.PageCount ) {	/*对当前页码进行整数校验*/
	        obj.submitState = false;
			data.setAttribute("class","inputPagecode error");
	    }else{
	    	obj.submitState = true;
			data.setAttribute("class","inputPagecode");
	    }
	}
	obj.doPage();
	return obj;
};
(function () {
	var ie = !!(window.attachEvent && !window.opera);
	var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
	var fn = [];
	var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
	var d = document;
	d.ready = function (f) {
		if (!ie && !wk && d.addEventListener)
			return d.addEventListener('DOMContentLoaded', f, false);
		if (fn.push(f) > 1) return;
		if (ie)
			(function () {
				try { d.documentElement.doScroll('left'); run(); }
				catch (err) { setTimeout(arguments.callee, 0); }
			})();
		else if (wk)
			var t = setInterval(function () {
				if (/^(loaded|complete)$/.test(d.readyState))
					clearInterval(t), run();
			}, 0);
	};
})();
document.ready(function(){
	if( ! buildPage_isExistCss() ){
		buildPage_createCssLink();
	}
});
/*创建css*/
function buildPage_createCssLink(){
	var styleEle = document.createElement("link");  
	styleEle.setAttribute("type", "text/css");
	styleEle.setAttribute("href", buildPage_getMyPath() + "/css/pageBuilder.css?v=201706201939");
	styleEle.setAttribute("rel", "stylesheet");
	var scriptArr = document.getElementsByTagName('script');
	document.body.parentNode.getElementsByTagName("head")[0].appendChild(styleEle);
}
/*获取css文件路径*/
function buildPage_getMyPath() {
	var scriptArr = document.getElementsByTagName('script');
	var path = "";
	var fileName = "PageBuilder";
	var index;
	for (var i = 0; i < scriptArr.length; i++) {
		index = scriptArr[i].src.indexOf( fileName );
		if(index != -1){
			path = scriptArr[i].src.substring(0,index+(fileName.length));
			break;
		}
	}
	return path;
}
/*判断是否存在css文件*/
function buildPage_isExistCss(){
	var cssArr = document.getElementsByTagName('link');
	var path = "";
	var fileName = "PageBuilder";
	var index;
	for (var i = 0; i < cssArr.length; i++) {
		index= cssArr[i].href.indexOf( fileName );
		if(index != -1){
			return true;
		}
	}
	return false;
}