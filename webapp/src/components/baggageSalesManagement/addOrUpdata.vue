<template>
    <div class="addOrUpdata" v-show="showBox">
	<div class="window-box-contailner">
		<div class="header">{{boxType==1?"添加行李额信息":"修改行李额信息"}}</div>
		<ul class="window-box-content">
		    <li>
			<div class="li-item">
			    <span>航司：</span> 
			    <input type="text" class="sn-input-box carrier" v-model.trim="carrier" :disabled="boxType == 2"
				:class="{'errorInout': isSubmit && !checkCarrier(carrier) }"
				@input="toUppercase($event,'carrier')"/>
			</div>
			<div class="li-item">
			    <span>价格获取方式：</span> 
			    <select class="sn-select-box"  v-model="type" :disabled="boxType == 2">
				    <option value="1">人工录入</option>
				    <option value="2">系统读取</option>
			    </select>
			</div>
			<div class="li-item">
			    <span>直售调价：</span> <input type="text" class="sn-input-box" v-model.trim="directPrice"
				:class="{'errorInout': isSubmit && !checkPrice(directPrice) }" /> CNY
			</div>
			<div class="li-item">
			    <span>套餐调价：</span> <input type="text" class="sn-input-box" v-model.trim="packagePrice"
				:class="{'errorInout': isSubmit && !checkPrice(packagePrice) }" /> CNY
			</div>
			<div class="li-item">
			    <span>适用行程：</span> <input type="text" class="sn-input-box route-input" v-model.trim="depArr" :disabled="boxType == 2"
				:class="{'errorInout': isSubmit && !checkDepArr(depArr) }" 
				@input="toUppercase($event,'depArr')"/>
			</div>
		    </li>
		    <li>
			<div class="li-item weightPriceList" v-for="(item,index) in baggageInfos">
			    <div class="weightPriceItem-left">
				    <div class="deleteWeightPrice" v-show="!(index == 0 && baggageInfos.length == 1) ">
					<span class="btn-update btn-update-delete" @click="deleteWeightPriceItem(index)"></span>
				    </div>
				    <div class="weightPriceItem-warpper">
					    <div class="weightPriceItem">
						<span>重量：</span> 
						<input type="text" class="sn-input-box" v-model.trim="item.weight"
							:class="{'errorInout': isSubmit && !checkWeight(item.weight) }" /> KG 
					    </div>
					    <div class="weightPriceItem">
						<span>价格：</span> 
						<input type="text" class="sn-input-box" v-model.trim="item.price"
							:class="{'errorInout': isSubmit && !checkPrice(item.price) }" /> CNY
					    </div>
				    </div>
				    <div class="selectPackageType">
					<label @click="selectPackageType(item)">
						<span class="btn-checkbox" :class="{'select': item.packageType == 1 }" ></span>
						套餐产品
					</label>
				    </div>
			    </div>
			    <div class="addWeightPriceItem" v-show="index == 0" @click="addPackageTypeItem()">
				添加
			    </div>
			</div>
		    </li>
		</ul>
		<div class="footer queryAction">
		    <button class="queryBtn" @click="saveHandle">保存</button>
		    <button class="clearBtn" @click="cancelHandle">取消</button>
		</div>
		
		<div class="log-wrapper" v-show="boxType == 2 && logList.length > 0">
		    <p class="title">日志</p>
		    <ul >
			<li v-for="item in logList">
				<span class="log-left">{{new Date(item.opTime).dateFormat("yyyy-MM-dd hh:mm:ss")}} : </span>  
				<span class="log-right">{{item.operator +" &nbsp;&nbsp;&nbsp;"+ item.opContent}}</span>
			</li>
		    </ul>
		</div>
	</div>
    </div>
</template>

<script>
import bus from "../eventBus.js";
/* eslint-disable no-unused-vars */
import jsUtils from "js/utils/jsUtils.js";
/* eslint-enable no-unused-vars */
import {CallWeakHint,CallCapacity} from 'js/capacityHintBox/capacityBox-2.0.1.js';
import {getRequest,postRequest,extendAxios} from "js/service/APIService.js";

export default {
    name : 'Search',
    data : function(){
        var _this = this;
        return{
	    boxType : 1,	//是添加还是修改弹窗，1：添加; 2：修改 
	    id : "",
	    carrier : "",
	    type : 1,
	    depArr : "",
	    directPrice : "",
	    packagePrice : "",
	    baggageInfos : [{
		    weight : "",			   
                    price : "",			   
                    packageType : 2, 
	    }],
	    showBox : false,
	    isSubmit : false, //是否提交过
	    logList : [],
        };
    },
    methods : {
	saveHandle : function (){
	    this.isSubmit = !this.isSubmit;
	    var params = {
		baggageInfos : this.baggageInfos,
		carrier : this.carrier,
		directPrice : this.directPrice,		    
		packagePrice : this.packagePrice,			  
		route : this.depArr,
		type : this.type,
		id : this.id,
	    };
	    var verifyResult = this.verifyRequestParams(params);
	    if(verifyResult.code != 0){
		CallWeakHint(verifyResult.msg,"btn-error");
		return;
	    }
	    bus.$emit("addUpdateBaggageSalesInfo",params,this.boxType);
	},
	verifyRequestParams(params){
	    var _this = this;
	    if(!this.checkDispatch("carrier",params.carrier) || 
		!this.checkDispatch("directPrice",params.directPrice) ||
		!this.checkDispatch("packagePrice",params.packagePrice) || 
		!this.checkDispatch("depArr",params.route)){
	        return {
		    code : 1,
		    msg : "请求参数缺失或有误，请填写后再提交！",
		}
	    }
	    /* 重量不可以有相等的 */
	    var weight = "";
	    var result = params.baggageInfos.every((item)=>{
	        var flag = (_this.checkDispatch("weight",item.weight) && _this.checkDispatch("price",item.price) && item.weight != weight);
		weight = item.weight;
		return flag;
	    })
	    if(!result){
		return {
		    code : 1,
		    msg : "请求参数缺失或有误，请填写后再提交！",
		}
	    }
	    return {
		code : 0
	    }
	},
	checkDispatch(name,value){
	    var result = true;
	    switch(name){
		case "carrier" : 
		    result = this.checkCarrier(value);
		    break;
		case "depArr" :
		    result = this.checkDepArr(value);
		    break;
		case "directPrice" :
		    result = this.checkPrice(value);
		    break;
		case "packagePrice" :
		    result = this.checkPrice(value);
		    break;
		case "weight" :
		    result = this.checkWeight(value);
		    break;
		case "price" :
		    result = this.checkPrice(value);
		    break;
		default : 
		    break;
	    }
	    return result;
	},
	cancelHandle : function (){
	    this.directPrice = "";
	    this.packagePrice = "";
	    this.showBox = false;
	},
	show(boxType,data){
	    this.showBox = true;
	    this.boxType = boxType;
	    this.isSubmit = false;
	    if(data){
		this.id = data.id,
		this.carrier = data.carrier;
		this.depArr = data.dep+"-"+data.arr;
		this.type = data.type;
		this.directPrice = data.directPrice;
		this.packagePrice = data.packagePrice;
		this.baggageInfos = JSON.parse(JSON.stringify(data.baggageInfos));
		this.getLogListData(data.id);
	    }else{
		this.id = "",
		this.carrier = "";
		this.depArr = "";
		this.type = 1;
		this.directPrice = "";
		this.packagePrice = "";
		this.baggageInfos = [{
		    weight : "",			   
                    price : "",			   
                    packageType : 2, 
		}];
	    }
	},
	setDirectPriceRange(){
	    if(!/^\d{1,4}$/.test(this.directPrice)){
		this.directPrice = "";
	    }
	},
	setPackagePriceRange(){
	    if(!/^\d{1,3}$/.test(this.packagePrice)){
		this.packagePrice = "";
	    }
	},
	/* 航司 */
	checkCarrier(value){
	    if(/^[A-Z0-9]{2}$/.test(value)){
		return true;
	    }
	    return false;
	},
	/* 校验价格 */
	checkPrice(value){
	    if(/^\d{1,4}$/.test(value)){
		return true;
	    }
	    return false;
	},
	/* 校验重量 */
	checkWeight(value){
	    if(/^\d{1,3}$/.test(value)){
		return true;
	    }
	},
	/* 校验使用行程 */
	checkDepArr(value){
	    var list = (value || "").split(",");
	    var result = list.every(function(item){
		return /^([A-Z]{3})+([~-]{1})+([A-Z]{3})$/.test(item)
	    })
	    return result;
	},
	/* 字母转大写 */
	toUppercase(event,elName){
	    switch(elName){
		case "carrier" : 
		    this.carrier = event.target.value.toUpperCase();
		    break;
		case "depArr" :
		    this.depArr = event.target.value.toUpperCase();
		    break;
		default : 
		    break;
	    }
	},
	/* 选择套餐产品 */
	selectPackageType(itemObj){
	    if(itemObj.id)return;
	    itemObj.packageType = (itemObj.packageType == 1 ? 2 : 1);
	},
	/* 删除套餐产品项 */
	deleteWeightPriceItem(index){
	    this.baggageInfos.splice(index,1);
	},
	/* 添加套餐产品项 */
	addPackageTypeItem(){
	    this.baggageInfos.push({
		weight : "",			   
                price : "",			   
                packageType : 2,  
	    });
	},
	/* 获取日志 */
	getLogListData(id){
	    var _this = this;
	    getRequest("/rule/baggage/getLogs",{id:id},(result)=>{
		if(result.code == 0){
		    _this.logList = result.extra;
		    return ;
		}
		_this.logList = [];
	    },true);
	}
    },
};
</script>

<style lang="scss"  scoped>

.addOrUpdata{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    overflow:scroll;
}
.window-box-contailner{
    width:600px;
    background:#fff;
    margin:100px auto;
    overflow: hidden;
}

.header{height:40px;line-height:40px;padding:0 20px;box-sizing:border-box;font-size:15px;font-weight:700;border-bottom:1px solid #ddd;}
.window-box-content{
    padding:40px;
    box-sizing:border-box;
}
.window-box-content li{margin:5px 0;background:#f5f5f5;padding:10px;box-sizing:border-box;}
.li-item{margin:5px 0px;}
.route-input{width:400px;}

.errorInout{border:1px solid red;}
.weightPriceItem{
    margin:5px 0px;
}
.weightPriceItem-left{display:inline-block;width: 80%;
    background: #ddd;
    padding: 5px;}
.weightPriceItem-warpper,
.selectPackageType,
.deleteWeightPrice{display:inline-block;vertical-align: middle;}
.deleteWeightPrice{width:60px;}
.selectPackageType{margin-left:30px;}
.addWeightPriceItem{    
    margin-left: 30px;
    display: inline-block;
    width: 48px;
    height: 28px;
    line-height: 28px;
    background: #5ed20d;
    text-align: center;
    color: #fff;
    border-radius: 2px;
    vertical-align: middle;cursor:pointer;}
.addWeightPriceItem:hover{background:#52b60c;}
.footer{position:relative;bottom:0px;height:50px;}

.log-wrapper{
    padding:40px;
    padding-top:0;
    box-sizing:border-box;
    .title{
	font-size:13px;
	font-weight: 700;
	background: #f5f5f5;
        border-bottom: 1px solid #ccc;
        padding: 10px;
    }
    ul{
	background:#f5f5f5;
	padding:10px;
	box-sizing:border-box;
        li{
	    margin:5px 0px;
	    span{
		display:block;
		&.log-left{
		    float:left;
		}
		&.log-right{
		    margin-left:140px;
		    box-sizing:border-box;
		}
	    }
        }
    }
}

</style>
