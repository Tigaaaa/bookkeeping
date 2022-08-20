import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	actions:{
	},
	
	mutations:{
		login(state,id){
			state.id=id;
			state.isLog=true;
		},
		outLog(state){
			state.id='',
			state.isLog=false;
		}
	},
	
	state:{
		id:'',
		isLog:false
	}
})