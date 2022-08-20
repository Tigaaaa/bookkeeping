<script>
	export default {
		onLaunch: function() {
			wx.cloud.init({
				env:'bookkeeping-9g4mhcjef09601bc'
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang='scss'>
	page,button{
	  padding: 0;
	  margin: 0;
	  font-style:normal;
	  font-size:12px;
	}
</style>
