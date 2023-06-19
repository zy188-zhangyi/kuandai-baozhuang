<template>
	<view class="u-wrap page-box u-p-l-30 u-p-r-30">
		<view class="page-title u-p-b-20">
			{{authouName}}
		</view>
		<u-swiper :list="banners" height="300"></u-swiper>
		<view class="user-box u-flex color-white">
			<view class="user-box-l color-white u-m-r-30">
				<i class="iconfont icon-kuandaitisu"></i>
			</view>
			<view class="u-flex-1">
				<view class="color-yellow">
					Hi，欢迎来自{{areaData}}的朋友
				</view>

			</view>
		</view>
		<view class="u-flex u-m-t-20">
			<view class="listkan">
				<image :src="homeListPic" mode=""></image>
			</view>
			<view class="u-flex-1">
				<view class="u-flex u-text-center u-font-lg color-blues">
					<view v-for="(item,cindex) in category" :key="cindex" class="u-flex-3">
						<text :class="curr==cindex?'color-red':''" :data-index="cindex"
							@tap="setCurr">{{item.name}}</text></text>
					</view>
				</view>
			</view>
		</view>
		<swiper :style="'height: ' + height + 'px'" :current="curr" @change="setCurrs">
			<swiper-item v-for="(item,ccindex) in category" :key="ccindex">
				<scroll-view class="swiper-item-content">
					<view class="list-shop" v-show="screenShow">
						<view class="nodata">
							<image src="../../static/images/nodats.png" mode=""></image>
							<view class="u-font-sm color-gray">
								暂无覆盖的对应套餐
							</view>
						</view>
					</view>
					<view v-show="!screenShow" class="list-shop" v-for="(item,sindex) in listAll" :key="sindex"
						@click="showShop(item.id)">
						<view class="u-flex color-shop">
							<view class="shop-pic">
								<image :src="item.pichome" mode=""></image>
							</view>
							<view class="u-flex-1">
								<view class="shop-title">
									{{item.title}}
								</view>
								<view class="color-gray u-flex h-shop-lie">
									<view class="u-flex-1">
										<view class="u-font-sm u-m-b-10" v-if="item.widthData && item.widthData != '----'">
											<text class="u-m-r-15 text-bold">{{item.widthData}}</text>
										</view>
										<view class="u-font-sm u-m-b-5">
											<text class="color-red u-m-r-10 u-font-lg" v-if="item.shipPrice && item.shipPrice != '0'">¥ {{item.shipPrice}}</text>
											<text class="color-light zhx u-font-sm" v-if="item.marketPrice && item.marketPrice != '0'">¥ {{item.marketPrice}}</text>
										</view>
									</view>
									<view class="shop-buy">
										<button class="shop-buy-btn">查看</button>
									</view>
								</view>

							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

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
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	let qqmapsdk;
	export default {
		data() {
			return {
				uid: 0,
				areaId: 0,
				authouName: '',
				homeListPic: '',
				regionData: '欢迎您，来自',
				areaData: '地区',
				siteUrl: '',
				banners: [],
				inviteAll: 0,
				orderAll: 0,
				payAll: 0,
				cateId: undefined,
				shopAll: [],
				listAll: [],
				listAlls: [],
				screenShow: true,
				limit: 100, //套餐总量
				curr: 0,
				height: 180,
				category: [],
				openAll: 0
			}
		},
		onLoad(options) {
			this.authouName = this.$baseTit
			this.siteUrl = this.$baseUrl + '/'
			this.getHome()
			this.findFuzzyLocation()
			this.login()
			if (this.cateId) {
				this.getShop(this.cateId)
			}
		},
		onShow() {
			// let that = this
			// // this.showA()
			// this.areaId = this.$util.getKey('areaId')
			// if (this.areaId == 0) {
			// 	this.areaData = '未知社区'
			// 	// this.getAuthorize()
			// 	this.getLocation()
			// }
			// if (this.areaId > 0) {
			// 	// this.getAuthorize()
			// 	this.findArea(this.areaId)
			// }
			if (this.$util.getKey('uid')) {
				this.uid = this.$util.getKey('uid')
			}
		},
		methods: {
			login() {
				let _this = this
				let t = ''
				if (this.$util.getKey('t') && this.$util.getKey('t') !== 'undefined') {
					t = this.$util.getKey('t')
				}
				// console.log('wewef')
				uni.login({
					provider: 'weixin',
					success: (res) => {
						//这里获取的是用户的code，用来换取 openid、unionid、session_key 等信息，再将信息丢给后台自己的登录业务就行了
						// console.log('coderes', res)
						uni.request({
							url: _this.$baseUrl + '/front/member/wxUserInfo', //仅为示例，并非真实接口地址。
							method: 'POST',
							data: {
								code: res.code,
								userLeader: t
							},
							header: {
								'content-type': 'application/json'
							},
							success: (res) => {
								// console.log('res')			
							}
						});
					}

				})
			},
			setCurr(e) {
				this.curr = e.detail.current || e.currentTarget.dataset.index || 0;

				let id = this.category[this.curr].id
				// this.getShop(id)

			},
			setCurrs(e) {
				this.curr = e.detail.current || e.currentTarget.dataset.index || 0;
					let id = this.category[this.curr].id
					this.getShop(id)
				
			},
			getShop(id) {
				let _this = this
				this.listAll = this.listAlls.filter(row => {
					return row.sid == id
				})
				if (this.listAll) {
					this.screenShow = false
					this.$nextTick(() => {
						_this.getCurrentSwiperHeight('.swiper-item-content');
					});
					return
				}
				this.screenShow = true
			},
			getCurrentSwiperHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						if (res[0].height > this.height) {
							this.height = res[0].height;
						}
					}
				});
			},
			// showA() {
			// 	uni.showToast({
			// 		title: "555" + this.areaId
			// 	});
			// },
			getHome() {
				uni.request({
					url: this.$baseUrl + '/front/home/getHome',
					data: {},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						if (result.code == 0) {
							// console.log('222',result.data)
							const banners = []
							const bannerdata = result.data.banners
							this.category = result.data.category
							this.authouName = result.data.mlang.homeTitle
							this.$util.setTabBar(1, result.data.mlang.tabMeal)
							this.homeListPic = result.data.mlang.homeListPic
							this.cateId = result.data.category[0].id
							bannerdata.forEach(item => {
								const items = {}
								items.image = this.siteUrl + item.adPic
								items.title = item.adName
								banners.push(items)
							})
							this.banners = banners
							this.findShop(this.cateId)
						}
					}
				});
			},

			findShop(cateId) {
				uni.request({
					url: this.$baseUrl + '/front/shop/shopDataList', //仅为示例，并非真实接口地址。
					data: {
						// Pid: ,
						cateIds: this.cateId,
						limit: this.limit
					},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						if (result.code == 0) {
							let _this = this
							if (result.data.total) {
								let list = result.data.list
								let pgList = []
								list.forEach(item => {
									let pic = item.pics[0]
									item.pichome = _this.siteUrl + pic.url
									pgList.push(item)

								})
								
								_this.listAlls = pgList
								this.getShop(cateId)
								return
							}
							this.screenShow = true
							// this.screenList()
						}
					}
				})
			},
			showShop(id) {
				uni.navigateTo({
					url: '/pages/shop/show?id=' + id
				})
			},
			comChat(e) {
				// console.log('@', e.detail.path)
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){},
			findFuzzyLocation() {
				qqmapsdk = new QQMapWX({
					key: this.$baseWxMapKey // 必填，填自己在腾讯位置服务申请的key
				});
				let _this = this
				wx.authorize({
					scope: 'scope.userFuzzyLocation',
					success(res) {
						if (res.errMsg == 'authorize:ok') {
							uni.getFuzzyLocation({
								type: 'wgs84',
								success(res) {
									qqmapsdk.reverseGeocoder({
										//位置坐标，默认获取当前位置，非必须参数 
										//Object格式
										location: {
											latitude: res.latitude,
											longitude: res.longitude,
										},
										success: function(res) { //成功后的回调
											// console.log('dizres',res)
											let {
												result: {
													ad_info
												}
											} = res
											let {
												result: {
													address_component
												}
											} = res
											_this.$util.setKey('address_component',
												address_component)
											_this.areaData = ad_info.city + ad_info.district
										},
										fail: function(error) {
											console.error('error', error);
										}
									})
								}
							})
						}
					},
					fail(err) {
						console.log('err', err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.trade {
		width: 100%;
		color: #007AFF;
		overflow: auto;
	}

	.trade view {
		text-align: center;
		padding-left: 25upx;
		width: 30%;
		float: left;
	}

	.trade .active {
		border-bottom: 8upx solid #F0AD4E;
	}

	.box-map {
		margin: 10px auto;
		line-height: 32px;
		font-size: 28rpx;
	}

	.user-box {
		margin: 20px auto;
		padding: 10px;
		background: #79a8a9;
		border-radius: 5px;
		font-size: 28rpx;

		.user-box-l i {
			font-size: 64rpx;
		}
	}
</style>