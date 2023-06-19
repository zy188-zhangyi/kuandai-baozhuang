<template>
	<view class="u-wrap page-box u-p-l-30 u-p-r-30">
		<view class="u-text-center u-p-t-70 u-text-center-manager">
			<view class="box-rel">
				<image class="avatar avatar-img" :src="userInfo.avatar" mode="scaleToFill" />
				<button open-type="chooseAvatar" @chooseavatar="bindchooseavatar" class="fix-avatar">更换头像</button>
			</view>
			<view v-if="userInfo.userMap > 0" class="box-manager">
				<view class="color-b u-font-sm">
					管家
				</view>
			</view>
		</view>
		
		<view class="u-text-center">
			<view v-if="!UserNicknameInput" class="login-desc" @click="showUserNicknameInput"><text
					class="u-m-r-10">{{userInfo.userNickname}}</text>
				<u-icon name="edit-pen" size="30" color="#00b300"></u-icon>
			</view>
			<view v-if="UserNicknameInput" class="login-desc">
				<input v-model="userInfo.userNickname" :focus="firstFocus" @blur="senduserNickname"
					class="inputNickname"></input>
			</view>
		</view>

		<view v-if="openAll == 0" class="user-box u-flex color-white">
			<view class="u-flex-1 u-text-center" @click="goPage('invite')">
				<view class="user-box-icon color-a">
					<i class="iconfont icon-siyouwangluo"></i>
				</view>
				<view class="">
					邀请人数
				</view>
				<view class="color-yellow u-font-md">
					{{inviteAll}}
				</view>
			</view>
			<view class="u-flex-1 u-text-center" @click="goPage('order')">
				<view class="user-box-icon color-a">
					<i class="iconfont icon-wangluo-19"></i>
				</view>
				<view class="">
					我的报装
				</view>
				<view class="color-yellow u-font-md">
					{{orderAll}}
				</view>
			</view>
			<!-- <view class="u-flex-1 u-text-center" @click="goPage('income')">
				<view class="user-box-icon color-f">
					<i class="iconfont icon-jinbitixian"></i>
				</view>
				<view class="">
					返现总额
				</view>
				<view class="color-yellow u-font-md">
					{{payAll}}
				</view>
			</view> -->
		</view>
		<view class="user-list">
			<view v-if="userIn > 0" class="item-list u-flex color-gray">
				<view class="item-icon u-m-r-15 color-f">
					<i class="iconfont icon-shoujitianchong"></i>
				</view>
				<view class="u-flex-1">
					联系手机：{{userInfo.mobile}}
				</view>
				<view v-if="!userInfo.mobile" class="item-right">
					<u-button size="mini" type="warning" :plain="true" :ripple="true" open-type="getPhoneNumber"
						@getphonenumber="wxGetPhone">一键获取</u-button>
				</view>
			</view>
			<view v-if="userIn > 0" class="item-list u-flex color-gray">
				<view class="item-icon u-m-r-15 color-f">
					<i class="iconfont icon-shuzi"></i>
				</view>
				<view class="u-flex-1">
					专属邀请码：{{userInfo.userInviteCode}}
				</view>
			</view>
		</view>

		<view class="user-list">
			<!-- <view class="item-list u-flex color-gray" @click="jiaoCheng">
				<view class="item-icon u-m-r-15 color-b">
					<i class="iconfont icon-wangluo-21"></i>
				</view>
				<view class="u-flex-1">
					推广赚钱攻略
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view> -->
			<view class="item-list u-flex color-gray" @click="myQrpic">
				<view class="item-icon u-m-r-15 color-b">
					<i class="iconfont icon-erweima1"></i>
				</view>
				<view class="u-flex-1">
					我的邀请二维码
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view v-if="openAll == 0" class="item-list share-box">
				<view class="u-flex color-gray">
					<view class="item-icon u-m-r-15 color-b">
						<i class="iconfont icon-fenxiang"></i>
					</view>
					<view class="u-flex-1">
						一键邀请分享
					</view>
					<view class="item-right">
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>
				<u-button class="shareBtn" open-type="share"></u-button>
			</view>
		</view>
		<view class="user-list">
			<view class="item-list u-flex color-gray" @click="goPage('invite')">
				<view class="item-icon u-m-r-15 color-e">
					<i class="iconfont icon-wangluo-19"></i>
				</view>
				<view class="u-flex-1">
					邀请记录
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view v-if="openAll == 0" class="item-list u-flex color-gray" @click="goPage('order')">
				<view class="item-icon u-m-r-15 color-e">
					<i class="iconfont icon-wangluo-11"></i>
				</view>
				<view class="u-flex-1">
					{{myOrderList}}
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view v-if="openAll == 0" class="item-list u-flex color-gray" @click="goPage('inorder')">
				<view class="item-icon u-m-r-15 color-e">
					<i class="iconfont icon-kuandai4"></i>
				</view>
				<view class="u-flex-1">
					{{myOrderOk}}
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view class="user-list">
			<view class="item-list u-flex color-gray" @click="goPage('agreement')">
				<view class="item-icon u-m-r-15 color-red">
					<i class="iconfont icon-wangluo-17"></i>
				</view>
				<view class="u-flex-1">
					隐私政策
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view class="item-list u-flex color-gray" @click="goPage('userment')">
				<view class="item-icon u-m-r-15 color-red">
					<i class="iconfont icon-wangluo-18"></i>
				</view>
				<view class="u-flex-1">
					用户协议
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
		</view>
		<!-- <view class="user-list">
			<view class="item-list u-flex color-gray" @click="logout">
				<view class="item-icon u-m-r-15 color-red">
					<i class="iconfont icon-icon"></i>
				</view>
				<view class="u-flex-1">
					安全退出
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
		</view> -->
		<view class="u-text-center color-light" v-show="sysInfo">
			{{authouName}}:{{sysInfo.appVersion}}
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
		<u-popup mode="bottom" v-model="onShowQr" closeable>
			<view class="qr-box">
				<image :src="QRImg"></image>
				<button class="save-btn" type="primary" @click="saveAlbum">
					保存图片
				</button>
				<!-- <button class="save-btn" type="default" @click="scan">扫描</button> -->
			</view>
		</u-popup>
		<w-loading text="..." mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				siteUrl: '',
				userIn: 0,
				userInfo: {},
				inviteAll: 0,
				orderAll: 0,
				payAll: 0,
				areaData: '',
				downUrl: '',
				QRImg: null, //动态二维码变量
				onShowQr: false, // 用来控制canvas遮罩层的显示与隐藏
				sysInfo: {},
				authouName: '宽带报装',
				detail: {},
				pdata: {},
				UserNicknameInput: false,
				firstFocus: false,
				myOrderList:'',
				myOrderOk:'',
				openAll: 1
			}
		},
		onLoad() { //默认加载
			let that = this
			this.areaData = this.$util.getKey('areaData')
			const token = this.$util.getKey('token');
			if (!token) {
				uni.navigateTo({
					url: '/pages/member/index'
				})
			}
			this.siteUrl = this.$baseUrl + '/'
			uni.getSystemInfo({
				success: function(res) {
					// console.log(res)
					that.sysInfo = res
				}
			});
			this.authouName = this.$baseTit
		},
		onShow() {
			if (this.$util.isLogin()) {
				let checkUserUrl = this.$baseUrl + '/front/users/memberInfo'
				// this.$util.checkUser(checkUserUrl)
				this.$nextTick(function() {
					this.findUserInfo()
				})
			} else {
				uni.navigateTo({
					url: '/pages/member/index'
				})
			}
		},

		methods: {
			jiaoCheng() {
				uni.navigateTo({
					url: 'video'
				})
			},
			scan() {
				uni.scanCode({
					success: (res) => {
						console.log(res);
						let qrUrl = res.path;
						const sceneObj = this.$util.urlParams(res)
						var t = sceneObj.t /* 邀请码 */
						if (t) {
							// console.log('t:', t)
						}
					}
				})
			},
			findUserInfo() {
				let _this = this
				const areaId = this.$util.getKey('areaId');
				uni.request({
					url: this.$baseUrl + '/front/users/memberInfo',
					data: {
						areaId: areaId || ''
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
							this.userIn = 1
							this.userInfo = result.data.user
							this.myOrderOk = result.data.mlang.myOrderOk
							this.myOrderList = result.data.mlang.myOrderList
							this.openAll = result.data.openAll
							// console.log('userInfo',result.data)
							if (this.userInfo.avatar) {
								this.userInfo.avatar = this.$util.GetUpFileUrl(this.$baseUrl, this.userInfo
									.avatar)
							}else{
								this.userInfo.avatar = '/static/images/default-avatar.png'
							}
							this.downUrl = this.userInfo.userInviteCode
							this.$util.setKey('userMobile', this.userInfo.mobile)
							this.$util.setKey('uid', this.userInfo.id)
							this.inviteAll = result.data.inviteAll
							this.orderAll = result.data.orderAll
							this.payAll = result.data.payAll
							if (areaId) {
								_this.findArea(areaId)
							}
						} else {
							this.$util.clearKey()
							uni.navigateTo({
								url: '/pages/member/index'
							})
						}
					}
				});
			},
			logout() {
				uni.request({
					url: this.$baseUrl + '/front/logout', //仅为示例，并非真实接口地址。
					data: {},
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'GET',
					success: (res) => {
						this.$util.delKey('token')
						this.$util.setKey('areaId', 0)
						uni.showToast({
							icon: 'none',
							title: '退出成功',
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/member/index'
							})
						}, 1500)
					}
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
							this.areaData = result.data.areaData
						}
					}
				})
			},
			onShareAppMessage(res) {
				return {
					title: '宽带报装(一键报装，全程无忧)',
					path: '/pages/index/index?t=' + this.userInfo.userInviteCode,
					imageUrl: '/static/invite.png', // 全局分享的图片(可本地可网络)
					desc: '向您推荐一款足不出户，在线宽带直装助手。', // 自定义分享描述
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
			onShareTimeline(res) {
				return {
					title: '宽带报装(一键报装，全程无忧)',
					path: '/pages/index/index',
					query: 't=' + this.userInfo.userInviteCode,
					imageUrl: '/static/invite.png', // 全局分享的图片(可本地可网络)
					desc: '向您推荐一款足不出户，在线宽带直装助手。', // 自定义分享描述
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
			showSetarea() {
				if (this.areaData) {
					uni.navigateTo({
						url: '/pages/area/area'
					})
				} else {
					uni.navigateTo({
						url: '/pages/area/addarea'
					})
				}

			},
			goPage(p) {
				// console.log(p)
				if (p == 'order') {
					uni.navigateTo({
						url: '/pages/member/order'
					})
				}
				if (p == 'inorder') {
					uni.navigateTo({
						url: '/pages/member/inorder'
					})
				}
				if (p == 'invite') {
					uni.navigateTo({
						url: '/pages/member/invite'
					})
				}
				if (p == 'score') {
					uni.navigateTo({
						url: '/pages/member/score'
					})
				}
				if (p == 'income') {
					uni.navigateTo({
						url: '/pages/member/income'
					})
				}
				if (p == 'agreement') {
					uni.navigateTo({
						url: '/pages/index/agreement'
					})
				}
				if (p == 'userment') {
					uni.navigateTo({
						url: '/pages/index/userment'
					})
				}
			},
			myQrpic() {
				this.onGetQRCode()
			},
			async onGetQRCode() {
				this.$refs.loading.open()
				uni.request({
					url: this.$baseUrl + '/front/users/getWxMa',
					// responseType: 'arraybuffer',
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						// console.log('myQrpicRes',result)
						let base = result.data.base
						const base64 = "data:image/png;base64," + base
						this.QRImg = base64 || ''
						// console.log(this.QRImg)
						if (this.QRImg) {
							this.$refs.loading.close()
							this.onShowQr = true
						}
					}
				});
			},
			saveAlbum() {
				uni.getSetting({ //获取用户的当前设置
					success: (res) => {
						if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
							this.saveImageToPhotosAlbum();
						} else {
							uni.authorize({ //如果没有授权，向用户发起请求
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.saveImageToPhotosAlbum();
								},
								fail: () => {
									uni.showToast({
										title: "请打开保存相册权限，再点击保存相册分享",
										icon: "none",
										duration: 3000
									});
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {
												// console.log(res2.authSetting)
											}
										});
									}, 3000);
								}
							})
						}
					}
				})

			},
			saveImageToPhotosAlbum() {
				let base64 = this.QRImg.replace(/^data:image\/\w+;base64,/, ""); //去掉data:image/png;base64,
				let filePath = wx.env.USER_DATA_PATH + '/zhihui_qrcode.png';
				uni.getFileSystemManager().writeFile({
					filePath: filePath, //创建一个临时文件名
					data: base64, //写入的文本或二进制数据
					encoding: 'base64', //写入当前文件的字符编码
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: filePath,
							success: function(res2) {
								uni.showToast({
									title: '保存成功，请从相册选择再分享',
									icon: "none",
									duration: 5000
								})
							},
							fail: function(err) {
								// console.log(err.errMsg);
							}
						})
					},
					fail: err => {
						//console.log(err)
					}
				})
			},
			wxGetPhone(e) {
				this.$refs.loading.open()
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
							_this.$refs.loading.close()
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
					success: (res) => {}
				});
			},
			comChat() {
				// let chatUrl = this.$baseUrl + '/front/home/getChat'
				// this.$util.wxComChat(chatUrl)
			},
			sessionFrom(){},
			bindchooseavatar(e) {
				// console.log(e); // http://tmp/qC0p2up1KrW1ca6842e41fc84341a5c67028509d1cbb.jpeg
				// console.log(e.detail.avatarUrl)
				this.userInfo.avatar = e.detail.avatarUrl
				this.uploadimg(e.detail.avatarUrl)
			},
			uploadimg(fileurl) {
				var that = this;
				let a = uni.uploadFile({
					url: this.$baseUrl + '/front/users/upUserAvatar',
					header: {
						'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
					},
					filePath: fileurl,
					name: 'avatar',
					formData: {},
					success: (res) => {
						let result = JSON.parse(res.data) ? JSON.parse(res.data) : res.data
						// console.log(result)
						if (result.code == 0) {
							uni.showToast({
								title: '头像更新成功',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: '修改头像失败',
								icon: 'none'
							})
						}
					},
					fail: (res) => {
						uni.showToast({
							title: '修改头像失败了',
							icon: 'none'
						})
					}
				});
			},
			showUserNicknameInput() {
				this.UserNicknameInput = true
				this.firstFocus = false;
				setTimeout(() => {
					this.firstFocus = true; 
				}, 100)
			},
			senduserNickname() {
				let name = this.userInfo.userNickname
				if (name) {
					let _this = this;

					// console.log(_this);
					uni.request({
						url: this.$baseUrl + '/front/users/updateUserNickname', //服务器端地址
						data: {
							userNickname: name
						},
						method: 'POST',
						header: {
							'Authorization': 'Bearer ' + this.$util.getKey('token') || '',
							'content-type': 'application/json'
						},
						success: (res) => {
							if (res.data.code == 0) {
								this.UserNicknameInput = false
							}
						}
					});
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.qr-box {
		padding: 25rpx;
		text-align: center;

		image {
			width: 700rpx;
			height: 700rpx;
		}
	}

	.save-btn {
		margin: 20px 0;
	}

	.avatar-img {
		width: 78px;
		height: 78px;
		border-radius: 100%;
	}

	.login-desc {
		color: #999;
		font-size: 18px;
		margin-top: 16px;
	}

	.user-box {
		margin: 20px auto;
		padding: 10px;
		background: #79a8a9;
		border-radius: 5px;
		font-size: 28rpx;

		.user-box-icon {
			margin-bottom: 10px;
		}

		.user-box-icon i {
			font-size: 64rpx;
		}
	}

	.user-list {
		padding: 5px 10px;
		margin: 20px auto;
		background: #fff;
		border-radius: 5px;

		.item-list {
			margin: 20px auto;

			.item-icon i {
				font-size: 18px;
			}

			.item-right {
				color: #999;
			}
		}

	}

	.color-light {
		color: antiquewhite;
		font-size: 18rpx;
	}

	.share-box {
		position: relative;
		height: 20px;
	}

	.share {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		top: 0;
		left: 10;
		right: 10;

		.item-right {
			position: absolute;
			right: 6vw;
		}
	}

	.shareBtn {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 999;
		top: 0;
		left: 0;
		opacity: 0;
	}

	.box-rel {
		position: relative;
	}

	.fix-avatar {
		position: absolute;
		z-index: 9999;
		opacity: 0.6;
		left: 50%;
		bottom: 4px;
		color: #00b300;
		font-size: 12px;
		line-height: 1.6;
	}

	.inputNickname {
		color: #000;

	}
	
	.u-text-center-manager{
		position: relative;
		.box-manager{
			position: absolute;
			z-index: 9999;
			top: 100rpx;
			right: 220rpx;
		}
	}
	
	.icon-siyouwangluo,.icon-wangluo-19{
		color: #1f4e5f;
	}

</style>
