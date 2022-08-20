<template name="dateBox">
	<picker mode="date" value="myDate" fields="month" @change="bindDateChange">
	    <view class="time">{{myDate}}</view>
	</picker>
</template>

<script>
	export default {
		name:"dateBox",
		props:['date'],
		data() {
			return {
				myDate:''
			};
		},
		onReady(){
			this.myDate=this.date;
		},
		methods:{
			bindDateChange(e){
				this.myDate=e.detail.value;
				this.$emit('dateChange',this.myDate);
			},
		}
	}
</script>

<style>

</style>