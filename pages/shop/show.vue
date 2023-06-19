<template>
	<view class="page-box-b-80">
		<view class="page-swiper">
			<swiper class="swiper shop-swiper" circular :indicator-dots="true" :autoplay="false">
				<swiper-item class="shop-pics" v-for="(item, pindex) in shopPics" :key="pindex">
					<image :src="item.pics" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="shop-title u-p-20">
			{{shopInfo.title}}
		</view>
		<view class="u-p-15 u-flex u-font-md color-gray" v-if="shopInfo.widthData && shopInfo.widthData != '----'">
			<view class="u-flex-1">
				<text class="u-m-r-15 text-bold">{{shopTypeInfo}}</text>
				<text>{{shopInfo.widthData}}</text>
			</view>
		</view>
		<view class="u-m-t-15 u-p-15 u-flex u-font-md color-gray">
			<view class="u-flex-1" v-if="shopInfo.shipPrice && shopInfo.shipPrice != '0'">
				<text class="u-m-r-15 text-bold">{{shopShipPrice}}</text>
				<text class="color-red u-font-lg">¥ {{shopInfo.shipPrice}}</text>
			</view>
			<view class="u-flex-1" v-if="shopInfo.marketPrice && shopInfo.marketPrice != '0'">
				<text class="u-m-r-15 text-bold">{{shopMarkPrice}}</text>
				<text class="color-light zhx u-font-sm">¥ {{shopInfo.marketPrice}}</text>
			</view>
		</view>
		<view class="listkan u-m-t-15">
			<image :src="showShowPic" mode=""></image>
		</view>
		<view class="shop-content u-m-t-15">
			<rich-text class="show-editor" :nodes="shopInfo.content|formatRichText"></rich-text>
		</view>
		<view class="fixed-bottom u-flex">
			<view class="chat-box">
				<button type="defaults" class="chat-box-btn" @click="gohome">
					<image src="../../static/images/tohome.png" mode="widthFix"
						style="height:46rpx;width: 46rpx;margin-top:6px;margin-bottom: -5px;"></image>
					<text style="color:#1f4e5f;">首页</text>
				</button>
			</view>
			<view class="chat-box">
				<!-- <button open-type="contact" show-message-card :send-message-img='message.img'
					:send-message-title="message.title" :send-message-path="message.path" type="defaults"
					class="chat-box-btn"> -->
				<button class="chat-box-btn" open-type="contact" bindcontact="comChat" session-from="sessionFrom">
					<image src="../../static/images/chat.png" mode="widthFix"
						style="height:46rpx;width: 46rpx;margin-top:6px;margin-bottom: -5px;"></image>
					<text style="color:#1f4e5f;">客服</text>
				</button>
			</view>
			<view class="u-flex-1">
				<button type="defaults" class="shop-buy-btn" @click="buyShow">
					<uni-icons class="arrow" type="paperplane" size="18" color="#ffffff"></uni-icons>
					<text class="txt u-m-r-20">{{shopOrderBuy}}</text>
				</button>
			</view>
		</view>
		<u-popup v-model="showBuy" mode="bottom" :closeable="true">
			<view class="u-m-20">
				<view class="shop-title u-p-20">
					{{shopInfo.title}}
				</view>
				<view class="u-p-15 u-flex u-font-md color-gray">
					<view class="u-flex-1">
						<text class="u-m-r-15 text-bold">{{shopTypeInfo}}</text>
						<text>{{shopInfo.widthData}}</text>
					</view>
				</view>
				<view class="u-m-t-15 u-p-15 u-flex u-font-md color-gray">
					<view class="u-flex-1">
						<text class="u-m-r-15 text-bold">{{shopShipPrice}}</text>
						<text class="color-red u-font-lg">¥ {{shopInfo.shipPrice}}</text>
					</view>
					<view class="u-flex-1" v-show="shopInfo.marketPrice">
						<text class="u-m-r-15 text-bold">{{shopMarkPrice}}</text>
						<text class="color-light zhx u-font-sm">¥ {{shopInfo.marketPrice}}</text>
					</view>
				</view>
<!-- 				<view class="u-p-15 u-flex u-font-md color-gray">
					<text class="u-m-r-15 text-bold">区域</text>
					<text>111{{regionData}}</text>
				</view> -->
				<view class="u-p-15 u-flex u-font-md color-gray">
					<view class="u-m-r-15 text-bold">
						区域
					</view>
					<view class="u-flex-1">
						<picker class="pickerList" mode="multiSelector" :range="newProvinceDataList" range-key="label"
							:value="multiIndex" @change="pickerChange" @columnchange="pickerColumnchange">
							<view class="select-city u-flex">
								<view class="input u-flex-1" v-model="form.area" v-if="select !== ''">{{select}}</view>
								<view v-else v-model="form.area" class="placeholder-input u-flex-1">请选择您的所在区域</view>
								<u-icon name="arrow-down"></u-icon>
							</view>
						</picker>
					</view>
				</view>
				<view class="u-p-15 u-font-md color-gray">
					<u-form :model="form" ref="uForm">
						<u-form-item label="地址" right-icon="" :label-style="labelStyle">
							<u-input v-model="form.userAddress" placeholder="具体到X街道X社区X路X巷X号X室" />
						</u-form-item>
						<u-form-item label="手机" right-icon="" :label-style="labelStyle">
							<view class="u-flex">
								<view class="u-flex-1">
									<u-input v-model="form.userMobile" placeholder="联系方式(可联系的号码)" />
								</view>
								<view class="">
									<u-button size="mini" type="warning" :plain="true" :ripple="true"
										open-type="getPhoneNumber" @getphonenumber="wxGetPhone">一键获取</u-button>
								</view>
							</view>
						</u-form-item>
						<u-form-item label="备注" prop="intro" :label-style="labelStyle">
							<u-input v-model="form.userMemo" placeholder="备注(如:可上门时间,等等说明)" />
						</u-form-item>
					</u-form>
				</view>
				<view class="err-box u-flex" v-show="showErr">
					<view class="u-flex-1">
						<u-icon name="error" size="26" class="u-m-r-15"></u-icon>{{errInfo}}
					</view>
					<view class="">
						<u-icon name="close-circle" color="#f7f900" size="36" @click="showErr=false"></u-icon>
					</view>
				</view>
				<view class="u-m-30">
					<button type="defaults" class="shop-buy-btn" @click="submitOrder">
						<uni-icons class="arrow" type="cart-filled" size="18" color="#ffffff"></uni-icons>
						<text class="txt u-m-r-20">提交订单</text>
					</button>
				</view>
				<view class="d-bottom">
					
				</view>
			</view>
		</u-popup>
		<w-loading text="..." mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {
		regionData,
		CodeToText,
		TextToCode
	} from 'element-china-area-data'
	export default {
		data() {
			return {
				areaId: 0,
				regionData: '请选择您的',
				areaData: '',
				shopOrderBuy: '·····',
				shopTypeInfo: '',
				shopShipPrice: '',
				shopMarkPrice: '',
				shopId: 0,
				siteUrl: '',
				shopInfo: {
					title:'',
					shipPrice:''
				},
				shopPics: [],
				showBuy: false,
				form: {},
				showErr: false,
				errInfo: '',
				areaTit: '切换',
				message: {},
				userInfo: {},
				detail: {},
				pdata: {},
				labelStyle: {
					'font-weight': 'bold',
					'color': '#777'
				},
				newProvinceDataList: [
					[],
					[],
					[]
				],
				regionCode: '',
				multiIndex: [0, 0, 0],
				select: '',
				oldpProvinceDataList: regionData,
				openAll: 1,
				showShowPic: ''
			}
		},
		onLoad: function(option) {
			this.shopId = option.id
			this.siteUrl = this.$baseUrl + '/'
			if (this.shopId == 0) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			} else {
				this.getShopOne(this.shopId)
				this.form.shopId = this.shopId
			}
			let address_component = this.$util.getKey('address_component')
			if(address_component){
				this.select = address_component.province + ' ' + address_component.city + ' ' + address_component.district
				let dra = TextToCode[address_component.province].code || '0'
				let drb = TextToCode[address_component.province][address_component.city].code || '0'
				let drc = '0'
				if(address_component.district){
					 drc = TextToCode[address_component.province][address_component.city][address_component.district].code
				}
				let dre = dra + ',' + drb + ',' + drc
				this.regionCode = dre
			}
			this.init(this.multiIndex) //选项初始化 省市区联动

			let areaarr = this.regionCode.split(',')
			this.getRegionIndex(areaarr).then(res => {
				this.newProvinceDataList = [
					[],
					[],
					[]
				];
				this.init(this.multiIndex);
			})
			
			// this.areaId = this.$util.getKey('areaId') || 0
			// if (this.areaId !== 0) {
			// 	this.findArea(this.areaId)
			// 	this.form.areaId = this.areaId
			// } else {
			// 	this.areaTit = '添加'
			// }
			if (this.$util.getKey('userMobile')) {
				this.form.userMobile = this.$util.getKey('userMobile')
			}
			if (this.$util.getKey('orderMobile')) {
				this.form.userMobile = this.$util.getKey('orderMobile')
			}
			if (this.$util.getKey('uid')) {
				this.form.uid = this.$util.getKey('uid')
			}
		},
		methods: {
			// 	findArea(areaId) {
			// 		uni.request({
			// 			url: this.$baseUrl + '/front/area/shopAreaOne', //仅为示例，并非真实接口地址。
			// 			data: {
			// 				id: areaId
			// 			},
			// 			header: {
			// 				'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
			// 				'content-type': 'application/json'
			// 			},
			// 			method: 'POST',
			// 			success: (res) => {
			// 				let result = res.data
			// 				if (result.code == 0) {
			// 					let o = result.data.regionData
			// 					let re = o.replace(/\/*/g, '')
			// 					this.regionData = re
			// 					this.areaData = result.data.areaData
			// 				}
			// 			}
			// 		})
			// 	},
			getShopOne(id) {
				let _this = this
				uni.request({
					url: this.$baseUrl + '/front/shop/getShopOne', //仅为示例，并非真实接口地址。
					data: {
						id: this.shopId,
					},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						console.log('shop',result) 
						if (result.code == 0) {
							this.shopOrderBuy = result.data.mlang.shopOrderBuy
							this.shopTypeInfo = result.data.mlang.shopTypeInfo
							this.openAll = result.data.openAll
							this.shopMarkPrice = result.data.mlang.shopMarkPrice
							this.shopShipPrice = result.data.mlang.shopShipPrice
							this.showShowPic = result.data.mlang.shopShowPic
							let t = result.data.mlang.shopShowTitle
							uni.setNavigationBarTitle({
							  title: t
							})
							let list = result.data.info
							let pics = list.pics
							let picList = []
							pics.forEach((item, index) => {
								if (index == 0) {
									this.message.img = this.siteUrl + item.url
								}
								item.pics = this.siteUrl + item.url
								picList.push(item)
							})
							this.message.title = list.title
							this.message.path = "/pages/shop/show?id=" + list.id
							this.shopPics = picList
							this.shopInfo = list
							this.form.widthData = this.shopInfo.widthData
						} else {
							uni.showToast({
								title: '此套餐不存在了',
								icon: "none"
							});
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/shop/index'
								})
							}, 1000)
						}
					}
				})
			},
			gohome() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			buyShow() {
				if (this.openAll == 1){
					this.showBuy = false
					return false
				}
				if (this.$util.isLogin()) {
					this.showBuy = true
				}
			},
			// 	inputChange(o) {
			// 		let oo = o.replace(/[^\w_^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
			// 		this.$nextTick(function() {
			// 			this.form.userAddress = oo;
			// 		})
			// 	},
			// 	inputChangem(o) {
			// 		let value = o
			// 		let oo = value.replace(/[^\d]/g, ''); // 清除除了中文以外的输入的字符
			// 		this.form.userMobile = oo
			// 	},
				submitOrder() {
					this.$util.isLogin()
					// if (!this.areaData) {
					// 	this.errInfo = '必须具体到您的社区哦'
					// 	this.showErr = true
					// 	return
					// }
					this.showErr = false
					let isAdress = /[\u4e00-\u9fa5]/.test(this.form.userAddress);
					if (!isAdress) {
						this.errInfo = '安装地址填写错误'
						this.showErr = true
						return
					}
					let isMobile = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(this.form.userMobile);
					if (!isMobile) {
						this.errInfo = '手机号码错误'
						this.showErr = true
						return
					}
					let len = this.form.userMemo
					if (len && len.length > 180) {
						this.errInfo = '备注太长，请简单描述'
						this.showErr = true
						return
					}
					this.form.userMemo = `[${this.shopInfo.shipPrice}/${this.shopInfo.marketPrice}]` + this.form.userMemo
					this.form.status = 1
					// console.log('name',this.shopInfo)
					this.form.shopType = this.shopInfo.linkedSysShopDataSysShopCategoryb.name
					this.$util.setKey('orderMobile',this.form.userMobile)
					// console.log('form',this.form)
					// return
					uni.request({
						url: this.$baseUrl + '/front/order/addOrder', //仅为示例，并非真实接口地址。
						data: this.form,
						header: {
							'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
							'content-type': 'application/json'
						},
						method: 'POST',
						success: (res) => {
							let result = res.data
							// console.log(result)
							if (result.code == 0) {
								uni.redirectTo({
									url: '/pages/shop/success'
								})
							} else {
								uni.showModal({
									title: '',
									content: result.msg,
									confirmText: '重新登陆',
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url: '/pages/member/index'
											})
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
							}
						}
					})
				},
				wxGetPhone(e) {
					let obj = e.detail
					var _this = this;
					uni.login({
						provider: 'weixin',
						success: function(res) {
							// console.log(res);
							if (res.code) {
								let code = res.code;
								uni.request({
									url: _this.$baseUrl +
										'/front/member/getWxUserInfo',
									data: {
										code: code
									},
									method: 'POST',
									header: {
										'content-type': 'application/json'
									},
									success: (res2) => {
										let result = res2.data
										// console.log(result)
										if (result.code == 0) {
											_this.detail = res2.data.data;
											// console.log(_this.detail)
											// console.log(obj)
											// _this.decryptPhone(e.detail);
											_this.pdata = {
												encryptedData: obj.encryptedData,
												iv: obj.iv,
												session_key: _this.detail.session_key
											}
											_this.decryptPhone(_this.pdata)
										}
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '获取手机号失败！',
									duration: 2000
								});
							}
						},
					});
					// console.log(e.detail)
					// this.decryptPhone(e.detail);
				},
				//解密手机
				decryptPhone(obj) {
					var _this = this;
					// console.log(obj)
					_this.$refs.loading.open()
					uni.request({
						url: this.$baseUrl + '/front/member/mobileUserInfo',
						method: 'POST',
						data: {
							encryptedData: obj.encryptedData,
							iv: obj.iv,
							session_key: obj.session_key
						},
						header: {
							'content-type': 'application/json'
						},
						success: (res) => {
							// console.log(res)
							_this.$refs.loading.close()
							if (res.data.code == 0) {
								let result = res.data.data
								_this.userInfo.mobile = result.phoneNumber || result.purePhoneNumber
								let mobile = _this.userInfo.mobile
								if (mobile) {
									_this.updateUserInfo()
									_this.$nextTick(() => {
										// console.log(mobile)
										_this.form.userMobile = mobile
									})
								}
							} else {
								uni.showToast({
									title: '获取手机号失败，请重试',
									icon: 'none'
								})
							}
						},
					})
				},
				//向后台更新信息
				updateUserInfo() {
					let _this = this;
					// console.log(_this);
					uni.request({
						url: this.$baseUrl + '/front/member/updateUserInfos', //服务器端地址
						data: {
							openId: _this.detail.openid,
							username: _this.userInfo.mobil,
							phonenumber: _this.userInfo.mobile
						},
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						success: (res) => {
							if (res.data.code == 0) {
								this.form.userMobile = _this.userInfo.mobile
								this.$forceUpdate()
							}
						}
					});
				},
			init(selectedArr = [0, 0, 0]) {
				for (let i = 0; i < this.oldpProvinceDataList.length; i++) {
					this.newProvinceDataList[0].push(this.oldpProvinceDataList[i]);
				}
				for (let i = 0; i < this.oldpProvinceDataList[selectedArr[0]].children.length; i++) {
					this.newProvinceDataList[1].push(this.oldpProvinceDataList[selectedArr[0]].children[i]);
				}
				for (let i = 0; i < this.oldpProvinceDataList[selectedArr[0]].children[selectedArr[1]].children
					.length; i++) {
					this.newProvinceDataList[2].push(this.oldpProvinceDataList[selectedArr[0]].children[
							selectedArr[1]]
						.children[i]);
				}
				this.multiIndex = selectedArr;
				this.form.regionCode = this.newProvinceDataList[0][this.multiIndex[0]].value + ',' + this
					.newProvinceDataList[1][
						this.multiIndex[1]
					].value + ',' + this.newProvinceDataList[2][this.multiIndex[2]].value //省市区表单串
				this.form.regionData = this.newProvinceDataList[0][this.multiIndex[0]].label + '/' + this
					.newProvinceDataList[1][this.multiIndex[1]].label + '/' + this.newProvinceDataList[2][this
						.multiIndex[
							2]
					].label
				this.form.provinceCode = this.newProvinceDataList[0][this.multiIndex[0]].value
				this.form.cityCode = this.newProvinceDataList[1][this.multiIndex[1]].value
				this.form.districtCode = this.newProvinceDataList[2][this.multiIndex[2]].value
			},
			async getRegionIndex(data) {
				let [province, city, county] = [0, 0, 0];
				province = this.newProvinceDataList[0].findIndex((item, index) => {
					return data[0] == item.value;
				})
				city = this.newProvinceDataList[0][province].children.findIndex((item, index) => {
					return data[1] == item.value;
				})
				county = this.newProvinceDataList[0][province].children[city].children.findIndex((item,
					index) => {
					return data[2] == item.value;
				})
				this.multiIndex = [province, city, county]
			},
			pickerChange(e) {
				this.multiIndex = e.detail.value;
				this.select = `${this.newProvinceDataList[0][this.multiIndex[0]].label}
										 ${this.newProvinceDataList[1][this.multiIndex[1]].label}
										 ${this.newProvinceDataList[2][this.multiIndex[2]].label}`
				this.form.regionCode = this.newProvinceDataList[0][this.multiIndex[0]].value + ',' + this
					.newProvinceDataList[1][
						this.multiIndex[1]
					].value + ',' + this.newProvinceDataList[2][this.multiIndex[2]].value //省市区表单串
				this.form.regionData = this.newProvinceDataList[0][this.multiIndex[0]].label + '/' + this
					.newProvinceDataList[1][this.multiIndex[1]].label + '/' + this.newProvinceDataList[2][this
						.multiIndex[
							2]
					].label
				// console.log(this.form)
			},
			pickerColumnchange(e) {
				if (e.detail.column === 0) {
					this.multiIndex[0] = e.detail.value
					this.newProvinceDataList[1] = this.oldpProvinceDataList[this.multiIndex[0]].children.map((item,
						index) => {
						return item
					})
					if (this.oldpProvinceDataList[this.multiIndex[0]].children.length === 1) {
						this.newProvinceDataList[2] = this.oldpProvinceDataList[this.multiIndex[0]].children[0]
							.children
							.map((item, index) => {
								return item
							})
					} else {
						this.newProvinceDataList[2] = this.oldpProvinceDataList[this.multiIndex[0]].children[this
							.multiIndex[1]].children.map((item, index) => {
							return item
						})
					}
					this.multiIndex.splice(1, 1, 0)
					this.multiIndex.splice(2, 1, 0)
				}
				// 第二列滑动
				if (e.detail.column === 1) {
					this.multiIndex[1] = e.detail.value
					this.newProvinceDataList[2] = this.oldpProvinceDataList[this.multiIndex[0]].children[this
						.multiIndex[
							1]].children.map((item, index) => {
						return item
					})
					this.multiIndex.splice(2, 1, 0)
				}
				// 第三列滑动
				if (e.detail.column === 2) {
					this.multiIndex[2] = e.detail.value
				}
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
	.chat-box {
		width: 70px;
		padding: 10px 0;
	}

	.chat-box-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		width: 60px;
		background: #fff;
		color: #999;
		border: 0px solid #999;
	}

	.shop-buy-btn {
		display: flex;
		flex-direction: row;
		padding: 10px 20px;
		font-size: 18px;
		align-items: center;
		justify-content: center;
		border-radius: 25px;
		color: #fff;
		min-width: 180px;
		position: relative;
		background: linear-gradient(90deg, #1f4e5f 0%, #c9d6de 50%, #1f4e5f 100%);
		background-size: 400% 100%;
		animation: color_move 5s infinite ease-in-out alternate;
		cursor: pointer;
	}

/* 	.show-editor img {
		max-width:100%;
		height:auto;
		display:inline-block;
		margin:10rpx auto;
	}
	
	.show-editor image {
		max-width:100%;
		height:auto;
		display:inline-block;
		margin:10rpx auto;
	} */

	.txt {
		font-size: 18px;
		color: #fff;
		font-weight: bold;
	}

	.arrow {
		width: 20px;
		text-align: center;
		position: absolute;
		font-size: 18px;
		color: #fff;
		top: 50%;
		transform: translateY(-50%);
		left: 130px;
		/* 移动130~150px */
		/* 调用动画 */
		animation-name: arrow_move;
		/* 持续时间 */
		animation-duration: 1s;
		/* 无限播放 */
		animation-iteration-count: infinite;
	}

	.pickerListb {
		color: #555;
		border-bottom: 1px solid #bcbcbc;
	}

	button::after {
		border: none;
	}

	@keyframes arrow_move {

		/* 开始状态 */
		0% {
			left: 130px;
		}

		/* 结束状态 */
		100% {
			left: 140px;
		}
	}

	@keyframes color_move {

		/* 开始状态 */
		0% {
			background-position: 0% 0%;
			/* 水平位置 垂直位置 */
		}

		50% {
			background-position: 50% 0%;
		}

		/* 结束状态 */
		100% {
			background-position: 100% 0%;
		}
	}
	.d-bottom{
		height: 30rpx;
	}
</style>
