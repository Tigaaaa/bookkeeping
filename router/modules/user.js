export default[
	{
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
      path: '/pages/login/login',
      aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
      name: 'login',
        meta: {
	        title: '登录',
	    },
    },
    {
	    path: '/pages/rAndE/rAndE',
        name: 'rAndE',
        meta: {
	        title: '收支',
	    },
	},
	{
	    path: '/pages/statistics/statistics',
	    name: 'statistics',
	    meta: {
	        title: '统计',
	    },
	},
	{
	    path: '/pages/account/account',
	    name: 'account',
	    meta: {
	        title: '账户',
	    },
	},
	{
	    path: '/pages/addView/addView',
	    name: 'addView',
	    meta: {
	        title: '记账',
	    },
	},
]
