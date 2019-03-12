require('css/basic.min.css');
require('css/common.css');


import Search from 'components/baggageSalesManagement/Search.vue'
import Result from 'components/baggageSalesManagement/Result.vue'

import Vue from 'vue'
Vue.config.productionTip = false;

new Vue({
    el: '#app',
	template : "<div><Search/><Result/></div>",
	components : {
		Search,
		Result,
	},
});
