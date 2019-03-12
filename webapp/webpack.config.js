var path = require("path");

var NODE_ENV = process.env.NODE_ENV;// 判断开发环境还是生产环境

process.noDeprecation = true;	// 去除一些打包输出日志

module.exports = {
	entry: require("./configs/entrys.config.js"),
	module : require("./configs/module.config.js"),
	plugins : require("./configs/plugins.config.js"),
	output: require("./configs/output.config.js"),
	resolve: require("./configs/resolve.config.js"),
};
if (NODE_ENV == "local") {
    module.exports.devServer = {
		contentBase:"./build",	//告诉开发服务器，文件修改了去哪里找文件
		inline:true,		  	//热替换的模式
		hot:true,			  	//启用热替换
		compress: true,			//是否开启 gzip 压缩
		host : "localhost",
		proxy: {
			'/rule': {
				 target: 'https://rule-deva.flightroutes24.com',  //目标接口域名
				 changeOrigin: true,  //是否跨域
				 pathRewrite: {
					'^/rule': '/rule',   //重写接口
				 }
			},
		},
	}
	//module.exports.devtool = "cheap-module-eval-source-map";
}else if (NODE_ENV == "dev") {
    //module.exports.devtool = "hidden-source-map";
}else if (NODE_ENV == "prod"){
	//module.exports.devtool = "hidden-source-map";
}
