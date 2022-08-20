<template>
	<view>
		<button v-show="status==0" class="login-btn" type="primary" @click="getUserInfo">
			微信用户一键登录
		</button>
		<button v-show="status==1" class="login-btn" type="loading">
		</button>
		<button v-show="status==2" class="outLogin-btn" type="primary" @click="outLogin">
			退出登录
		</button>
		
	</view>
</template>

<script>
	export default {
		data() { 
			return {
				code:'',
				status:0
			}
		},
		onShow(){
			this.status=this.$store.state.isLog?2:0;
		},
		methods: {
			getUserInfo(){
				this.status=1;
				uni.login({
					provider:'weixin',
					success:(res)=>{
						this.code=res.code;
						if(res.errMsg=='login:ok'){
							uni.request({
								url:'http://localhost:8000/user/login',
								method:'POST',
								data:{
									code:this.code
								},
								success:res=>{
									this.status=2;
									this.$store.commit('login',res.data.openid);
									uni.switchTab({
										url:"/pages/rAndE/rAndE"
									});
								}
							})
						}
					}
				})
			},
			outLogin(){
				this.$store.commit('outLog');
				this.status=0;
			}
		}
	}
</script>

<style>
	.login-btn,.outLogin-btn{
		width:70%;
		position:absolute;
		left:50%;
		top:50%;
		transform:translate(-50%,-50%);
	}
</style>
