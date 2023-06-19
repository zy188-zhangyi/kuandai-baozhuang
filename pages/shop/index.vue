<template>
	<view class="u-wrap page-box u-p-l-30 u-p-r-30">
		<view class="page-title">
			{{pageName}}
		</view>
		<view class="au-m-t-20">
			<view class="u-flex u-m-t-15 u-m-b-15">
				<view class="listkan">
					<image :src="shopListPic" mode=""></image>
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
				areaId: 0,
				pageName: '套餐列表',
				shopListPic:'',
				regionData: '请选择您的',
				areaData: '所属社区',
				siteUrl: '',
				cateId: 1,
				shopAll: [],
				listAll: [],
				screenShow: true,
				limit: 100, //套餐总量
				cateList: [],
				cateLists: [],
				current: 0,
				cateSid: 0,
				curr: 0,
				height: 180,
				category: []
			}
		},
		onLoad() {
			this.siteUrl = this.$baseUrl + '/'
			this.getHome()
		},
		methods: {
			setCurr(e) {
				this.curr = e.detail.current || e.currentTarget.dataset.index || 0;
				let id = this.category[this.curr].id
				this.getShop(id)

			},
			setCurrs(e) {
				this.curr = e.detail.current || e.currentTarget.dataset.index || 0;
				let id = this.category[this.curr].id
				this.getShop(id)
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
						// console.log('resdata',result.data)
						if (result.code == 0) {
							this.category = result.data.category
							this.shopListPic = result.data.mlang.shopListPic
							this.pageName = result.data.mlang.shopTitle
							this.cateId = result.data.category[0].id
							this.findShop(this.cateId)
						}
					}
				});
			},
			getShop(id) {
				let _this = this
				this.listAll = this.listAlls.filter(row => {
					return row.sid == id
				})
				console.log('listall',this.listAll)
				if(this.listAll){
					this.screenShow = false
					this.$nextTick(() => {
						_this.getCurrentSwiperHeight('.swiper-item-content');
					});
					return
				}
				this.screenShow = true
			},
			findShop(cateId) {
				uni.request({
					url: this.$baseUrl + '/front/shop/shopDataList', //仅为示例，并非真实接口地址。
					data: {
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
							if(result.data.total){
								let list = result.data.list
								let pgList = []
								list.forEach(item => {
										let pic = item.pics[0]
										item.pichome = _this.siteUrl + pic.url
										pgList.push(item)
									
								})
								this.listAlls = pgList
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
			comChat() {
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){}
		}
	}
</script>

<style>

</style>
