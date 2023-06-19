<script>
	export default {
		onLaunch: function(options) {
			let tg = this.$util.getKey('t')
			if (tg && tg != 'undefined') {
				var reg = /^[A-Za-z0-9]+$/;
				if (reg.test(tg)) {
					console.log('是')
				}else{
					console.log('否')
					this.$util.delKey('t')
				}
			}
			// console.log(options.query)
			// 展示本地存储能力
			var that = this;
			// 二维码链接获取参数tid
			if (options.query) {
				let ta = decodeURIComponent(options.query.t);
				if (ta && ta != 'undefined') {
					// console.log('t:', ta)
					// uni.setStorageSync('t', t)
					this.$util.setKey('t', ta, false)
				}
				const sceneObj = this.$util.urlParams(options.query.scene)
				let tb = sceneObj.t /* 邀请码 */
				if (tb && tb != 'undefined') {
					// console.log('t:', tb)
					// uni.setStorageSync('t', t)
					this.$util.setKey('t', tb, false)
				}
			}
		},
		onShow: function() {
			console.log('App Show')

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import url("/static/css/iconfont.css");
	@import "uview-ui/index.scss";
	@import "static/css/style.scss";
</style>
