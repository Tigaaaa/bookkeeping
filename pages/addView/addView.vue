<template>
	<page-meta root-font-size="10px"></page-meta>
	<view class="warp">
		<view class='hd'>
			<view class="out" @click="back">取消</view>
			<view class="ok" @click="addOk">确认</view>
		</view>
		<view class="tags">
			<view class='tag'
			 :class="{'c-tag':t==aBook.tag}"
			v-for="t of tags" 
			:key='t'
			@click="chooseTag(t)">{{t}}</view>
		</view>
		<view class="remark">
			<timeBox :ptime="time" @timeChange="timeChange"></timeBox>
			<input placeholder="备注" v-model="aBook.remark"/>
		</view>
		<view class="num">
			<input v-model="aBook.num" ref="inp" @focus="setBlur()"/>
			<accountChoose @init="actInit" @actChange='actChange'></accountChoose>
		</view>
		<view class="computer">
			<button v-for="b in computer" :key='b' @click="add(b)">{{b}}</button>
			<button @click="sub"></button>
			<button @click="getResult">=</button>
			<button @click="changeType">{{aBook.type?'收入':'支出'}}</button>
		</view>
	</view>
</template>

<script>
	import timeBox from '@/components/timeBox.vue'
	import accountChoose from '@/components/accountChoose.vue'
	export default { 
		components:{
			timeBox,
			accountChoose
		},
		data() {
			return {
				computer:['7','8','9','.','4','5','6','+','1','2','3','-','0'],
				tags:['吃饭','买菜','服饰','医疗','娱乐'],
				actFlag:1,
				time:'',
				aBook:{
					type:0,
					tag:'',
					num:'0',
					account:'',
					remark:''
				},
			}
		},
		onShow(){
			let db=wx.cloud.database({});
			const date=new Date();
			let year=''+date.getFullYear();
			let month=''+(date.getMonth()+1);
			month=month>9?month:'0'+month;
			let day=''+date.getDate();
			day=day>9?day:'0'+day;
			
			let hour=''+date.getHours();
			hour=hour>9?hour:'0'+hour;
			let minute=''+date.getMinutes();
			minute=minute>9?minute:'0'+minute;
			this.time=`${year}-${month}-${day} ${hour}:${minute}`;
			
		},
		methods: {
			back(){
				uni.navigateBack();
			},
			addOk(){
				this.getResult();
				this.aBook.num=parseFloat(this.aBook.num);
				this.aBook.time=this.time.split(' ')[1];
				
				let date=this.time.split(' ')[0];
				let month=this.time.slice(0,7);
				
				let db=wx.cloud.database({});
				db.collection('keeping').where({
					id:this.$store.state.id,
					date:date
				}).get({
					success:(res=>{
						let akeep=res.data;
						if(!akeep.length){
							akeep={
								id:this.$store.state.id,
								date:date,
								list:[this.aBook],
								in:0,
								out:0,
							};
							if(this.aBook.type)
								akeep.in=this.aBook.num;
							else
								akeep.out=this.aBook.num;
								
							db.collection('keeping').add({
							  data: akeep
							}).then((res)=>{
							    this.aBook.num='0';
							    uni.switchTab({
							    	url:"/pages/rAndE/rAndE"
								});
							})
						}
						else{
							akeep=akeep[0];
							akeep.list.push(this.aBook);
							if(this.aBook.type)
								akeep.in+=this.aBook.num;
							else	
								akeep.out+=this.aBook.num;
								
							db.collection('keeping').where({
								id:this.$store.state.id,
								date:date
							}).update({
							  // data 传入需要局部更新的数据
							  data: {
							    list: akeep.list,
								in:akeep.in,
								out:akeep.out
							  }
							}).then((res)=>{
								let accounts;
								db.collection('accounts').where({
									id:this.$store.state.id,
								}).get({})
								.then(res=>{
									accounts=res.data[0].accounts;
									for(let a of accounts)
										if(a.name==this.aBook.account){
											a.value+=this.aBook.type?this.aBook.num:-this.aBook.num;
											break;
										}
									db.collection('accounts').where({
										id:this.$store.state.id
									}).update({
									  // data 传入需要局部更新的数据
									  data: {
									    accounts:accounts
									  }
									})
									.then(()=>{
										this.aBook.num='0';
										uni.switchTab({
											url:"/pages/rAndE/rAndE"
										});
									})
								})
							    
							})
						}
					})
				});
				/*
				let list=uni.getStorageSync(month);
				//没有该月记录
				if(!list)
					list=[];
				else
					list=JSON.parse(list);
					
				let flag=0;
				let l=-1,r=list.length;
				let ntime=new Date(date).getTime();
				while(l+1!=r){
					let mid=Math.ceil((l+r)/2);
					let mtime=new Date(list[mid].date).getTime();
					if(mtime==ntime){
						list[mid].list.push(this.aBook);
						if(this.aBook.type)
							list[mid].in+=this.aBook.num;
						else	
							list[mid].out+=this.aBook.num;
						flag=1;
						break;
					}
					else if(mtime<ntime)
						r=mid;
					else
						l=mid;
				}
				if(!flag){
					list.splice(r,0,{
						date:date,
						list:[this.aBook],
						in:0,
						out:0,
					});
					if(this.aBook.type)
						list[r].in=this.aBook.num;
					else
						list[r].out=this.aBook.num;
				}
				uni.setStorageSync(month,JSON.stringify(list));*/
				
			},
			chooseTag(t){
				this.aBook.tag=t;
			},
			actInit(act){
				this.aBook.account=act;
			},
			actChange(newAct){
				this.aBook.account=newAct;
			},
			timeChange(newTime){
				this.time=newTime;
			},
	 		setBlur(){
				this.$refs.inp._blur();
			},
			add(b){
				let str=this.aBook.num;
				let len=str.length-1;
				if(str=='0'||(b=='+'||b=='-')&&(str[len]=='+'||str[len]=='-'||str[len]==''))
					this.sub();
				this.aBook.num+=b;
			},
			sub(){
				let len=this.aBook.num.length-1;
				this.aBook.num=this.aBook.num.slice(0,len);
			},
			getResult(){
				let num=this.aBook.num,res=0,addNum="",str="+";
				for(let i=0;i<=num.length;i++){
					if(num[i]!=null&&num[i]!='+'&&num[i]!='-')
						addNum+=num[i];
					else{
						addNum=parseFloat(addNum);
						switch(str){
							case '+':
								res+=addNum;
								break;
							case'-':
								res-=addNum;
								break;
							default:break;
						}
						addNum="";
						str=num[i];
					}
				}
				this.aBook.num=''+res;
			},
			changeType(){
				this.aBook.type=this.aBook.type?0:1;
			},
			ok(){
				this.aBook.num=parseFloat(this.aBook.num);
				if(!this.aBook.num)
					this.aBook.num=!this.aBook.num;
			},
			getTime(){
				const date=new Date();
				let year=date.getFullYear();
				let month=date.getMonth()+1;
				month=month>9?month:'0'+month;
				let day=date.getDate();
				day=day>9?day:'0'+day;
				
				let hour=date.getHours();
				hour=hour>9?hour:'0'+hour;
				let minute=date.getMinutes();
				minute=minute>9?minute:'0'+minute;
				return `${year}-${month}-${day} ${hour}:${minute}`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		height:100vh;
		display:flex;
		flex-direction: column;
		.hd{
			border-bottom: 0.1rem solid $border1;
			.out,.ok{
				padding: 0.5rem;
			}
			.out{
				float:left;
				border-right: 0.1rem solid $border1;
				}
			.ok{
				float:right;
				border-left: 0.1rem solid $border1;
				}
			&:after{
				display: block;
				content:'';
				clear:both;
			}
		}
		.tags{
			flex:1;
			overflow-y:scroll;
			::-webkit-scrollbar{width:0;}
			.tag{
				padding:0.5rem;
				margin:1rem;
				background-color: $theme-col;
				float:left;
			}
			.c-tag{
				background-color: $theme-c-col;
				color:#fff;
			}
		}
		.remark{
			height: 3rem;
			border-top: 0.1rem solid $border1;
			display: flex;
			
			input{
				flex:1;
				margin: auto{
					left: 0.5rem;
				}
				overflow-x: scroll;
				::-webkit-scrollbar{width:0;}
			}
		}
		.num{
			height: 3rem;
			border-top: 0.1rem solid $border1;
			display:flex;
			input{
				flex:1;
				margin: auto{
					left: 0.5rem;
				}
			}
			.accounts{
				width: 7rem;
				line-height: 3rem;
				text-align:center;
				border-left:0.1rem solid $border1;
			}
			
		}
		.computer{
			display: grid;
			grid-template-rows: 1fr 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			border-top: 0.1rem solid $border1;
			button{
				width: 100%;
				height: 100%;
			}
		}
	}
	
</style>
