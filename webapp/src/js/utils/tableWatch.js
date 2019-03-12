/**
 * Created by Danny on 2015/9/26 10:05.
 */
var $ = require("jquery"); 


module.exports = {
	bindEvent : bindEvent,
	getHeight : getHeight,
	setResoultHeight : setResoultHeight,
	resetTopWidth : resetTopWidth,
};

function bindEvent(topHeight){
	/* 监控滚动条展示表头  */
	$(window).scroll(function(){
		if($(window).scrollTop() > 160){
			$('#topTableContainer').fadeIn(200);
			$("#topTableContainer").css("top",$(window).scrollTop()-topHeight);
		}else{
			$('#topTableContainer').stop(true,true).fadeOut(200); 
		}
	});

	/* 监控滚动条展示表头  */
	$('.reportContainer').scroll(function(){
		if($(".reportContainer").scrollLeft() > 0){
			$('#leftTableContainer').fadeIn(200);
			$("#leftTableContainer").css("left",$(".reportContainer").scrollLeft());
		}else{
			$('#leftTableContainer').stop(true,true).fadeOut(200); 
		}
		
	});
	/*拖拽*/
	$(".reportTable").mousedown(function(i){
		var flag= true;/*打开*/
		/*获取坐标*/
		var x=i.clientX;
		
		$(document).mousemove(function(e){
			/*如果是打开状态*/
			if(flag){
				var x1 = e.clientX;

				/*计算坐标位置*/
				var _left = x1 - x;

				if(_left > 0){_left = $(".reportContainer").scrollLeft()+10;}
				if(_left < 0){_left = $(".reportContainer").scrollLeft()-10;}

				//if(_left>=$(".reportContainer").width()){_left=$(".reportContainer").width();}
				$(".reportContainer").animate({
						scrollLeft:_left,
				},0);
			}
		}).mouseup(function(){
			flag=false; /*关闭*/
		});
	});
}

function getHeight(){
	var winHeight = $(window).height()-100;
	return winHeight;
}

/* 设置内容区域的高度 */
function setResoultHeight(){
	$(".contentContainer").css("max-height",getHeight());
}

function resetTopWidth(){
    setTimeout(()=>{
        var topElementRow = document.getElementById("topHead");
		var topCells = topElementRow.getElementsByTagName("th"); 

		var resultElementRow = document.getElementById("resultHead");
		var resultCells = resultElementRow.getElementsByTagName("th"); 
		for(var i = 0; i < resultCells.length;i++){
		    topCells[i].style.width = resultCells[i].clientWidth+"px";
		}
     },0);
}

