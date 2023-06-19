<template>
	<view class="">
		<view class="u-flex u-col-bottom box-sift u-p-l-20 u-p-r-20">
			<view class="u-flex-1 u-m-l-30 u-p-20" @click="clickDate">
				<view class="color-white u-font-sm">
					<text class="u-m-r-15">{{dateValue}}</text>
					<u-icon name="arrow-down" color="#ffffff" size="28"></u-icon>
				</view>
				<template>
					<u-select :default-value="dateIndex" v-model="dateShow" mode="mutil-column-auto" :list="dateList" @confirm="dateConfirm">
					</u-select>
				</template>
			</view>
			
			<view class="u-m-l-30 u-p-20">
				<view class="u-text-right color-white u-font-sm">
					总计: {{total}}
				</view>
			</view>	
		</view>
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
						<text class="font-weight u-m-r-15">时间</text>
						<text class="color-red">{{item.createdAt}}</text>
					</view>
					<view class="u-m-t-5">
						<text class="font-weight u-m-r-15">单号</text>
						<text class="color-grey">{{item.orderNo}}</text>
					</view>
					<view class="u-m-t-5">
						<text class="font-weight u-m-r-15">套餐</text>
						<text class="color-grey">{{item.linkedSysShopOrderSysShopData.title}}</text>
					</view>
					<!-- <view class="u-m-t-5">
						<text class="font-weight u-m-r-15">地址</text>
						<text class="color-grey">{{item.linkedSysShopOrderSysShopArea.areaData}}</text>
						<text class="color-grey">{{item.userAddress}}</text>
					</view>
					<view class="u-m-t-5">
						<text class="font-weight u-m-r-15">手机</text>
						<text class="color-grey">{{item.userMobile}}</text>
					</view> -->
					<view class="u-m-t-5">
						<text class="font-weight u-m-r-15">类型</text>
						<text class="color-grey">{{item.shopType}}</text>
						<text class="color-grey">{{item.widthData}}</text>
					</view>
					<view class="u-m-t-10 u-font-md">
						<text class="font-weight u-m-r-15">状态</text>
						<text v-show="item.orderType==1" class="color-blue">待确认</text>
						<text v-show="item.orderType==2" class="color-green">已确认</text>
						<text v-show="item.orderType==3" class="color-grey">----</text>
						<text v-show="item.workType==0" class="color-blue u-m-l-30">未派发</text>
						<text v-show="item.workType==1" class="color-f u-m-l-30">已派发</text>
						<!-- <u-icon v-show="item.workType==1" class="u-m-l-15" :name="item.arrow" size="28"
							@click="showWorks(sindex)"></u-icon> -->
						<text v-show="item.workType==3" class="color-green u-m-l-30">已完工</text>
						<text v-show="item.workType==4" class="color-red u-m-l-30">异常单</text>
					</view>
					<!-- <view v-show="idx==sindex" class="u-m-t-10">
						<text class="font-weight u-m-r-15">联系</text>
						<text class="u-m-r-15 color-grey">{{item.linkedSysShopOrderSysShopWork.workName}}</text>
						<text class="u-m-r-15 color-grey">{{item.linkedSysShopOrderSysShopWork.workUser}}</text>
						<text class="u-m-r-15 color-grey">{{item.linkedSysShopOrderSysShopWork.workMobile}}</text>
					</view> -->
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
	</view>

</template>

<script>
	import {dateSelectYear} from '@/common/timeSelector.js'
	export default {
		data() {
			return {
				uid: 0,
				page: 1,
				limit: 10,
				total: 0,
				listInfo: [],
				screenShow: true,
				showWork: false,
				showName: 'arrow-down',
				idx: -1,
				dateShow: false,
				dateValue:'',
				dateList: undefined,
				toYear: '',
				toDay: '',
				dateIndex: [0, 0]
			}
		},
		onLoad() {
			this.dateText()
			this.$util.isLogin()
			if (this.$util.getKey('uid')) {
				this.uid = this.$util.getKey('uid')
			}
			this.$nextTick(function() {
				this.getOrders()
			})
		},
		methods: {
			showWorks(index) {
				this.listInfo[index].arrow = (this.listInfo[index].arrow == 'arrow-down') ? 'arrow-up' : 'arrow-down'
				this.idx = this.idx == index ? -1 : index
			},
			pageChange(e) {
				this.page = e.current
				this.getOrders()
			},
			getOrders() {
				uni.request({
					url: this.$baseUrl + '/front/users/inorder', //仅为示例，并非真实接口地址。
					data: {
						toYear: this.toYear,
						toDay: this.toDay,
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
							let lists = []
							if (list.length > 0) {
								list.forEach((item) => {
									item.arrow = 'arrow-down'
									lists.push(item)
								})
							}
							// console.log(lists)
							this.listInfo = lists
						} else {
							this.screenShow = true
						}
					}
				})
			},
			comChat() {
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){},
			dateConfirm(e){
				let _this = this
				this.dateValue = e[0].label + ' ' + e[1].label
				let m = e[0].label
				let d = e[1].label
				this.toYear = m.replace(/[^\d]/g,'')
				this.toDay = d.replace(/[^\d]/g,'')
				this.dateIndex[0] = 2 - e[0].value
				let chi = this.dateList[2 - e[0].value].children
				chi.map(function(value, index) {
					if(value.label === d ){
						_this.dateIndex[1] = index
						return
					}
				})
				this.getOrders()
			},
			clickDate(){
				this.dateShow = true
			},
			dateText(){
				this.dateList = dateSelectYear()
				let yLabel = this.dateList[0].label
				let chi = this.dateList[0].children
				let mlabel = chi[chi.length - 1].label
				this.dateValue = yLabel + ' ' + mlabel
				this.toYear = yLabel.replace('年','')
				this.toDay = mlabel.replace('月','')
				this.dateIndex[1] = chi.length - 1
			}
		}
	}
</script>
<style>
	.box-sift {
		width: 100vw;
		height: 100rpx;
		background-color: #c9d6de;
	}
</style>
