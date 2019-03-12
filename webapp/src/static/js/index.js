
/*全局变量：后台跳转路径*/
var index_path;/*这个模块的开始URL*/
var addSupplierFee_path;
var updateFrFee_path;
var queryFrFee_path;
var querySupplierFees_path;
var deleteSupplierFees_path;
var updateSupplierFees_path;
var querySupplierAfterSaleCode_path;

/*页面加载完成之后就执行此方法*/
$(document).ready(function () {
	initUrl();
    doGet_FrFeeAndSupplierFees();
});
/* 初始化地址   */
function initUrl(){
	index_path = getSelfUrl() + "/rule/fee/index";/*这个模块的开始URL*/
	addSupplierFee_path = getSelfUrl() + "/rule/supplier/add";
	//updateFrFee_path = getSelfUrl() + "/rule/fr/update";
	queryFrFee_path = getSelfUrl() + "/rule/fr/query";
	querySupplierFees_path = getSelfUrl() + "/rule/supplier/page";
	deleteSupplierFees_path = getSelfUrl() + "/rule/supplier/delete";
	updateSupplierFees_path = getSelfUrl() + "/rule/supplier/update";
	querySupplierAfterSaleCode_path = getSelfUrl() + "/rule/supplier/querySupplierAfterSaleCode";
}
/* 获取当前页面的域名   */
function getSelfUrl(){
	return window.location.protocol + "//" + window.location.host;
}
/*查询供应商和FR手续费*/
function doGet_FrFeeAndSupplierFees() {
    doGet_SupplierFee("",1);//供应商
    getPurchaserFeeRequest("",1);//采购商
    doGet_FrFee("0");//境内
    doGet_FrFee("1");//境外
    //doGet_FrFee();//fr
}
/*查询FR手续费, 并展示到表格中*/
function doGet_FrFee(region) {
	commitWarnShow();
    $.ajax({
        type: 'GET',
        url: "/rule/fr/query",
        data:"region="+region,
        dataType: "json",
        success: function(data){
        	commitWarnHide();
        	if( ! isNullOrEmpty(data.feFee) ){
        		showFrFee(data.feFee,region);
        	}else{
        		CallCapacity("","获取手续费失败","","");
        	}
        },
        error:function(data){
        	commitWarnHide();
        	CallCapacity("","获取手续费请求失败","","");
        }
    });
}
/*展示境内手续费*/
function showFrFee(data,region){
	data.region = region;
	if( region == 0 ){
		createInfoHtmlFn("#frFee-tbody-id_tmpl","#fr-mainland-tBody-id",data);
	}else if( region == 1 ){
		createInfoHtmlFn("#frFee-tbody-id_tmpl","#fr-overseas-tBody-id",data);
	}
}
/*查询供应商手续费， 并展示到表格中*/
function doGet_SupplierFee(supplier,currentPage) {
	var reqData = {
	        "page.currentPage" : currentPage,	
	};
	if( ! isNullOrEmpty(supplier) ){
		reqData.supplier = supplier;
	}
    commitWarnShow();
    $.ajax({
        type: 'GET',
        url: "/rule/supplier/page",
        data : reqData,
        dataType: "json",
        success: function(data){
        	commitWarnHide();
            showSupplierFees(data.supplierFees);
            var page1 = buildPage(data.page.resultCount,data.page.currentPage,data.page.pageSize,"#pageDiv_supplier",getSupplierData,false,"");
        },
        error:function(data){
        	commitWarnHide();
        	CallCapacity("","获取供应商手续费请求失败!","","");
        }
    });
}
/*点击供应商分页*/
function getSupplierData(currentPage,PageSize){
	doGet_SupplierFee("",currentPage);
}
/**
 * 把供应商手续费展示到表格中
 * @param supplierFees
 */
function showSupplierFees(supplierFees) {
    var tBody = document.getElementById("supplier-tbody-id");
    tBody.innerHTML = '';

    if(supplierFees == null) return ;

    var str = "";
    var len = supplierFees.length;
    for(var i = 0; i < len; i++){
        var supplierFee = supplierFees[i];
        str += '<tr>';

        str += "<td style='display:none;'>"+supplierFee.id+"</td>";
        str += "<td>"+(i+1)+"</td>";
        str += "<td>"+supplierFee.supplier+"</td>";
        str += "<td>"+supplierFee.currency+"</td>";
        str += "<td>"+supplierFee.refundFee+"</td>";
        str += "<td>"+supplierFee.changeFee+"</td>";
        str += "<td>"+supplierFee.signFee+"</td>";
        str += "<td>"+supplierFee.missFee+"</td>";
        str += "<td>"+supplierFee.invalidateFee+"</td>";
        str += "<td>"+supplierFee.extraBaggageFee+"</td>";
        str += "<td class='t_td'><div class='t_action'>" +
        		"<a onclick=launchModal_editSupplierFee(this) class='a_edit'>修改</a> " +
        		"<a onclick=deleteSupplierFee(this) class='a_del' >删除</a></div></td>";
        str+="</tr>";
    }
    tBody.innerHTML = str;
}
/*同步币种点击*/
$("#supplier_currency").click(function(){
	getSupplierCurrency();
});
/*点击同步币种获取供应商币种*/
function getSupplierCurrency(){
	if(! isNullOrEmpty($.trim($("#supplierID").val())) ){
		getSupplierCurrencyRequest();
	}else{
		CallCapacity("","请输入供应商代码","","");
	}
}
/*获取供应商币种请求*/
function getSupplierCurrencyRequest(){
	var supplierCode = $.trim($("#supplierID").val());
	$.ajax({
        type: "GET",
        url: querySupplierAfterSaleCode_path,
        data:"supplierCode="+supplierCode,
        dataType: "json",
        success: function(data){
            if(! isNullOrEmpty(data.fee)) {
            	$("#rule_modify").find("#currencyID").val(data.fee);//币种
            } else {
            	CallCapacity("","请输入供应商代码！","我知道了","");
            }
        },
        error:function(data) {
        	$("#currencyID").val(data);//币种
        	CallCapacity("","供应商代码输入不正确，请重新输入。","我知道了","");
        }
    });
}
/*添加供应商*/
function launchModel_addSupplierFee(){
	authorityCheck();
}
/*判断是否有权限请求*/
function authorityCheck(){
	$.ajax({
        url: "/rule/supplier/addSupplierFeeAuthorityCheck",
        dataType: "json",
        type:"GET",
        data:{},
        async:true,
        success: function (data) {
        		document.getElementById('title_p').innerHTML="增加供应商手续费信息";
        		$("#supplier_currency").css("display","inline-block");
        		$('#rule_modify').show();
        		setAddEventToModalButton();
        		clearSupplierEditModal();//清空模态窗口
        },
		error: function(data){
			if(data.status ==488){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/*为保存按钮上绑定事件增加供应商手续费*/
function setAddEventToModalButton() {
    $("#modify_save").attr("onclick", "addSupplierFee()");
}
/**
 * 增加供应商手续费。
 * 这个方法被动态绑定到modal窗口的按钮中。见方法{@link setAddEventToModalButton}
 */
function addSupplierFee() {
    //模态窗口中的表格
    var inputs = document.getElementById("supplierFeeFormID").getElementsByTagName("input");
    //supplierFee对象
    var supplierFee = {};

    if(checkSupplierInputFormat(inputs[1].value) == 0) return ;
    if(checkCurrencyInputFormat(inputs[2].value) == 0) return ;
    try{
        checkNumberFormat(3, 8, inputs);
        setSupplierFee(inputs, supplierFee);
    }catch (err){
    	CallCapacity("","注意：" + err,"我知道了","");
        return ;
    }
    commitWarnShow();
    $.ajax({
        type: "GET",
        url: addSupplierFee_path,
        data:supplierFee,
        dataType: "jsonp",
        success: function(data){
        	hideSupplierFeeModal();//隐藏modal窗口
        	commitWarnHide();
            if(data == 1) {
            	CallCapacity("","添加成功！","我知道了","");
                doGet_SupplierFee("",1);//更新表格
            } else {
            	CallCapacity("","添加失败！","我知道了","");
            }
        },
        error:function(XmlHttpRequest,textStatus, errorThrown) {
        	hideSupplierFeeModal();//隐藏modal窗口
        	commitWarnHide();
        	CallCapacity("","添加失败！\n可能原因：1.已经存在此供应商！ 2.输入数据不正确","我知道了","");
        }
    });
}
/* 修改供应商费用  */
function launchModal_editSupplierFee(arg) {
	$.ajax({
        url: "/rule/supplier/updateSupplierFeeAuthorityCheck",
        dataType: "json",
        type:"GET",
        data:{},
        async:true,
        success: function (data) {
        		if(arg == null) return ;
        	    var row=arg.parentNode.parentNode.parentNode;
        	    var inputs = document.getElementById("rule_modify").getElementsByTagName("input");
        	    inputs[0].value = row.cells[0].innerHTML;
        	    for(var i = 1; i < 9; i++){
        	        inputs[i].value = row.cells[i+1].innerHTML;
        	    }
        	    document.getElementById('supplierID').setAttribute("disabled", "disabled");
        	    $("#supplier_currency").css("display","none");
        	    document.getElementById('title_p').innerHTML="修改供应商手续费信息";
        	    $('#rule_modify').css("display","block");
        	    setEditEventToModalButton();
        },
		error: function(data){
			if(data.status ==488){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/* 给修改供应商费用的保存按钮添加事件 */
function setEditEventToModalButton() {
    $("#modify_save").attr("onclick", "editSupplierFee()");
}
/*编辑供应商手续费*/
function editSupplierFee(){
    //模态窗口中的表格
    var inputs = document.getElementById("supplierFeeFormID").getElementsByTagName("input");
    //supplierFee对象
    var supplierFee = {};
    supplierFee.id = parseInt(inputs[0].value);

    if(checkSupplierInputFormat(inputs[1].value) == 0) return ;

    if(checkCurrencyInputFormat(inputs[2].value) == 0)return ;
    try{
        checkNumberFormat(3, 8, inputs);
        setSupplierFee(inputs, supplierFee);
    }catch (err){
    	CallCapacity("","注意："+err,"我知道了","");
        return ;
    }
    commitWarnShow();
    $.ajax({
        type: "GET",
        url: updateSupplierFees_path,
        data:supplierFee,
        dataType: "jsonp",
        success: function(data){
        	hideSupplierFeeModal();
        	commitWarnHide();
            if(data == 1) {
            	CallCapacity("","更改成功！","我知道了","");
        		//查询这个供应商的手续费
    			doGet_SupplierFee(supplierFee.supplier,1);
            } else if(data == -1){
            	CallCapacity("","不存在此供应商","我知道了","");
            }else {
            	CallCapacity("","更改失败！","我知道了","");
            }
        },
        error:function(XmlHttpRequest,textStatus, errorThrown) {
        	hideSupplierFeeModal();
        	commitWarnHide();
        	CallCapacity("","更改失败！请检查所输入的数据是否正确","我知道了","");
        }
    });
}

/**
 *  检查所输入的供应商代码的格式是否正确
 * @param supplierCode
 * @returns {number} 0,表示格式不正确； 1，表示格式正确。
 */
function checkSupplierInputFormat(supplierCode){
    if(supplierCode == null || supplierCode == ''||supplierCode.trim().length == 0){
    	CallCapacity("","注意：“供应商”不能为空！","我知道了","");
        return 0;
    }
    if(supplierCode.trim().length > 6){
    	CallCapacity("","注意：输入的“供应商代码”不正确，长度超过了6！","我知道了","");
        return 0;
    }
    return 1;
}

/**
 * 检查所输入的币种的格式是否正确
 * @param currency
 * @returns {number} {number} 0,表示格式不正确； 1，表示格式正确。
 */
function checkCurrencyInputFormat(currency) {
    if(currency == null || currency == '' || currency.trim().length == 0){
    	CallCapacity("","注意：“币种”不能为空！","我知道了","");
        return 0;
    }
    if(currency.trim().length > 6){
    	CallCapacity("","注意：输入的“币种”不正确，长度超过了6！","我知道了","");
        return 0;
    }
    return 1;
}

//检测数组中的元素是否为数字,如果不是数字，就抛出异常。
function checkNumberFormat(startIndex, endIndex, inputs) {
    for(var i = startIndex; i <= endIndex; i++){
        if(inputs[i].value != null && inputs[i].value != ''){
            if(isNaN(inputs[i].value)) {
                throw "输入数据格式不正确！";
            }else if(isNumOutOfRange(inputs[i].value)){
                throw "输入数据小数点最多保留4位！";
            }
        }
    }
}
/*检查数字小数点后面是否大于4位，是就return true*/
function isNumOutOfRange(num) {
    var index = num.indexOf('.');
    if(index == -1) return false;
    if((num.length - 1 - index) <= 4) return false;
    return true;
}

/* 隐藏供应商修改窗口  */
function hideSupplierFeeModal() {
    $('#rule_modify').hide();//隐藏modal窗口
    clearSupplierEditModal();
}
/*清空供应商编辑弹窗*/
function clearSupplierEditModal(){
    document.getElementById('supplierID').removeAttribute('disabled');
    var inputs = document.getElementById("supplierFeeFormID").getElementsByTagName("input");
    var len = inputs.length;
    for(var i = 0; i < len; i++){
        inputs[i].value = '';
    }
}

function setSupplierFee(src, supplierFee) {
    supplierFee.supplier = src[1].value.toUpperCase().trim();
    supplierFee.currency = src[2].value.toUpperCase().trim();
    if(src[3].value != null && src[3].value != '')
        supplierFee.refundFee = parseFloat(src[3].value);
    if(src[4].value != null && src[4].value != '')
        supplierFee.changeFee = parseFloat(src[4].value);
    if(src[5].value != null && src[5].value != '')
        supplierFee.signFee = parseFloat(src[5].value);
    if(src[6].value != null && src[6].value != '')
        supplierFee.missFee = parseFloat(src[6].value);
    if(src[7].value != null && src[7].value != '')
        supplierFee.invalidateFee = parseFloat(src[7].value);
    if(src[8].value != null && src[8].value != '')
        supplierFee.extraBaggageFee = parseFloat(src[8].value);
}
/*删除供应商*/
function deleteSupplierFee(obj) {
	$.ajax({
        url: "/rule/supplier/deleteSupplierFeeAuthorityCheck",
        dataType: "json",
        type:"GET",
        data:{},
        async:true,
        success: function (data) {
        		CallCapacity({
        			body_content:"确定要删除这一行内容吗？",
        			foot_item : 2,
        			foot_itemContent: ["确定","取消"],
        			foot_buttonBg:["#eee","#eee"],
        			foot_buttonColor:["#666","#666"],
        			capacityClick:function(data1){
        				if(data1 == "button1"){
        					var row = obj.parentNode.parentNode.parentNode;
        				    var supplierFeeID = row.cells[0].innerHTML;
        				    commitWarnShow();
        				    $.ajax({
        				        type: "GET",
        				        url: deleteSupplierFees_path+"?id="+supplierFeeID,
        				        data:"",
        				        dataType: "jsonp",
        				        success: function(data){
        				        	commitWarnHide();
        				            if(data == 1) {
        				            	CallCapacity("","删除成功！","确定",function (data2){
        				            		doGet_SupplierFee("",1);
        				            	});
        				            } else {
        				            	CallCapacity("","删除失败！","确定","");
        				            }
        				        },
        				        error:function(XmlHttpRequest,textStatus, errorThrown) {
        				        	commitWarnHide();
        				        	CallCapacity("","删除失败！","确定","");
        				        }
        				    });
        				}
        			}
        		});
        },
		error: function(data){
			if(data.status ==488){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/*点击查询供应商*/
function querySupplierFeeBySupplier() {
    var supplier = $("#search-id").val();
    doGet_SupplierFee(supplier,1);
    $("#search-id").val("");
}
/*编辑fr手续费*/
function launchModal_editFrFee(obj) {
	var region = $(obj).attr("region");
	$.ajax({
        url: "/rule/fr/updateFrFeeAuthorityCheck",
        dataType: "json",
        type:"POST",
        data:{},
        async:true,
        success: function (data) {
        	clearFrFeeModal();
        	if(region == 0){
        		$("#title_fr").html("修改FR24境内手续费");
        	}else if(region == 1){
        		$("#title_fr").html("修改FR24境外手续费");
        	}
        	getFrFeeDetailInfo(region);
        },
		error: function(data){
			if(data.status == 488){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });      		
}
/*修改时获取FR手续费*/
function getFrFeeDetailInfo(region){
	$.ajax({
        type: 'GET',
        url: "/rule/fr/query",
        data:"region="+region,
        dataType: "json",
        success: function(data){
        	if( ! isNullOrEmpty(data.feFee) ){
        		setFrFee(data.feFee,region);
        		showFeeModal();
        	}else{
        		CallCapacity("","获取手续费失败","","");
        	}
        },
        error:function(data){
        	CallCapacity("","获取手续费请求失败","","");
        }
    });
}
/*设置FR输入框的值*/
function setFrFee(data,region) {
	$("#currency_fr").val(data.currency);
	$("#refundFee_fr").val(data.refundFee);
	$("#changeFee_fr").val(data.changeFee);
	$("#signFee_fr").val(data.signFee);
	$("#missFee_fr").val(data.missFee);
	$("#invalidateFee_fr").val(data.invalidateFee);
	$("#extraBaggageFee_fr").val(data.extraBaggageFee);
	$("#FR_modify_save").attr("region",region);
}
/*编辑fr手续费后保存*/
function updateFrFee() {
    if( validFrFeeSave() ){
    	updateFrFeeRequest();
    }
}
/*校验fr手续费保存*/
function validFrFeeSave(){
	return validFrFeeCurrency()
		&& validPrice("#refundFee_fr") 
		&& validPrice("#changeFee_fr") 
		&& validPrice("#signFee_fr") 
		&& validPrice("#missFee_fr") 
		&& validPrice("#invalidateFee_fr") 
		&& validPrice("#extraBaggageFee_fr");
}
/*校验fr手续费币种*/
function validFrFeeCurrency(){
	var purchaserCode = $.trim($("#currency_fr").val());
	if( isNullOrEmpty(purchaserCode) ){
		CallCapacity("","请输入币种","","");
		return false;
	}
	return true;
}
/*修改FR手续费请求*/
function updateFrFeeRequest(){
	var reqData = updateFrFeeRequestData();
	$.ajax({
        type: 'POST',
        url: "/rule/fr/update",
        dataType: "jsonp",
        data:reqData,
        success: function(data){
        	commitWarnHide();
            if( data == 1 ) {
            	CallCapacity("","更新成功","","");
            	hideFeeModal();//隐藏modal窗口
            	clearFrFeeModal();
                doGet_FrFee(reqData.region);
            } else {
            	CallCapacity("","更改失败","","");
            }
        },
        error:function(data) {
        	commitWarnHide();
        	CallCapacity("","更改请求失败！请检查所输入的数据是否正确","","");
        }
    });
}
/*修改FR手续费请求数据*/
function updateFrFeeRequestData(){
	var reqData = {
			"currency" : $.trim($("#currency_fr").val()),
			"refundFee" : $.trim($("#refundFee_fr").val()),
			"changeFee" : $.trim($("#changeFee_fr").val()),
			"signFee" : $.trim($("#signFee_fr").val()),
			"missFee" : $.trim($("#missFee_fr").val()),
			"invalidateFee" : $.trim($("#invalidateFee_fr").val()),
			"extraBaggageFee" : $.trim($("#extraBaggageFee_fr").val()),
			"region" : $("#FR_modify_save").attr("region"),
	};
	return reqData;
}
/*清空模态框*/
function clearFrFeeModal(){
	$("#frFeeForm-ID")[0].reset();
}
/*隐藏模态框*/
function hideFeeModal(){
	$("#rule_FR_modify").hide();
}
/*显示模态框*/
function showFeeModal(){
	$("#rule_FR_modify").show();
}
/*隐藏采购商框*/
function hidePurchaserFeeModal(){
	$("#rule_purchaser_modify").hide();
}
/*显示采购商框*/
function showPurchaserFeeModal(){
	$("#rule_purchaser_modify").show();
}
/*清空采购商框*/
function clearPurchaserFeeModal(){
	$("#purchaserCode").val("");
	$("#purchaserCode").removeAttr("disabled");
	$("#currency_purchaser").val("");
	$("#refundFee_purchaser").val("");
	$("#changeFee_purchaser").val("");
	$("#signFee_purchaser").val("");
	$("#missFee_purchaser").val("");
	$("#invalidateFee_purchaser").val("");
	$("#extraBaggageFee_purchaser").val("");
}
/*设置采购商框*/
function setPurchaserFeeModal(data){
	$("#purchaserCode").val(data.purchaserCode);
	$("#currency_purchaser").val(data.currency);
	$("#refundFee_purchaser").val(data.refundFee);
	$("#changeFee_purchaser").val(data.changeFee);
	$("#signFee_purchaser").val(data.signFee);
	$("#missFee_purchaser").val(data.missFee);
	$("#invalidateFee_purchaser").val(data.invalidateFee);
	$("#extraBaggageFee_purchaser").val(data.extraBaggageFee);
}
/*获取保存请求的数据*/
function getSavePurchaserReqData(){
	var reqData = {
			"purchaserCode" : $.trim($("#purchaserCode").val()),
			"currency" : $.trim($("#currency_purchaser").val()),
			"refundFee" : $.trim($("#refundFee_purchaser").val()),
			"changeFee" : $.trim($("#changeFee_purchaser").val()),
			"signFee" : $.trim($("#signFee_purchaser").val()),
			"missFee" : $.trim($("#missFee_purchaser").val()),
			"invalidateFee" : $.trim($("#invalidateFee_purchaser").val()),
			"extraBaggageFee" : $.trim($("#extraBaggageFee_purchaser").val())
	};
	return reqData;
}
/*点击查询采购商手续费列表*/
function queryPurchaserFeeByPurchaser(){
	var purchaserCode = $("#purchaserCodeInput").val();
	getPurchaserFeeRequest(purchaserCode,1);
}
/*获取采购商手续费列表请求*/
function getPurchaserFeeRequest(purchaserCode,currentPage){
	commitWarnShow();
	var reqData = {
			"page.currentPage" : currentPage
	};
	if( ! isNullOrEmpty(purchaserCode) ){
		reqData.purchaserCode = purchaserCode;
	}
	$.ajax({
        type : 'GET',
        url : "/rule/purchaser/page",
        dataType : "json",
        data : reqData,
        success: function(data){
        	commitWarnHide();
        	showPurchaserFees(data.purchaserFees);
        	var purchaser = buildPage(data.page.resultCount,data.page.currentPage,data.page.pageSize,"#pageDiv_purchaser",getPurchaserData,false,"");
        },
        error:function(data) {
        	commitWarnHide();
        	createInfoHtmlFn("#purchaser-tbody-id_tmpl","#purchaser-tbody-id","");
        	var purchaser = buildPage(0,1,10,"#pageDiv_purchaser",getPurchaserData,false,"");
        	CallCapacity("","获取采购商手续费列表请求失败!","","");
        }
    });
}
/*创建订单信息列表数据*/
function createInfoHtmlFn(tmplObj,targetObj,data){
	var orderInfoFn = doT.template( $(tmplObj).html() );
	var adultResultText = orderInfoFn( data );
	$(targetObj).html( adultResultText );
}
/*展示采购商手续费*/
function showPurchaserFees(data){
	createInfoHtmlFn("#purchaser-tbody-id_tmpl","#purchaser-tbody-id",data);
}
/*点击采购商分页*/
function getPurchaserData(currentPage,pageSize){
	getPurchaserFeeRequest("",currentPage);
}
/*点击添加采购商手续费*/
function launchModal_addPurchaserFee(){
	authorityCheck_addPurchaserFee();
}
/*添加采购商手续费校验权限*/
function authorityCheck_addPurchaserFee(){
	commitWarnShow();
	$.ajax({
        url : "/rule/purchaser/addPurchaserFeeAuthorityCheck",
        dataType : "json",
        type : "GET",
        data : {},
        async : true,
        success : function (data) {
        	commitWarnHide();
    		clearPurchaserFeeModal();//清空模态窗口
    		$("#title_purchaser").html("增加采购商手续费信息");
    		$("#purchaserCode").removeAttr("disabled");
    		$("#currency_purchaser_synchronize").css("display","inline-block");
    		$("#modify_save_purchaser").attr("saveState","add");
    		showPurchaserFeeModal();//展示采购商框
        },
		error: function(data){
			commitWarnHide();
			if( data.status == 488 ){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/*添加采购商手续费*/
function addPurchaserFee(){
	if( validPurchaserFeeSave() ){
		addPurchaserFeeRequest();
	}
}
/*添加保存采购商手续费请求*/
function addPurchaserFeeRequest(){
	commitWarnShow();
	$.ajax({
        url : "/rule/purchaser/add",
        dataType : "json",
        type : "GET",
        data : getSavePurchaserReqData(),
        async : true,
        success : function (data) {
        	commitWarnHide();
            if( data == 1 ){
            	CallCapacity("","添加成功！","我知道了","");
            	hidePurchaserFeeModal();//隐藏modal窗口
            	getPurchaserFeeRequest("",1);//更新表格
            } else if( data == -3 ){
            	CallCapacity("","采购商手续费配置已经存在","我知道了","");
            }else if( data == -4 ){
            	CallCapacity("","最多支持两位小数","我知道了","");
            }else{
            	CallCapacity("","添加失败！","我知道了","");
            }
        },
		error: function(data){
			commitWarnHide();
			hidePurchaserFeeModal();
			CallCapacity("","添加请求失败！","","");
		}
    });
}
/*采购商点击同步币种*/
$("#currency_purchaser_synchronize").click(function(){
	getPurchaserCurrency();
});
/*点击同步币种获取供应商币种*/
function getPurchaserCurrency(){
	if( validPurchaserCode() ){
		getPurchaserCurrencyRequest();
	}
}
/*校验采购商代码*/
function validPurchaserCode(){
	var purchaserCode = $.trim($("#purchaserCode").val());
	if( isNullOrEmpty(purchaserCode) ){
		CallCapacity("","请输入采购商代码","","");
		return false;
	}
	return true;
}
/*获取供应商币种请求*/
function getPurchaserCurrencyRequest(){
	var purchaserCode = $.trim($("#purchaserCode").val());
	$.ajax({
        type: "GET",
        url: "/rule/purchaser/queryPurchaserCurrency",
        data:{
        	"purchaserCode" : purchaserCode
        },
        async : true,
        dataType: "json",
        success: function(data){
            if( ! isNullOrEmpty(data.currency) ) {
            	$("#currency_purchaser").val(data.currency);//币种
            	$("#purchaserCode").attr("disabled",true);
            } else {
            	CallCapacity("","获取币种失败!","","");
            }
        },
        error:function(data) {
        	CallCapacity("","获取币种请求失败!","","");
        }
    });
}
/*点击编辑采购商手续费*/
function launchModal_editPurchaserFee(obj){
	authorityCheck_editPurchaserFee(obj);
}
/*编辑采购商手续费校验权限*/
function authorityCheck_editPurchaserFee(obj){
	commitWarnShow();
	var purchaserCode = $(obj).attr("code");
	$.ajax({
        url : "/rule/purchaser/updatePurchaserFeeAuthorityCheck",
        dataType : "json",
        type : "GET",
        data : {},
        async : true,
        success : function (data) {
        	commitWarnHide();
        	clearPurchaserFeeModal();//清空模态窗口
    		$("#title_purchaser").html("修改采购商手续费信息");
    		$("#purchaserCode").attr("disabled",true);
    		$("#currency_purchaser_synchronize").css("display","none");
    		$("#modify_save_purchaser").attr("saveState","edit")
    		getPurchaserDetailInfo(purchaserCode);
        },
		error: function(data){
			commitWarnHide();
			if( data.status == 488 ){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/*修改采购商手续费先获取信息回显*/
function getPurchaserDetailInfo(purchaserCode){
	commitWarnShow();
	var reqData = {
			"purchaserCode" : purchaserCode
	};
	$.ajax({
        type : 'GET',
        url : "/rule/purchaser/page",
        dataType : "json",
        data : reqData,
        success: function(data){
        	commitWarnHide();
        	setPurchaserFeeModal( data.purchaserFees[0] );
        	showPurchaserFeeModal();//展示采购商框
        },
        error:function(data) {
        	commitWarnHide();
        	CallCapacity("","获取采购商手续费请求失败!","","");
        }
    });
}
/*编辑采购商手续费*/
function editPurchaserFee(){
	if( validPurchaserFeeSave() ){
		editPurchaserFeeRequest();
	}
}
/*编辑保存采购商手续费请求*/
function editPurchaserFeeRequest(){
	commitWarnShow();
	$.ajax({
        url : "/rule/purchaser/update",
        dataType : "json",
        type : "GET",
        data : getSavePurchaserReqData(),
        async : true,
        success : function (data) {
        	commitWarnHide();
        	if( data == 1 ){
        		CallCapacity("","修改成功!","","");
        		hidePurchaserFeeModal();
        		getPurchaserFeeRequest($("#purchaserCode").val(),1);
        	}else{
        		CallCapacity("","修改失败!","","");
        	}
        },
		error: function(data){
			commitWarnHide();
			CallCapacity("","修改请求失败!","","");
		}
    });
}
/*点击供应商保存按钮*/
function savePurchaserFee(){
	var state = $("#modify_save_purchaser").attr("saveState");
	if( state == "add" ){
		addPurchaserFee();
	}else if( state == "edit" ){
		editPurchaserFee();
	}
}
/*校验采购商手续费保存*/
function validPurchaserFeeSave(){
	return validPurchaserCode() 
		&& validPurchaserCurrency()
		&& validPrice("#refundFee_purchaser") 
		&& validPrice("#changeFee_purchaser") 
		&& validPrice("#signFee_purchaser") 
		&& validPrice("#missFee_purchaser") 
		&& validPrice("#invalidateFee_purchaser") 
		&& validPrice("#extraBaggageFee_purchaser");
}
/*校验采购商币种*/
function validPurchaserCurrency(){
	var currency = $.trim($("#currency_purchaser").val());
	if( isNullOrEmpty(currency) ){
		CallCapacity("","币种不能为空","","");
		return false;
	}
	return true;
}
/*校验手续费*/
function validPrice(obj){
	var value = $.trim( $(obj).val() );
	var regExp = /^\d+(\.\d+)?$/;
	if( (! isNullOrEmpty(value)) && (! regExp.test(value)) ){
		$(obj).addClass("error");
		return false;
	}
	$(obj).removeClass("error");
	return true;
}
/*点击删除采购商手续费*/
function launchModal_deletePurchaserFee(obj){
	authorityCheck_deletePurchaserFee(obj);
}
/*删除采购商手续费校验权限*/
function authorityCheck_deletePurchaserFee(obj){
	commitWarnShow();
	var purchaserId = $(obj).attr("code");
	$.ajax({
        url : "/rule/purchaser/deletePurchaserFeeAuthorityCheck",
        dataType : "json",
        type : "GET",
        data : {},
        async : true,
        success : function (data) {
        	commitWarnHide();
        	deletePurchaserFee(purchaserId);
        },
		error: function(data){
			commitWarnHide();
			if( data.status == 488 ){
				CallCapacity("","你没有权限访问/操作此功能","","");
				return;
			}
		}
    });
}
/*删除采购商手续费*/
function deletePurchaserFee(purchaserId){
	CallCapacity({
        body_content:"是否确认删除该采购商手续费",
        foot_item:2,
        foot_itemContent:["确认","取消"],
        capacityClick:function(data){
            if(data == "button1"){
            	deletePurchaserFeeRequest(purchaserId);
            }
        }
    });
}
/*删除采购商手续费请求*/
function deletePurchaserFeeRequest(purchaserId){
	commitWarnShow();
	$.ajax({
        url : "/rule/purchaser/delete",
        dataType : "json",
        type : "GET",
        data : {
        	"id" : purchaserId,
        },
        async : true,
        success : function (data) {
        	commitWarnHide();
        	if( data == 1 ){
        		CallCapacity("","删除成功!","","");
            	getPurchaserFeeRequest("",1);
        	}else{
        		CallCapacity("","删除失败!","","");
        	}
        },
		error: function(data){
			commitWarnHide();
			CallCapacity("","删除请求失败!","","");
		}
    });
}
/* 请求操作的提示 显示 */
function commitWarnShow(){
	$("#commit_yy").show();
	$("#commit_title").show();
}
/* 请求操作的提示隐藏  */
function commitWarnHide(){
	$("#commit_yy").hide();
	$("#commit_title").hide();
}