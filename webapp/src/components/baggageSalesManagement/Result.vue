<template>
    <div>
	<div class="operateContainer">
	    <ul class="operate-ul">
		<li class="op-btn op-btn-green" @click="showAddBaggageAllowance()">添加</li>
		<li class="op-btn op-btn-blue" @click="showBatchChangePrice()">批量调价</li>
		<li class="op-btn op-btn-red" @click="solutionsHanging(2)">挂起</li>
		<li class="op-btn op-btn-orange" @click="solutionsHanging(1)">解挂</li>
		<li class="op-btn op-btn-red" @click="batchDelete()">删除</li>
	    </ul>
	</div>
	<div class="reportContainer">
		<table class="reportTable">
		    <thead>
			<tr>
			    <th>
				<span class="btn-checkbox" 
					:class="{'select':selectList.length > 0 && dataList.length == selectList.length}" 
					@click="selectAllItem()"></span>
			    </th>
			    <th>航司</th>
			    <th>重量/基础价格</th>
			    <th>航线</th>
			    <th>直售调价</th>
			    <th>套餐价格</th>
			    <th>类型</th>
			    <th>状态</th>
			    <th>操作</th>
			</tr>
		    </thead>
		    <tr v-if="(dataList.length == 0 && !inRequest)">
			<td colspan="100">暂无数据</td>
		    </tr>
		    <tr v-else-if="inRequest">
			<td colspan="100" class="locdingImg" style="text-align:left;text-indent:28px;"><img :src="loading"></td>
		    </tr>
		    <tbody v-else>
			<tr v-for="(listItem,index) in dataList" >
			    <td>
				<span class="btn-checkbox" 
					:class="{'select':selectList.indexOf(listItem.id)>-1}" 
					@click="selectItem(listItem.id)"></span>
			    </td>
			    <td>{{ listItem.carrier || '' }} </td>
			    <td>
				<ul class="weight-price">
				    <li v-for="item in listItem.baggageInfos" :class="{'font-red' : item.packageType == 1}">
					<p>{{ item.weight+"KG" }}</p>
					<p>{{ item.price+"CNY" }}</p>
				    </li>
				</ul>
			    </td>
			    <td>{{ (listItem.dep || '-') + "-" +(listItem.arr || "-") }}</td>
			    <td>{{ listItem.directPrice|| '' }}</td>
			    <td>{{ listItem.packagePrice || '' }}</td>
			    <td>{{ listItem.type == 1 ? "人工录入" : "系统录取" }}</td>
			    <td>{{ listItem.status == 1 ? "有效":"无效" }}</td>
			    <td>
				<span class="btn-update btn-update-editor" @click="editHandle(listItem)"></span>
				<span class="btn-update btn-update-delete" @click="deleteHandle(listItem.id,index)"></span>
			    </td>
			</tr>
		    </tbody>
		</table>

		<!--分页效果的-->
		<div id="pageDiv">
			<PageBuilder
				:ResultCount='ResultCount'
				:CurrentPage='PageNo'
				:PageSize="PageSize"
				SelectShow="true"
				@gotoPage="pageList"
			/>
		</div>
	</div>
	<BatchChangePrice ref="batchChangePriceRef"></BatchChangePrice>
	<AddOrUpdata ref="addOrUpdataRef" ></AddOrUpdata>
    </div>
</template>

<script>
import bus from "components/eventBus.js";
import {getRequest,postRequest,extendAxios} from "js/service/APIService.js";
import crossDomain from "js/utils/crossDomain.js";
import PageBuilder from "js/PageBuilder/PageBuilder.vue";
import {CallWeakHint,CallCapacity} from 'js/capacityHintBox/capacityBox-2.0.1.js';
import BatchChangePrice from 'components/baggageSalesManagement/batchChangePrice.vue';
import AddOrUpdata from 'components/baggageSalesManagement/AddOrUpdata.vue';

export default {
    name: 'Result',
    data : function(){
	return{
	    dataList : [],
	    PageNo: 1,
            ResultCount: 0,
	    PageSize : 10,
	    params : {
		dep : "",
	        arr : "",
	        status : "",
	        carrier : "",
	        weight : "",
	    },
	    selectList : [],
	    inRequest : false,//是否正在请求，用于显示正在请求的动画
	    loading : require("../../images/loading.gif"),
	    requestStatue : false,
	};
    },
    mounted : function(){
	var _this = this;
	bus.$on("searchReq",function(data){
	    _this.PageNo = 1;
	    _this.receiveReq(data);
	});
	this.getSearchData();
	bus.$on("batchChangePrice",function(data){
	    _this.batchChangePriceRequest(data);
	});
	bus.$on("addUpdateBaggageSalesInfo",function(data,boxType){
	    _this.addUpdateBaggageSalesInfo(data,boxType);
	});
	
    },
    methods : {
	receiveReq : function(data){
	    if(this.inRequest)return;
	    this.params = data;
	    this.getSearchData();
	},
	pageList : function(curPage,curPageSize) {
	   this.PageNo = parseInt(curPage);
	   this.PageSize = parseInt(curPageSize);
	   this.getSearchData();
        },
	getSearchParams : function(){
	        var data = this.params;
		data.page = {
			currentPage : this.PageNo,
			pageSize : this.PageSize,
		}
		return data;
	},
	/* 获取列表数据 */
	getSearchData : function(){
	    this.inRequest = !this.inRequest;
	    this.clearResult();
	    var params = this.getSearchParams();
	    postRequest("/rule/baggage/list",params,this.resultDispose);
	},
	/* 处理获取请求数据结果 */
	resultDispose : function(result){
	    try{
		this.inRequest = !this.inRequest;
		if(result.code == 0){
			this.dataList =  result.extra.data;
			this.PageNo =  result.extra.currentPage;
			this.ResultCount =  result.extra.resultCount;
			this.PageSize =  result.extra.pageSize;
		}else{
			CallWeakHint(result.errMsg,"btn-error");
			this.clearResult();
			this.PageNo =  1;
			this.ResultCount =  0;
			this.PageSize =  10;
		}
	    }catch(e){
		console.error(e);
	    }
	},
	/* 清空搜索结果，
	   有些场景需要清空结果，比如获取请求之前或过去数据请求失败 
	*/
	clearResult : function(){
		this.dataList =  [];
	},
	/* 修改记录 */
	editHandle(data){
	    this.$refs.addOrUpdataRef.show(2,data);
	},
	/* 批量删除 */
	batchDelete(){
	    var _this = this;
	    CallCapacity({
		body_content: "确定删除这些行李信息吗?",
		foot_item:2,
		foot_itemContent:["确定","取消"],
		capacityClick:function(button){
		    if(button == "button1"){
			_this.deleteRequest(_this.selectList.join(","));
		    }
		}
	    });
	},
	/* 删除行李额前的确认 */
	deleteHandle(id){
	    var _this = this;
	    CallCapacity({
		body_content: "确定删除该条行李信息吗?",
		foot_item:2,
		foot_itemContent:["确定","取消"],
		capacityClick:function(button){
		    if(button == "button1"){
			_this.deleteRequest(id);
		    }
		}
	    });
	},
	/* 删除请求 */
	deleteRequest(id){
	    var params = { ids : id};
	    var _this = this;
	    this.requestStatue = !this.requestStatue;
	    postRequest("/rule/baggage/delete",params,function(result){
		try{
			_this.requestStatue = !_this.requestStatue;
			if(result.code == 0){
			    CallWeakHint("删除成功","btn-error");
			    _this.getSearchData();
			}else{
			    CallWeakHint(result.errMsg,"btn-error");
			}
		}catch(e){
		    console.error(e);
		    CallWeakHint("数据处理异常","btn-error");
		}
	    },true);
	},
	/* 选取每一项 */
	selectItem(id){
	    var currIndex = this.selectList.indexOf(id);
	    if(currIndex > -1){
		this.selectList.splice(currIndex,1);
	    }else{
		this.selectList.push(id);
	    }
	},
	/* 全选所有项 */
	selectAllItem(){
		if(this.dataList.length > 0 && this.dataList.length == this.selectList.length){
		    this.selectList = [];
		}else if(this.dataList.length > 0 && this.dataList.length != this.selectList.length){
		    var tempList = [];
		    this.dataList.some((item)=>{
			tempList.push(item.id);
		    })
		    this.selectList = tempList;
		}
	},
	/* 确认解挂/挂起 */
	solutionsHanging(type){
	    var _this = this;
	    var typeStr = type == 1? "解挂" : "挂起";
	    if(this.selectList.length == 0){
		CallWeakHint(`请选择需要${typeStr}的数据项。`,"btn-error");
		return;
	    }
	    CallCapacity({
		body_content: `确定${typeStr}这些行李信息吗?`,
		foot_item:2,
		foot_itemContent:["确定","取消"],
		capacityClick:function(button){
		    if(button == "button1"){
			_this.solutionsHangingRequest(type);
		    }
		}
	    });
	},
	/* 批量解挂/挂起请求 */
	solutionsHangingRequest(type){
	    var _this = this;
	    var params = {
		updateType : 2,
		status : type,
		ids : this.selectList,
	    };
	    this.requestStatue = !this.requestStatue;
	    postRequest("/rule/baggage/updatePriceOrStatus",params,function(result){
		try{
			_this.requestStatue = !_this.requestStatue;
			if(result.code == 0){
			    _this.getSearchData();
			    CallWeakHint("批量请求操作成功","btn-error");
			}else{
			    CallWeakHint(result.errMsg,"btn-error");
			}
		}catch(e){
		    console.error(e);
		    CallWeakHint("数据处理异常","btn-error");
		}
	    },true);
	},
	/* 展示批量调价 */
	showBatchChangePrice(){
	    if(this.selectList.length==0){
		CallWeakHint(`请选择需要操作的数据项。`,"btn-error");
		return;
	    }
	    this.$refs.batchChangePriceRef.show();
	},
	/* 批量请求提交 */
	batchChangePriceRequest(params){
	    var _this = this;
	    params.updateType = 1;
	    params.ids = this.selectList;
	    this.requestStatue = !this.requestStatue;
	    postRequest("/rule/baggage/updatePriceOrStatus",params,function(result){
		try{
			_this.requestStatue = !_this.requestStatue;
			if(result.code == 0){
			    _this.$refs.batchChangePriceRef.cancelHandle();
			    CallWeakHint("批量调价提交成功","btn-error");
			    _this.getSearchData();
			}else{
			    CallWeakHint(result.errMsg,"btn-error");
			}
		}catch(e){
		    console.error(e);
		    CallWeakHint("数据处理异常","btn-error");
		}
	    },true); 
	},
	/* 展示行李额 */
	showAddBaggageAllowance(){
	    this.$refs.addOrUpdataRef.show(1);
	},
	/* 添加/修改行李额信息 */
	addUpdateBaggageSalesInfo(params,boxType){
	    var _this = this;
	    this.requestStatue = !this.requestStatue;
	    extendAxios({
		url : boxType == 1?"/rule/baggage/create":"/rule/baggage/update",
		method : "POST",
		data : params,
		dataType : "JSON",				
	    },
	    function(result){
		try{
			_this.requestStatue = !_this.requestStatue;
			if(result.code == 0){
			    _this.$refs.addOrUpdataRef.cancelHandle();
			    var msg = boxType == 1?"添加成功": "修改成功";
			    CallWeakHint(msg,"btn-error");
			    _this.getSearchData();
			}else{
			    CallWeakHint(result.errMsg,"btn-error");
			}
		}catch(e){
		    console.error(e);
		    CallWeakHint("数据处理异常","btn-error");
		}
	    },true); 
	},
	
    },
    components :{
	PageBuilder,
	BatchChangePrice,
	AddOrUpdata,
    },
};
</script>

<style>

.weight-price li{display:inline-block;margin:0px 4px;line-height:20px;}
.font-red{color:red;}
</style>
