<template>
	<view class="u-wrap page-box-no u-p-l-15 u-p-r-15">
		<view class="all-box-no" v-show="screenShow">
			<view class="nodata">
				<image src="../../static/images/nodats.png" mode=""></image>
				<view class="u-m-t-15 color-gray">
					没有记录
				</view>
			</view>
		</view>
		<view v-show="!screenShow" class="all-box-no" v-for="(item,sindex) in listInfo" :key="sindex">
			<view class="color-gray u-font-sm">
				<view class="u-m-t-5">
					<text class="font-weight u-m-r-15">返现时间</text>
					<text class="color-red">{{item.createdAt}}</text>
				</view>
				<view class="u-m-t-5">
					<text class="font-weight u-m-r-15">报装单号</text>
					<text class="color-grey">{{item.orderNo}}</text>
				</view>
				<view class="u-m-t-5" v-show="item.leaderUid==uid">
					<text class="font-weight u-m-r-15">推荐返比</text>
					<text class="color-grey">{{item.leaderZero}}%</text>
				</view>
				<view class="u-m-t-5" v-show="item.leaderUid==uid">
					<text class="font-weight u-m-r-15">返现总额</text>
					<text class="color-red">{{item.leaderAmount/100}} 元</text>
				</view>
				<view class="u-m-t-5" v-show="item.uid==uid">
					<text class="font-weight u-m-r-15">报装返比</text>
					<text class="color-grey">{{item.uidZero}}%</text>
				</view>
				<view class="u-m-t-5" v-show="item.uid==uid">
					<text class="font-weight u-m-r-15">返现总额</text>
					<text class="color-red">{{item.uidAmount/100}} 元</text>
				</view>
			</view>
		</view>
		<view class="pagination-box" v-show="total > 0">
			<uni-pagination :show-icon="true" :pageSize="limit" :total="total" @change="pageChange" />
		</view>
		<view class="fix-right-bottom">
			<view class="chat-boxx">
				<button class="chat-box-btnx" open-type="contact" bindcontact="comChat" session-from="sessionFrom">
					<image src="../../static/chats.png" mode="widthFix"
						style="height:60rpx;width: 60rpx;margin-bottom: -6px;"></image>
					<text>客服</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: 0,
				page: 1,
				limit: 10,
				total: 0,
				listInfo: [],
				screenShow: true
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
			pageChange(e) {
				this.page = e.current
				this.getOrders()
			},
			getOrders() {
				uni.request({
					url: this.$baseUrl + '/front/users/income', //仅为示例，并非真实接口地址。
					data: {
						page: this.page,
						limit: this.limit,
					},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						// console.log(result)
						if (result.code == 0) {
							this.screenShow = false
							this.total = result.data.total
							if (this.total == 0) {
								this.screenShow = true
							}
							let list = result.data.list
							this.listInfo = list
						} else {
							this.screenShow = true
						}
					}
				})
			},
			comChat(){
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){}
		}
	}
</script>
<style>
</style>