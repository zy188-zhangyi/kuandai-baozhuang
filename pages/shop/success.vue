<template>
	<view class="u-wrap page-box u-p-l-30 u-p-r-30">
		<view class="page-title">
			{{authouName}}
		</view>
		<view class="success-box">
			<view class="order-success">
				<image src="../../static/images/orderok.png" mode=""></image>
				<view class="">
					恭喜您，预约成功
				</view>
			</view>
			<view class="u-flex u-m-t-60">
				<view class="u-flex-1">
					<u-button type="info" size="mini" @click="gohome">返回首页</u-button>
				</view>
				<view class="u-flex-1">
					<u-button type="primary" size="mini" @click="gomember">推荐朋友</u-button>
				</view>
			</view>
			
		</view>
		<view class="all-box color-d">
			<p>1.宽带报装致力于宽带安装服务，解决您的网络安装难题；</p>
			<p>2.宽带报装方便用户宽带报装服务：一键报装，全程无忧；</p>
			<p>3.欢迎您推荐给您的朋友使用宽带报装报装服务。</p>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				authouName: '下单成功'
			}
		},
		onLoad() {
			
		},
		methods: {
			gohome() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			gomember() {
				uni.reLaunch({
					url: '/pages/member/member'
				})
			}
		}
	}
</script>


<style lang="scss">
	.success-box{
		margin:80px;
		text-align: center;
	}
	.order-success image {
		width: 150px;
		height: 120px;
	}
</style>
