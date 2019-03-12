<template>
    <div class="searchInput">
	<ul class="queryContainer sn-f-cb">
	    <li>
		<span>出发地：</span> <input type="text" v-model.trim="dep" />
	    </li>
	    <li>
		<span>到达地：</span> <input type="text" v-model.trim="arr"/>
	    </li>
	    <li>
		<span>状态：</span>
		<select class="sn-select-box"  v-model="status">
                    <option value="" >全部</option>
                    <option value="1">有效</option>
		    <option value="2">无效</option>
                </select>
	    </li>
	    <li>
		<span>航司：</span> <input type="text" v-model.trim="carrier" />
	    </li>
	    <li>
		<span>重量：</span> <input type="text" v-model.trim="weight" />
	    </li>
	</ul>
	<div class="queryAction">
	    <button class="queryBtn" @click="searchEvn">查询</button>
	    <button class="clearBtn" @click="clearEvn">清空</button>
	</div>
	
    </div>
</template>

<script>
import bus from "../eventBus.js";
/* eslint-disable no-unused-vars */
import jsUtils from "js/utils/jsUtils.js";
/* eslint-enable no-unused-vars */
export default {
    name : 'Search',
    data : function(){
        var _this = this;
        return{
	    dep : "",
	    arr : "",
	    status : "",
	    carrier : "",
	    weight : "",
	   
        };
    },
    methods : {
	searchEvn : function (){
	    var it = {
		dep : this.dep,
		arr : this.arr,
		status : this.status,
		carrier : this.carrier,
		weight : this.weight,
	    };
	    bus.$emit("searchReq",it);
	},
	clearEvn : function (){
	    this.dep = "";
	    this.arr = "";
	    this.status = "";
	    this.carrier = "";
	    this.weight = "";
	},
    },
};
</script>

<style>

</style>
