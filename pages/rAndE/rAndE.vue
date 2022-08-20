<template>
	<view>
		<navigator class="add" url="/pages/addView/addView">+</navigator>
		<view class="hd">
			<dateBox :date='date' @dateChange='getList'></dateBox>
			<view class="all-in">收入:{{allIn}}</view>
			<view class="all-out">支出:{{allOut}}</view>
			<view class="all">合计:{{all}}</view>
		</view>
		<view class="list" v-for="d in list" :key="d.date">
			<view class="top">
				<text class="time">{{d.date}}</text>
				<text class="all">合计:{{d.in-d.out}}</text>
			</view>
			<view class="item" v-for="(l,index) in d.list" :key="l.time" @longpress="deleteList(d,index)">
				<view class="tag">{{l.tag}}</view>
				<view class="info">
					<text :class="{in:l.type,out:!l.type}">{{l.type?l.num:-l.num}}</text>
					<text class="account">{{l.account}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dateBox from '@/components/dateBox.vue'
	export default {
		data() {
			return {
				date:'',
				list:[]
			}
		},
		onShow(){
			let date=new Date();
			let year=date.getFullYear();
			let month=date.getMonth()+1;
			month=month>9?'':'0'+month;
			this.date=`${year}-${month}`;
			
			let db=wx.cloud.database({});
			if(this.$store.state.id){
				db.collection('user').where({
					id:this.$store.state.id
				}).get({
					success:(res=>{
						if(res.data.length){
							this.getList(this.date);
						}
						else{
							db.collection('user').add({
							  data: {
							    id:this.$store.state.id
							  }
							});
							db.collection('accounts').add({
							  data: {
							    id:this.$store.state.id,
								accounts:[{name:'微信',value:500},
								{name:'支付宝',value:50},
								{name:'银行卡1',value:900},
								{name:'银行卡2',value:2230}]
							  }
							});
							db.collection('keeping').add({
							  data: {
							    id:this.$store.state.id,
							    date:'2022-08-05',
							    list:[
							    	{type:0,tag:'吃饭',num:10,account:'微信',time:'12:00'},
							    	{type:1,tag:'生意',num:50,account:'微信',time:'13:00'},
							    	{type:0,tag:'红包',num:15,account:'微信',time:'14:00'},
							    	{type:0,tag:'娱乐',num:10,account:'微信',time:'15:00'}
							    	],
							    in:35,
							    out:50
							  }
							})
							.then(()=>{
								this.getList(this.date);
							})
						}
					})
				});
			}
		},
		methods:{
			getList(date){
				this.date=date;
				let db=wx.cloud.database({});
				db.collection('keeping').where({
					id:this.$store.state.id,
					date:db.RegExp({
						regexp:date,
					})
				}).get({
					success:(res=>{
						this.list=res.data
					})
				});
			},
			deleteList(d,index){
				uni.showActionSheet({
					itemList:['删除']
				})
				.then((res)=>{
					if(res[1].tapIndex==0){
						let db=wx.cloud.database({});
						
						let accounts;
						db.collection('accounts').where({
							id:this.$store.state.id,
						}).get({})
						.then(res=>{
							accounts=res.data[0].accounts;
							for(let a of accounts)
								if(a.name==d.list[index].account){
									a.value+=d.list[index].type?-d.list[index].num:d.list[index].num;
									break;
								}
							
							if(d.list[index].type==0)
								d.out-=d.list[index].num;
							else{
								d.in-=d.list[index].num;
							}
							d.list.splice(index,1);
							
							db.collection('keeping').where({
								id:this.$store.state.id,
								date:d.date
							}).update({
							  // data 传入需要局部更新的数据
							  data: {
							    list:d.list,
								in:d.in,
								out:d.out
							  }
							})
							.then(()=>{
								db.collection('accounts').where({
									id:this.$store.state.id
								}).update({
								  // data 传入需要局部更新的数据
								  data: {
								    accounts:accounts
								  }
								})
								.then(()=>this.getList(this.date))
							});
						})
						
					}
				})
			}
		},
		computed:{
			allIn(){
				return this.list.reduce((a,b)=>{return a+b.in},0)
			},
			allOut(){
				return this.list.reduce((a,b)=>{return a+b.out},0)
			},
			all(){
				return this.allIn-this.allOut
			},
		},
		components:{
			dateBox
		}
	}
</script>

<style lang="scss" scoped>
	.add{
		background-color: $theme-col;
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		font-size:3rem;
		color:#fff;
		text-align: center;
		line-height: 4rem;
		position:fixed;
		bottom:1rem;
		right: 1rem;
	}
	.hd{
		position:sticky;
		top:0;
		
		background-color: $theme-col;
		color:#fff;
		padding:1rem ;
		display:flex;
		justify-content: space-evenly;
	}
	.list{
		.top{
			padding:0.2rem;
			background-color: #ddd;
			color:#aaa;
			display:flex;
			.time{width:80%;}
			.all{
				width:20%;
				text-align: center;
			}
		}
		.item{
			padding: 0.5rem;
			border: 0.1rem solid #ddd;
			display:flex;
			.tag{
				width:80%;
				display: flex;
				flex-direction: column;
				justify-content:center;
			}
			.info{
				width:20%;
				display:flex;
				flex-direction:column;
				text{
					text-align:right;
					font-weight:bold;
				}
				.in{color: $in-col;}
				.out{color: $out-col;}
				.account{color: #ccc;}
			}
		}
	}
</style>
