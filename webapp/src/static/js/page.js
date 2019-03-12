/*全局变量*/
var page_global;

var url_global;

function _go() {
    var pc = $("#pageCode").val();/*获取文本框中的当前页码*/
    if (!/^[1-9]\d*$/.test(pc)) {/*对当前页码进行整数校验*/
    	CallCapacity("","请输入正确的页码！","","");
        return;
    }
    if (pc > page_global.pageCount) {/*判断当前页码是否大于最大页*/
    	CallCapacity("","请输入正确的页码！","","");
        return;
    }

    doGet_SupplierFee(url_global+"&page.currentPage=" + pc);
}

function doPage(page, url) {
    page_global = page;
    url_global = url;

    var pageElement = document.getElementById("paginationID");
    pageElement.innerHTML = '';

    var pageCount = page.pageCount;
    var currentPage = page.currentPage;

    generateUpPart(currentPage, url, pageElement);

    generateMiddlePart(pageCount, currentPage, url, pageElement);

    generateDownAndGoPart(pageCount, currentPage, url, pageElement);
}

function generateUpPart(currentPage, url, pageElement) {
    if(currentPage == 1){
        appendSpanNode(pageElement, "上一页", "spanBtnDisabled");
    }else{
        var tempUrl = url+"&page.currentPage="+(currentPage-1);
        appendANode_supplierFee(pageElement, "上一页", tempUrl, "aBtn bold");
    }
}

function getBeginAndEndNum(pageCount, currentPage){
    var begin;
    var end;
    if(pageCount <= 6){
        begin = 1;
        end = pageCount;
    }else{
        begin = currentPage - 2;
        end = currentPage + 3;
        if(begin < 1){
            begin = 1;
            end = 6;
        }
        if(end > pageCount){
            begin = pageCount - 5;
            end = pageCount;
        }
    }
    return [begin, end];
}

function generateMiddlePart(pageCount, currentPage, url, pageElement) {
    var beginAndEnd = getBeginAndEndNum(pageCount, currentPage);
    var begin = beginAndEnd[0];
    var end = beginAndEnd[1];

    for(var i = begin; i <= end; i++){
        if(i == currentPage){
            appendSpanNode(pageElement, i, "spanBtnSelect");
        }else{
            var tempUrl = url+"&page.currentPage="+i;
            appendANode_supplierFee(pageElement, i, tempUrl, "aBtn");
        }
    }
    if(end < pageCount){
        appendSpanNode(pageElement, "...", "spanApostrophe");
    }

}
function generateDownAndGoPart(pageCount, currentPage, url, pageElement) {
    if(currentPage == pageCount || pageCount == 0){
        appendSpanNode(pageElement, "下一页", "spanBtnDisabled");
    }else{
        var tempUrl = url+"&page.currentPage="+(currentPage+1);
        var a = appendANode_supplierFee(pageElement, "下一页", tempUrl, "aBtn bold");
    }

    appendSpanNode(pageElement, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;共"+pageCount+"页 到")
    appendInputNode(pageElement, null, currentPage, "inputPageCode", "text", "pageCode");
    appendSpanNode(pageElement, "页 ");
    appendANode(pageElement, " 确定", "_go()", "")
}

/**
 * 生成一个span元素节点
 * @param parentNode
 * @param text
 * @param className
 * @returns {Element}
 */
function appendSpanNode(parentNode, text, className){
    var span = document.createElement("span");
    span.innerHTML = text;
    span.className = className;
    parentNode.appendChild(span);
    return span;
}

/**
 * 生成一个a元素节点
 * @param parentNode
 * @param text innerHTML
 * @param onclickStr <a onclick=""></a>中的onclick= 后面的字符串
 * @param className
 */
function appendANode(parentNode, text, onclickStr, className){
    var a = document.createElement("a");
    a.innerHTML = text;
    a.className = className;
    a.setAttribute("onclick", onclickStr);
    parentNode.appendChild(a);
}
/**
 * 生成一个a元素节点，专门为函数doGet_SupplierFee写的
 * @param parentNode
 * @param text
 * @param url
 * @param className
 */
function appendANode_supplierFee(parentNode, text, url, className){
    var a = document.createElement("a");
    a.innerHTML = text;
    a.className = className;
    a.setAttribute("onclick", "doGet_SupplierFee('"+url+"')");
    parentNode.appendChild(a);
}

/**
 * 生成一个input元素节点
 * @param parentNode
 * @param name
 * @param value
 * @param className
 * @param type
 * @param id
 * @returns {Element}
 */
function appendInputNode(parentNode, name, value, className, type, id){
    var input = document.createElement("input");
    input.value = value;
    input.name = name;
    input.className = className;
    input.type = type;
    input.id = id;
    parentNode.appendChild(input);
    return input;
}

