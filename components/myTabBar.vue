<template name='myTabBar'>
	<page-meta root-font-size="10px"></page-meta>
	<view class="list">
		<view class='bar' v-for="l in list" :key='l.text' @click="jump(l.path)">{{l.text}}</view>
	</view>
</template>

<script>
	export default {
		name:"myTabBar",
		data() {
			return {
				list:[
					{path:'/pages/login/login',text:'登录'},
					{path:'/pages/rAndE/rAndE',text:'收支'},
					{path:'/pages/statistics/statistics',text:'统计'},
					{path:'/pages/account/account',text:'账户'},
				]
			};
		},
		methods:{
			jump(path){
				console.log(path)
				this.$Router.push({path:path});
			}
		}
	}
</script>

<style lang='scss' scoped>
	.list{
		width: 100%;
		height:3rem;
		line-height: 3rem;
		text-align:center;
		background-color: #fff;
		border-top: 0.2rem solid $theme-c-col;
		position: fixed;
		bottom: 0;
		display:flex;
		.bar{
			flex:1;
			color:#bbb;
			border-left:0.1rem solid $theme-c-col;
		}
		.cli{
			background-color: #bbb;
			color:white;
		}
	}
</style>