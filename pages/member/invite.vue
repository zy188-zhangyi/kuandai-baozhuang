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
			<view class="color-gray u-flex u-font-sm">
				<view class="u-m-t-8 u-m-b-5 u-m-r-20">
					<image class="user-avatar" :src="item.avatar" mode=""></image>
				</view>
				<view class="u-flex-1">
					<view class="">
						<text class="font-weight u-m-r-15">加入时间</text>
						<text class="color-red">{{item.createdAt}}</text>
					</view>
					<view class="u-m-t-10">
						<text class="font-weight u-m-r-15">用户帐号</text>
						<text class="color-grey">{{item.mobile}}</text>
					</view>
					<view class="u-m-t-10">
						<text class="font-weight u-m-r-15">用户昵称</text>
						<text class="color-grey">{{item.linkedSysInviteDataSysUser.userNickname}}</text>
					</view>
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
				var _this = this
				uni.request({
					url: this.$baseUrl + '/front/users/invite', //仅为示例，并非真实接口地址。
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
							let olist = []
							list.forEach((item,index)=>{
								if(item.linkedSysInviteDataSysUser){
									let a = item.linkedSysInviteDataSysUser.avatar
									list[index].avatar = _this.$util.GetUpFileUrl(_this.$baseUrl,a)
								}else{
									list[index].avatar = '/static/images/default-avatar.png'
								}
								olist.push(item)
							})
							this.listInfo = olist
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
			sessionFrom(){
				
			}
		}
	}
</script>
<style>
	.user-avatar{
		width: 60px;
		height: 60px;
		border-radius: 4px;
	}
</style>