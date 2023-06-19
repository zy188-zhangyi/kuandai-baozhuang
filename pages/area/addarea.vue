<template>
	<view class="u-wrap page-box u-p-t-10 u-p-l-30 u-p-r-30">
		<view class="u-flex box-map">
			<view class="u-icon u-m-r-20">
				待确定
			</view>
			<view class="u-flex-1">
				<text class="color-gray">{{regionData}}</text>
				<text class="color-red u-m-l-5">{{areaData}}</text>
			</view>
		</view>
		<view class="box-map color-d">
			<p>1.未找到您的附近社区，请添加您的社区名称。</p>
			<p>2.请选择相应区域后，填写您的社区名称。</p>
			<p>3.为了精准进行宽带报装业务，请务必保证您的社区定位准确。</p>
		</view>
		<u-form :model="form" ref="uForm">
			<view class="u-flex box-map">
				<view class="u-icon u-m-r-20">
					所属区域
				</view>
				<view class="u-flex-1">
					<picker class="pickerList" mode="multiSelector" :range="newProvinceDataList" range-key="label"
						:value="multiIndex" @change="pickerChange" @columnchange="pickerColumnchange">
						<view class="select-city u-flex">
							<view class="input u-flex-1" v-model="form.area" v-if="select !== ''">{{select}}</view>
							<view v-else v-model="form.area" class="placeholder-input u-flex-1">请重新选择区域</view>
							<u-icon name="arrow-down"></u-icon>
						</view>
					</picker>
				</view>
				<view class="u-icon u-m-l-30">
					<u-icon name="search" color="#555" size="28"></u-icon>
					<text class="color-red u-m-l-15" @click="selFindArea">社区列表</text>
				</view>
			</view>
			<view v-show="commit" class="u-flex box-map">
				<view class="u-icon u-m-r-20">
					社区名称
				</view>
				<view class="u-flex-1">
					<input class="pickerListb" v-model="form.areaData" @input="inputChange" maxlength="24" />
				</view>
			</view>
			<view v-show="commit" class="">
				<u-button type="primary" @click="subCom">提交社区</u-button>
			</view>
		</u-form>
		<u-popup v-model="showList" mode="right" :closeable="false" :mask-close-able="false"
			:safe-area-inset-bottom="true" width="100%">
			<view class="u-p-20 u-p-t-30 pop-box">
				<view class="u-flex u-m-10">
					<view class="u-flex-1">
						<p class="color-d u-font-sm">如果有您的社区，点击选择即可；没有时请选择对应区域并填写您的社区名称进行提交</p>
					</view>
					<view class="nobtn" @click="noMyArea">没有?</view>
				</view>
				<view class="all-box">
					{{regionDatas}}安装社区列表
				</view>
				<view class="all-box u-p-20">
					<view class="list-box u-flex u-m-b-30" v-for="(item,index) in listInfo" :key="index"
						@click="selectArea(item.id,item.areaData)">
						<view class="u-flex-1">
							{{item.areaData}}
						</view>
						<view v-show="item.id == areaId">
							<u-icon name="checkmark-circle" color="#ff9900" size="28"></u-icon>
							<text class="u-m-l-15">已选</text>
						</view>
						<view v-show="item.id != areaId" class="color-d">
							<u-icon name="map" color="#ff6600" size="28"></u-icon>
							<text class="u-m-l-15">选择</text>
						</view>
					</view>
					<view class="">
						<uni-pagination :show-icon="true" :pageSize="limit" :total="total" @change="pagefindArea" />
					</view>
				</view>
			</view>
		</u-popup>
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
	import {
		regionData,
		CodeToText,
		TextToCode
	} from 'element-china-area-data'
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	export default {
		data() {
			return {
				areaId: 0,
				regionData: '请选择您的',
				regionDatas: '',
				areaData: '所属社区',
				siteUrl: '',
				regionCode: '440000,440300,440307',
				oldpProvinceDataList: regionData,
				newProvinceDataList: [
					[],
					[],
					[]
				],
				form: {},
				commit: true,
				multiIndex: [0, 0, 0],
				select: '',
				showList: false,
				keywords: '',
				config: {
					delIcon: 'del', //删除图片icon
					resultTip: true, //结果提示
					resultType: '1', //结果展示类型
					loadIcon: 'load', //加载时的图标
					loadText: '加载中' //加载时的文字
				},
				page: 1,
				limit: 15,
				total: 0,
				listInfo: []
			}
		},
		onLoad() {
			this.areaId = this.$util.getKey('areaId') || 0
			this.getLocation()
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
			this.select = CodeToText[areaarr[0]] + ' ' + CodeToText[areaarr[1]] + ' ' + CodeToText[areaarr[2]];
		},
		methods: {
			getLocation() {
				let that = this
				let location = {
					longitude: 0,
					latitude: 0,
					province: "",
					city: "",
					area: "",
					street: "",
					address: "",
				};
				uni.getLocation({
					geocode: true,
					altitude: true, // 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
					isHighAccuracy: true, // 开启高精度定位
					accuracy: 'best', //best OR high
					highAccuracyExpireTime: 3000,
					type: 'wgs84', //wgs84: 返回GPS坐标，gcj02: 返回国测局坐标
					// success: function(res) {
					// 	uni.request({
					// 		url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude +
					// 			',' + res.longitude + '&key=WMZBZ-TA2RD-VKQ4W-PDWH4-U6S27-B5FVV',
					// 		success: (address) => {
					// 			console.log(address)
					// 		}
					// 	})
					// },
			
					success: function(res) {
						// console.log(res);
						location.longitude = res.longitude;
						location.latitude = res.latitude;
						const qqmapsdk = new QQMapWX({
							key: that.$baseWxMapKey
						});
						qqmapsdk.reverseGeocoder({
							location,
							success(response) {
								// console.log(response)
								let info = response.result;
								location.province = info.address_component.province;
								location.city = info.address_component.city;
								location.area = info.address_component.district;
								location.street = info.address_component.street;
								location.address = info.address;
								// console.log(location);
								that.regionData = location.province + location.city + location.area
								if (location.area) {
									that.fnFind(location)
								}
							},
						});
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '位置授权失败，会影响使用小程序',
							mask: true
						});
					}
				});
			},
			fnFind(location) {
				let _this = this
				uni.request({
					url: this.$baseUrl + '/front/area/shopAreaByall',
					data: location,
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						// console.log(result)
						if (result.code == 0) {
							if (result.data) {
								_this.$util.setKey('areaId', result.data.id)
								_this.$util.setKey('areaData', result.data.areaData)
								_this.areaData = result.data.areaData
								_this.areaId = result.data.id
								// console.log(this.areaData)
							}
						}
					}
				});
			},
			inputChange(e) {
				const o = e.target;
				o.value = o.value.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
				this.$nextTick(function() {
					this.form.areaData = o.value;
				})
			},
			findArea(areaId) {
				uni.request({
					url: this.$baseUrl + '/front/area/shopAreaOne', //仅为示例，并非真实接口地址。
					data: {
						id: areaId
					},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						if (result.code == 0) {
							let o = result.data.regionData
							let re = o.replace(/\/*/g, '')
							this.regionData = re
							this.regionDatas = re
							this.areaData = result.data.areaData
							this.regionCode = result.data.regionCode
							if (this.regionCode != '') {
								let areaarr = this.regionCode.split(',')
								let arr = o.split('/')
								let oo = arr[arr.length - 1]
								this.getRegionIndex(areaarr).then(res => {
									this.newProvinceDataList = [
										[],
										[],
										[]
									];
									this.init(this.multiIndex);
								})
								this.select = CodeToText[areaarr[0]] + ' ' + CodeToText[areaarr[1]] +
									' ' +
									CodeToText[areaarr[2]];
								if (oo) {
									this.keywords = oo
									this.findAreaList()
								}
							}
						}
					}
				})
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
			pagefindArea(e) {
				this.page = e.current
				this.findAreaList()
			},
			findAreaList() {
				// console.log(o)
				let listdata = {
					page: this.page,
					limit: this.limit,
					area: this.keywords
				}
				uni.request({
					url: this.$baseUrl + '/front/area/shopAreaList', //仅为示例，并非真实接口地址。
					data: listdata,
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						// console.log(res)
						let result = res.data
						if (result.code == 0) {
							this.showList = true
							this.total = result.data.total
							let list = result.data.list
							this.listInfo = list
						} else {
							this.showList = false
						}
					}
				})
			},
			selectArea(id, areaData) {
				this.$util.setKey('areaId', id)
				this.$util.setKey('areaData', areaData)
				const token = this.$util.getKey('token') || ''
				if (token) {
					uni.request({
						url: this.$baseUrl + '/front/users/shopAreaSet', //仅为示例，并非真实接口地址。
						data: {
							areaId: id
						},
						header: {
							'Authorization': 'Bearer ' + token,
							'content-type': 'application/json'
						},
						method: 'POST',
						success: (res) => {
							// console.log(res)
						}
					})
				}
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			noMyArea() {
				this.showList = false
				this.commit = true
			},
			async subCom() {
				var that = this
				let sel = this.form.regionData
				if (!this.form.areaData) {
					uni.showToast({
						title: '您确定填写了？',
						icon: 'none'
					})
					return
				}
				let darea = sel.replace(/\/*/g, '') + this.form.areaData
				const qqmapsdk = new QQMapWX({
					key: that.$baseWxMapKey
				});
				qqmapsdk.geocoder({
					address: darea,
					success(response) {
						// console.log(response)
						let info = response.result;
						let title = info.title
						let lng = info.location.lng
						let lat = info.location.lat
						uni.request({
							url: that.$baseUrl + '/front/area/shopAreaCheck', //仅为示例，并非真实接口地址。
							data: {
								areaData: title,
								regionCode: that.form.regionCode,
								regionData: that.form.regionData
							},
							header: {
								'Authorization': 'Bearer ' + that.$util.getKey('token') || '',
								'content-type': 'application/json'
							},
							method: 'POST',
							success: (res) => {
								// console.log(res)
								let result = res.data
								if (result.code == 0) {
									uni.showToast({
										title: '此社区已存在，请去列表选择即可',
										icon: 'none'
									})
								} else {
									let datas = {
										areaData: that.form.areaData,
										regionCode: that.form.regionCode,
										regionData: that.form.regionData,
										lat: lat,
										lng: lng,
										status: 1,
										provinceCode: that.form.provinceCode,
										cityCode: that.form.cityCode,
										districtCode: that.form.districtCode,
									}
									uni.request({
										url: that.$baseUrl +
											'/front/area/shopAreaAdd', //仅为示例，并非真实接口地址。
										data: datas,
										header: {
											'Authorization': 'Bearer ' + that.$util.getKey(
												'token') || '',
											'content-type': 'application/json'
										},
										method: 'POST',
										success: (res) => {
											let result = res.data
											if (result.code == 0) {
												let id = result.data
												that.$util.setKey('areaId', id)
												that.$util.setKey('areaData', that.form.areaData)
												uni.showToast({
													icon: 'none',
													title: '操作成功'
												});
												setTimeout(() => {
													uni.reLaunch({
														url: '/pages/index/index'
													})
												}, 600)
											} else {
												uni.showToast({
													title: '操作失败',
													icon: 'none'
												})
											}
										},
									})
									// that.addArea(datas)
								}
							}
						})
					},
					fail: function(error) {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						})
						console.error(error);
					}
				});
			},

			addArea(data) {
				uni.request({
					url: that.$baseUrl + '/front/area/shopAreaAdd', //仅为示例，并非真实接口地址。
					data: data,
					header: {
						'Authorization': 'Bearer ' + that.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						// console.log(res)
						let result = res.data
						if (result.code == 0) {
							console.log('success')
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							})
						}
					}
				})
			},
			selFindArea() {
				this.showList = true
				let sel = this.form.regionData
				let arr = sel.split('/')
				let oo = arr[arr.length - 1]
				let re = sel.replace(/\/*/g, '')
				this.regionDatas = re
				this.keywords = oo
				this.findAreaList()
			},
			comChat(){
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){}
		}
	}
</script>

<style lang="scss">
	.box-map {
		font-size: 28rpx;
		background: #fff;
		margin: 20px auto;
		padding: 10px;
		border-radius: 5px;
	}

	.pickerList {
		color: #555;
	}

	.pickerListb {
		color: #555;
		border-bottom: 1px solid #bcbcbc;
	}

	.nobtn {
		margin: 10px;
		background: #ff9900;
		border-radius: 4px;
		padding: 4px 8px;
		color: #fff;
	}

	.list-box {
		margin-bottom: 10px;
	}
</style>
