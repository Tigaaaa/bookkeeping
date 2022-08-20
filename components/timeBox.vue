<template name="timeBox">
	<picker class="time" mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
	   <view>{{time}}</view>
	</picker>
</template>

<script>
	export default{
		name:"timeBox",
		props:['ptime'],
		data(){
			return{
				time: '',
				multiArray: [],
			    multiIndex: [],
			    choose_year: '',
			}
		},
		methods:{
			//获取时间日期
			bindMultiPickerChange(e){
			  this.multiIndex=e.detail.value;
			  const index = this.multiIndex;
			  const year = this.multiArray[0][index[0]];
			  const month = this.multiArray[1][index[1]];
			  const day = this.multiArray[2][index[2]];
			  const hour = this.multiArray[3][index[3]];
			  const minute = this.multiArray[4][index[4]];
			  this.time=`${year}-${month}-${day} ${hour}:${minute}`;
			  this.$emit('timeChange',this.time);
			},
			//监听picker的滚动事件
			bindMultiPickerColumnChange(e){
			  //获取年份
			  console.log(this)
			  if (e.detail.column == 0) {
			    this.choose_year = this.multiArray[e.detail.column][e.detail.value];
			  }
			  //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
			  if (e.detail.column == 1) {
			    let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
			    let temp = [];
			    if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
			      for (let i = 1; i <= 31; i++) {
			        if (i < 10) {
			          i = "0" + i;
			        }
			        temp.push("" + i);
			      }
			    } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
			      for (let i = 1; i <= 30; i++) {
			        if (i < 10) {
			          i = "0" + i;
			        }
			        temp.push("" + i);
			      }
			    } else if (num == 2) { //判断2月份天数
			      let year = parseInt(this.choose_year);
			      if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
			        for (let i = 1; i <= 29; i++) {
			          if (i < 10) {
			            i = "0" + i;
			          }
			          temp.push("" + i);
			        }
			      } else {
			        for (let i = 1; i <= 28; i++) {
			          if (i < 10) {
			            i = "0" + i;
			          }
			          temp.push("" + i);
			        }
			      }
			    }
				this.multiArray[2]=temp;
			  }
			  this.multiIndex[e.detail.column] = e.detail.value;
			}
		},
		onReady(){
			this.time=this.ptime;
			let year=this.time.slice(0,4);
			let month=this.time.slice(5,7);
			let day=this.time.slice(8,10);
			let hour=this.time.slice(11,13);
			let minute=this.time.slice(14,16);
			
			const years = [];
			const months = [];
			const days = [];
			const hours = [];
			const minutes = [];
			//获取年
			for (let i = 2018; i <= year; i++) {
			  years.push("" + i);
			}
			//获取月份
			for (let i = 1; i <= 12; i++) {
			  if (i < 10) {
			    i = "0" + i;
			  }
			  months.push("" + i);
			}
			//获取日期
			for (let i = 1; i <= 31; i++) {
			  if (i < 10) {
			    i = "0" + i;
			  }
			  days.push("" + i);
			}
			//获取小时
			for (let i = 0; i < 24; i++) {
			  if (i < 10) {
			    i = "0" + i;
			  }
			  hours.push("" + i);
			}
			//获取分钟
			for (let i = 0; i < 60; i++) {
			  if (i < 10) {
			    i = "0" + i;
			  }
			  minutes.push("" + i);
			}
			this.multiArray=[years, months, days, hours, minutes];
			//设置默认的年份
			this.choose_year=year;
			this.multiIndex[0]=this.multiArray[0].indexOf(year);
			this.multiIndex[1]=this.multiArray[1].indexOf(month);
			this.multiIndex[2]=this.multiArray[2].indexOf(day);
			this.multiIndex[3]=this.multiArray[3].indexOf(hour);
			this.multiIndex[4]=this.multiArray[4].indexOf(minute);
		},
	}
</script>

<style lang="scss" scoped>
	.time{
		width: 11rem;
		line-height: 3rem;
		margin: auto{
			left: 0.5rem;
		}
		border-right: 0.1rem solid $border1;
	}
</style>