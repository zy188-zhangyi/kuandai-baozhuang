export default {
	data() {
		return {
			// 默认的全局分享内容
			share: {
				title: '宽带报装(一键报装，全程无忧)',
				path: '/pages/index/index', // 全局分享的路径，比如 首页
				imageUrl: '/static/invite.png', // 全局分享的图片(可本地可网络)
				desc: '无论在哪，我一直使用的宽带安装助手', // 自定义分享描述
				content: '来到新家了？您还在为安装宽带而烦忧？宽带报装帮您解决上网之烦恼。选择我们，选择信赖，一键报装，全程无忧！' // 分享的文案
			}
		}
	},
	// 定义全局分享
	// 1.发送给朋友
	onShareAppMessage(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
	//2.分享到朋友圈
	onShareTimeline(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
}
