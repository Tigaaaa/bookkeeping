<template name="accountChoose">
	<picker mode="selector" @change="bindPickerChange" :value="index" :range="accounts">
	   <view class="accounts">{{accounts[index]}}</view>
	</picker>
</template>

<script>
	export default {
		name:"accountChoose",
		data() {
			return {
				accounts:[],
				index:0,
				id:''
			};
		},
		onReady(){
			let db=wx.cloud.database({});
			db.collection('accounts').where({
				id:this.$store.state.id
			}).get({})
			.then(res=>{
					res.data[0].accounts.map((act)=>{
						this.accounts.push(act.name);
					});
					this.$emit('init',this.accounts[this.index]);
			})
		},
		methods:{
			bindPickerChange(e){
				this.index=e.detail.value;
				this.$emit('actChange',this.accounts[this.index]);
			}
		}
	}
</script>

<style lang="scss">
	.accounts{
		width: 7rem;
		line-height: 3rem;
		text-align:center;
		border-left:0.1rem solid $border1;
	}
</style>