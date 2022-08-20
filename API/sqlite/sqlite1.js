(function($,window,app){ // $是引入mui，window是引入window对象，app是引入app.js 此处三个都没有用到，请自行调整
	window.sqlite = {
		//数据库配置
		dbConfig:{
			name: 'myDB', // 数据库的名称
			path: '_doc/mydb.db'  // 数据库的存储位置
		},
		// 是否打开数据库
		isOpenDatabase:function() {
			return plus.sqlite.isOpenDatabase({name: sqlite.dbConfig.name,path: sqlite.dbConfig.path});
		},
		// 打开数据库
		openDB:function (){
			plus.sqlite.openDatabase({
				name: sqlite.dbConfig.name,
				path: sqlite.dbConfig.path
			});
		},
		// 关闭数据库
		closeDB:function(){
			plus.sqlite.closeDatabase({
				name: sqlite.dbConfig.name
			});
		},
		// 增改删
		executeSql: function(sql,cb){
			plus.sqlite.executeSql({
				name: sqlite.dbConfig.name,
				sql: sql,
				success: function(r) {
					cb(r)
				}
			});
		},
		// 查询语句
		selectSql: function(sql,success,fail) {
			plus.sqlite.selectSql({
				name: sqlite.dbConfig.name,
				sql: sql,
				success: function(r) {
					success(r);
				},
				fail: function(r) {
					fail(r);
				}
			});
		}
	}
})(mui,window,app)
