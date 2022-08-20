<template>
	<page-meta root-font-size="10px"></page-meta>
	<view>
		<view class="hd">
			<dateBox :date='date' @dateChange='getList'></dateBox>
			<view class="charts" @click="changeChart()">{{charts?"按时间":"按类型"}}</view>
			<view class="type" v-show="!charts" @click="changeType()">{{type?"收入":"支出"}}</view>
		</view>
		<view class="charts-box">
			<qiun-data-charts v-if="!charts" type="ring" :opts="opts" :chartData="chartData"/>
		    <qiun-data-charts v-if="charts" type="line" :opts="opts2" :chartData="chartData" :ontouch="true"/>
		</view>
	</view>
</template>

<script>
	import dateBox from '@/components/dateBox.vue'
	export default {
		data() {
			return {
				date:'',
				type:0,
				charts:0,
				categories:[],
				outData:{
					data:[],//各标签数额
					num:0,//总额
					list:[]//每日数据
				},
				inData:{
					data:[],
					num:0,
					list:[]
				},
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['rose'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
				    padding: [5,5,5,5],
			        legend: {
			          show: true,
				      position: "bottom",
					  lineHeight: 25
				    },
			        title: {
			          name: "总额",
			          fontSize: 15,
					  color: "#666666"
				    },
				    subtitle: {
				      name: 0,
			          fontSize: 25,
			          color: "#7cb5ec"
				    },
				    extra: {
			          ring: {
				          labelWidth: 10,
				        }
				    }
				},
				opts2: {
					color: ["#91CB74","#EE6666"],
				    padding: [15,10,0,15],
				    legend: {},
					enableScroll: true,
			        xAxis: {
						disableGrid: true,
						itemCount: 7
			        },
			        yAxis: {
						gridType: "dash",
				        dashLength: 2
				    },
			        extra: {
						line: {
							addLine: true,
							type: "straight",
				            width: 2
				        }
				    }
				},
				list:[],
			}
		},
		onShow() {
			let date=new Date();
			let year=date.getFullYear();
			let month=date.getMonth()+1;
			month=month>9?''+month:'0'+month;
			this.getList(`${year}-${month}`);
		  },
		  methods: {
			getList(date){
				if(date==this.date)return;
				
				this.date=date;
				let db=wx.cloud.database({});
				db.collection('keeping').where({
					id:this.$store.state.id,
					date:db.RegExp({
						regexp:date,
					})
				})
				.get({
					success:(res=>{
						this.list=res.data;
						for(let i=1;i<=31;i++)
							this.categories.push(''+i);
						this.outData.list=new Array(31).fill(0);
						this.inData.list=new Array(31).fill(0);
						this.getServerData();
					})
				});
				
			},
			getServerData() {
					let outData=new Map();//记录每种标签的收支数额
					let inData=new Map();
					let num;//数额
					this.outData.num=0;
					this.outData.data=[];
					this.inData.num=0;
					this.inData.data=[];
					for(let l of this.list){//遍历每一天
						let day=new Date(l.date).getDate()-1;
						this.outData.list[day]=l.out;
						this.outData.num+=l.out;
						this.inData.list[day]=l.in;
						this.inData.num+=l.in;
						
						for(let a of l.list){//遍历当天记录
							if(a.type==0){
								num=a.num+(outData.has(a.tag)?outData.get(a.tag):0);
								outData.set(a.tag,num);
							}
							else if(a.type==1){
								num=a.num+(inData.has(a.tag)?inData.get(a.tag):0);
								inData.set(a.tag,num);
							}
						}
					}
						
					for(let [key,value] of outData){
						this.outData.data.push({"name":key,"value":value});
					}
					for(let [key,value] of inData){
						this.inData.data.push({"name":key,"value":value});
					}
					
					this.type=0;
					this.charts=0;
					let res = {
					    series: [{data:[]}]
					};
					res.series[0].data=this.outData.data;
		            this.chartData = JSON.parse(JSON.stringify(res));
					this.opts.subtitle.name=this.outData.num;
		        },
				changeType(){
					this.type=!this.type;
					this.chartData.series[0].data=!this.type?this.outData.data:this.inData.data;
					this.opts.subtitle.name=!this.type?this.outData.num:this.inData.num;
				},
				changeChart(){
					this.charts=!this.charts;
					let res;
					if(this.charts){
						res = {
							categories: this.categories,
							series:[
								{
									name: "收入",
								    data: this.inData.list,
								},
								{
									name: "支出",
								    data: this.outData.list,
								}
							]
						};
					}
					else{
						this.type=false;
						res = {
						    series: [{data:[]}]
						};
						res.series[0].data=this.outData.data;
						this.opts.subtitle.name=this.outData.num;
					}
					this.chartData = JSON.parse(JSON.stringify(res));
				},
		  },
		  components:{
			  dateBox
		  }
	}
</script>

<style lang="scss">
	.hd{
		background-color: $theme-col;
		color:#fff;
		border-bottom:0.1rem solid $border1;
		display:flex;
		.time,.charts,.type{
			flex:1;
			height:3rem;
			line-height:3rem;
			text-align:center;
			border-right:0.1rem solid #fff;
		}
		.time{
			width:7rem;
		}
	}
	.charts-box {
		margin-top:7rem;
	    width: 100%;
	    height: 30rem;
	  }
</style>
