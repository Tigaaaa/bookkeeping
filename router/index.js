// router/index.js

import modules from './modules'
import Vue from 'vue'
import Router from 'uni-simple-router'                              

import store from '@/store/index.js'

Vue.use(Router)
//初始化
const router = new Router({
    routes: [...modules]//路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	/*if((to.name=='rAndE'||to.name=='statistics'||to.name=='account')&&!store.state.isLog)
		return;*/
    next()
})
// 全局路由后置守卫
router.afterEach((to, from) => {
})
export default router;