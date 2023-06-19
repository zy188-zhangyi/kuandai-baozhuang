<template>
</template>

<script>
	export default {
		data() {
			return {
				uid: 0,
				page: 1,
				limit: 15,
				total: 0,
				listInfo: []
			}
		},
		onLoad() {
			this.$util.isLogin()
			if (this.$util.getKey('uid')) {
				this.uid = this.$util.getKey('uid')
			}
			this.$nextTick(function() {
				this.getOrders()
			})
		},
		methods: {
			getOrders() {
				uni.request({
					url: this.$baseUrl + '/front/users/order', //仅为示例，并非真实接口地址。
					data: {
						page: this.page,
						limit: this.limit,
					},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'GET',
					success: (res) => {
						let result = res.data
						// console.log(result)
						if (result.code == 0) {
						}
					}
				})
			}
		}
	}
</script>
<style>
</style>