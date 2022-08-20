<template>
	<page-meta root-font-size="10px"></page-meta>
	<view>
		<view class="top">总额：{{all}}</view>
		<view class="account-list">
			<view class="account" v-for="l in list" :key="l.name">
				<input class="name" v-model="l.name"/>
				<input class="value" v-model="l.value"/>
			</view> 
			<view class="account">
				<input class="name" v-model="newName"/>
				<input class="value" type="number" v-model="newValue"/>
				<view class="bot" @click="addAct">添加</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				newName:'',
				newValue:'',
			}
		},
		computed:{
			all(){
				return this.list.reduce((a,b)=>{return a+b.value},0);
			}
		},
		onShow(){
			let db=wx.cloud.database({});
			db.collection('accounts').where({
				id:this.$store.state.id
			}).get({
				success:res=>{
					this.list=res.data[0].accounts;
				}
			})
		},
		methods: {
			addAct(){
				if(this.newName!=''&&this.newValue!=''){
					let db=wx.cloud.database({});
					this.list.push({name:this.newName,value:this.newValue});
					db.collection('accounts').where({
						id:this.$store.state.id,
					}).update({
					  // data 传入需要局部更新的数据
					  data: {
					    accounts:this.list
					  }
					}).then((res)=>{
					    this.newName='';
					    this.newValue='';
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding:1.5rem;
		background-color:$theme-col;
		color:#fff;
		line-height:1.5rem;
	}
	.account{
		padding:1.5rem;
		background-color:#fff;
		border-bottom:0.1rem solid $border1;
		display:flex;
		.name{
			flex:1;
		}
		.value{
			flex:3;
			text-align:right;
		}
		.bot{
			margin:0 1rem;
			border:0.1rem solid $border1;
		}
	}
</style>
