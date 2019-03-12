<template>
    <div class="batchChangePrice" v-show="showBox">
	<div class="window-box-contailner">
		<div class="header">批量调价</div>
		<ul class="window-box-content">
		    <li>
			<span>直售调价：</span> <input type="text" class="sn-input-box" v-model.trim="directPrice" @blur="setDirectPriceRange"/> CNY
		    </li>
		    <li>
			<span>套餐调价：</span> <input type="text" class="sn-input-box" v-model.trim="packagePrice" @blur="setPackagePriceRange"/> CNY
		    </li>
		</ul>
		<div class="footer queryAction">
		    <button class="queryBtn" @click="saveHandle">保存</button>
		    <button class="clearBtn" @click="cancelHandle">取消</button>
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
export default {
    name : 'BatchChangePrice',
    data : function(){
        var _this = this;
        return{
	    directPrice : "",
	    packagePrice : "",
	    showBox : false,
	    
        };
    },
    methods : {
	saveHandle : function (){
	    var verifyResult = this.verifyRequestParams();
	    if(verifyResult.code != 0){
		CallWeakHint(verifyResult.msg,"btn-error");
		return;
	    } 
	    var it = {
		directPrice : this.directPrice,
		packagePrice : this.packagePrice,
	    };
	    bus.$emit("batchChangePrice",it);
	},
	verifyRequestParams(){
	    if(!this.directPrice || !this.packagePrice){
	        return {
		    code : 1,
		    msg : "请求参数缺失，请填写后再提交！",
		}
	    }
	    return {
		code : 0
	    }
	},
	cancelHandle : function (){
	    this.directPrice = "";
	    this.packagePrice = "";
	    this.showBox = false;
	},
	show(){
	    this.showBox = true;
	},
	setDirectPriceRange(){
	    if(!/^\d{1,4}$/.test(this.directPrice)){
		this.directPrice = "";
	    }
	},
	setPackagePriceRange(){
	    if(!/^\d{1,4}$/.test(this.packagePrice)){
		this.packagePrice = "";
	    }
	}
    },
};
</script>

<style scoped>
.batchChangePrice{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    overflow:scroll;
}
.window-box-contailner{
    width:500px;
    background:#fff;
    margin:100px auto;
}
.header{height:40px;line-height:40px;padding:0 20px;box-sizing:border-box;font-size:15px;font-weight:700;border-bottom:1px solid #ddd;}
.window-box-content{
    padding:40px;
    box-sizing:border-box;
}
.window-box-content li{margin:20px 0px;}

.footer{position:relative;bottom:0px;height:50px;}

</style>
