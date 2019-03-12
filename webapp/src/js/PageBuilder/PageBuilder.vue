<template>
  <div class="footer-contailer">
    <div class="pageNumChange" v-show="SelectShow=='true'">
	<span>{{ Language[Lan].total + " " + ResultCount + " " + Language[Lan].row + "，" + Language[Lan].show }} </span>
	<select class="pageSize" @change="handleChange()" v-model="curPageSize">
	    <option value="10">10</option>
	    <option value="20">20</option>
	    <option value="50">50</option>
	    <option value="100">100</option>
	</select>
	<span>{{" " + Language[Lan].row }}</span>
    </div>
    <p class="clear"></p>
    <div class="divContent">
	  <span :class="{'preBtn aBtn spanBtnDisabled':CurrentPage == 1,'preBtn aBtn':CurrentPage != 1}" 
	      @click="goPage(CurrentPage==1?1:inputPageNum-1)">
		<span class='icon'></span>{{Language[Lan].prev}}
	  </span>
	  <span v-for="page in showPageBtn" :class="{'aBtn spanBtnSelected':page==CurrentPage,'aBtn':page!=CurrentPage}" 
	      @click="goPage(page)">
	     <span v-if="page">{{page}}</span>
	     <span v-else>···</span>
	  </span>
	  <span :class="{'nextBtn aBtn spanBtnDisabled':CurrentPage >= comPageCount,'nextBtn aBtn':CurrentPage < comPageCount}"
	      @click="goPage(CurrentPage == comPageCount ? comPageCount : inputPageNum+1)" >
		{{Language[Lan].next}}<span class='icon'></span>
	  </span>
	  <span class="totalPages">{{"  "+Language[Lan].total+" " + comPageCount + " "+Language[Lan].page }}</span>
	  <span>{{"  "+Language[Lan].to+" "}}</span>
	  <input class="inputPagecode" type="text" v-model.trim="inputPageNum" @blur="headleBlur"/>
	  <span>{{" "+Language[Lan].page +" "}}</span>
	  <a class="aSubmit" @click="_goPage">{{Language[Lan].confirm}}</a>
      </div>
  </div>
</template>

<script>
require("./css/pageBuilder.css");
export default {
        name : 'PageBuilder',
    	data : function(){
            return{
                Language : {/*中英文数据*/
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
		},
		curPageSize : this.PageSize,
		inputPageNum: this.CurrentPage
            }
        },
	props : {
		ResultCount : {
			default: 0 
		},
		CurrentPage : {
			default: 1
		},
		PageSize : {
			default: 10
		},
		PageCount : {
			default: 0
		},
		SelectShow : {
			default: false
		},
		Lan : {
			default: "zh_CN"
		}
	},
	watch:{
            CurrentPage : function(val){
                this.inputPageNum = val;
            }
        },
	computed: {
		 // 显示分页按钮
		 showPageBtn : function() {
		     var pageNum = this.comPageCount;//this.PageCount; // 总页数
		     var index = this.CurrentPage; // 当前页
		     var arr = [];
		     if (pageNum <= 9) {
			 for (var i = 1; i <= pageNum; i++) {
			     arr.push(i)
			 }
			 return arr.length < 1 ?[1]:arr;
		     }
		     // 对页码显示进行处理，动态展示
		     if (index <= 5) return [1, 2, 3, 4, 5, 6, 7, 0, pageNum];
		     if (index >= pageNum - 5) return [1, 0, pageNum - 6,pageNum - 5,pageNum - 4,pageNum - 3, pageNum - 2, pageNum - 1, pageNum];
		     return [1, 0, index - 2,index - 1, index, index + 1, index + 2, 0, pageNum];
		 },
		 comPageCount : function() {
		     var pageNum = (parseInt(this.ResultCount) % parseInt(this.PageSize)) == 0 ? (parseInt(this.ResultCount) / parseInt(this.PageSize)) : parseInt(parseInt(this.ResultCount) / parseInt(this.PageSize)) + 1 ||0; // 总页数
		     return pageNum;
		 },
        },
	methods : {
		goPage : function(page) {
		     if (page != this.inputPageNum) {
			 if(page > this.comPageCount || page == "0") return;
			 this.inputPageNum = parseInt(page);
			 this.$emit('gotoPage', parseInt(this.inputPageNum),parseInt(this.curPageSize));
		     }else{
			 console.log('Already in the current page');
		     }
		},
		_goPage : function (){
			this.$emit('gotoPage',  parseInt(this.inputPageNum),parseInt(this.curPageSize));
		},
		handleChange : function(){
			this.$emit('gotoPage',  1,parseInt(this.curPageSize));
		},
		headleBlur :function(){
			if(this.inputPageNum > this.comPageCount || this.inputPageNum < 1){
			    this.inputPageNum = 1;
			}
		},
		getCurrent :function (pageCount, currentPage){
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
	}
}

</script>

