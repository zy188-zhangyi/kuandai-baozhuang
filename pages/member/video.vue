<template>
	<view class="video_box">
		<video class="video" id="video" @play="videoPlay()" :src="urlJiaoCheng" controls
			object-fit="cover"></video>
		<view class="video-btn">
			<button class="save-btn" type="primary" @click="closeJiaoCheng">好的，我看完了</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0,
				showJiaoCheng: false,
				urlJiaoCheng: 'https://file1.ethernet.xin:25800/chfs/shared/zhihuikuandai/jiaocheng.mp4',
				beginPlay: false,
				videoContext: null
			}
		},
		methods: {
			closeJiaoCheng() {
				let video = uni.createVideoContext("video", this)
				video.pause()
				uni.switchTab({
					url: 'member'
				})
			},
			videoPlay(index) {
				let video = uni.createVideoContext("video", this)
				video.play();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video_box {
		width: 100vw;
		height: 100vh;
		padding: 20px;
		background: #d1f4fa;
		position: relative;
	}
	
	.video {
		width: 100%;
		height: calc(100vh - 180upx);
	}

	.video-btn {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 20px;
	}
</style>
