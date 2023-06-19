<template>
	<view class="my-container page-box"  style="display: none;">
		<view class="backhome" @click="gohome">
			<u-icon name="home" color="#fff" size="28"></u-icon>
			<text class="u-m-l-5">回到首页</text>
		</view>
		<!-- 用户未登录 -->
		<block v-if="!openid && userId == 0">
			<image class="avatar avatar-img" src="/static/images/default-avatar.png" mode="scaleToFill" />
			<view class="login-desc">{{loginDesc}}</view>
			<view class="login-desc" v-if="t != ''">
				{{t}}
			</view>
			<button class="login-btn" type="primary" @click="bindGetUserInfo">
				微信用户登录
			</button>
			<view class="u-m-t-30">
				<u-checkbox-group>
					<u-checkbox activeColor="#FEC846" v-model="checked" labelColor="#171717">勾选并同意宽带易<text
							class="color-blue" @click="goPage('userment')">用户协议</text>和<text class="color-blue"
							@click="goPage('agreement')">隐私政策</text>
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</block>
		<w-loading text="..." mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginDesc: '登录后享受平台服务',
				registerDesc: '为了更好服务，请继续绑定手机号',
				nickName: null, //昵称
				avatarUrl: null, //头像
				isCanUse: this.$util.getKey('isCanUse') || true, //默认为true
				userInfo: {},
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
				canIGetUserProfile: false,
				detail: {},
				openid: null,
				userId: 0,
				gender: null,
				session_key: null,
				unionid: null,
				t: '',
				checked: false
			}
		},
		onLoad(options) {
			var _this = this;
			this.loginDesc = '登录后享受' + this.$baseTit + '服务'
			this.login()
			//console.log(uni.getUserProfile);
			if (uni.getUserProfile) {
				this.canIGetUserProfile = true;
			}
			if (this.$util.getKey('token')) {
				uni.reLaunch({
					url: '/pages/member/member'
				})
			}
			if (this.$util.getKey('t') && this.$util.getKey('t') !== 'undefined') {
				this.t = this.$util.getKey('t')
			}
			// console.log('邀请码：', this.t)
		},
		methods: {
			goPage(p) {
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
			getchecked() {
				this.checked != this.checked
			},
			//第一次授权
			bindGetUserInfo(e) {
				if (this.checked == false) {
					uni.showToast({
						title: '请勾选并同意方可继续',
						icon: "none"
					});
					return
				}
				var _this = this;
				if (this.canIGetUserProfile) {
					//新版登录方式
					uni.getUserProfile({
						desc: '登录',
						success: (res) => {
							// console.log(res)
							_this.userInfo = res.userInfo;
							try {
								_this.login();
							} catch (e) {}
						},
						fail: (res) => {
							uni.showToast({
								title: '用户拒绝了授权，登录失败',
								icon: "none"
							});
							console.log('用户拒绝了授权');
						}
					});
				} else {
					if (e.detail.userInfo) {
						_this.detail = e.detail
						_this.userInfo = e.detail.userInfo;
						try {
							_this.login();
						} catch (e) {}
					} else {
						uni.showToast({
							title: '用户拒绝了授权，登录失败',
							icon: "none"
						});
						console.log('用户拒绝了授权');
						//用户按了拒绝按钮
					}
				}
			},
			//登录
			login() {
				let _this = this
				let userincode = this.t
				uni.login({
					provider: 'weixin',
					success: (res) => {
						//这里获取的是用户的code，用来换取 openid、unionid、session_key 等信息，再将信息丢给后台自己的登录业务就行了
						console.log('coderes', res)
						uni.request({
							url: _this.$baseUrl + '/front/member/wxUserInfo', //仅为示例，并非真实接口地址。
							method: 'POST',
							data: {
								code: res.code,
								userLeader: userincode
							},
							header: {
								'content-type': 'application/json'
							},
							success: (res) => {
								_this.$refs.loading.close()
								let result = res.data
								console.log('result',result)
								if (result.code == 0) {
									_this.detail = res.data.data;
									_this.openid = _this.detail.openid

									if (_this.detail.userId > 0) {
										_this.updataUserTwo()
									} else {
										_this.updataUserOne()
									}
								} else {
									uni.showToast({
										title: '授权登录失败！',
										duration: 2000
									});
								}

							},
							fail: (err) => {
								// console.log('失败', err)
								uni.showToast({
									title: '授权登录失败！',
									duration: 2000
								});
							}
						});
					}

				})
			},
			// login() {
			// 	// console.log(this)
			// 	let _this = this;
			// 	let userincode = this.t
			// 	// 获取登录用户code
			// 	uni.getProvider({
			// 		service: 'oauth',
			// 		success: function(res) {
			// 			_this.$refs.loading.open()
			// 			if (~res.provider.indexOf('weixin')) {
			// 				uni.login({
			// 					provider: 'weixin',
			// 					success: function(res) {
			// 						// console.log(res);
			// 						if (res.code) {
			// 							let code = res.code;
			// 							uni.request({
			// 								url: _this.$baseUrl +
			// 									'/front/member/wxUserInfo',
			// 								data: {
			// 									code: code,
			// 									userLeader: userincode
			// 								},
			// 								method: 'POST',
			// 								header: {
			// 									'content-type': 'application/json'
			// 								},
			// 								success: (res2) => {
			// 									_this.$refs.loading.close()
			// 									let result = res2.data
			// 									// console.log(result)
			// 									if (result.code == 0) {
			// 										_this.detail = res2.data.data;
			// 										_this.openid = _this.detail.openid

			// 										if (_this.detail.userId > 0) {
			// 											_this.updataUserTwo()
			// 										}else{
			// 											_this.updataUserOne()
			// 										}
			// 									} else {
			// 										uni.showToast({
			// 											title: '授权登录失败！',
			// 											duration: 2000
			// 										});
			// 									}
			// 								}
			// 							});
			// 							//将用户登录code传递到后台置换用户SessionKey、OpenId等信息
			// 							//...写用code置换SessionKey、OpenId的接口
			// 							//置换成功调用登录方法_this.updateUserInfo();
			// 						} else {
			// 							uni.hideLoading();
			// 							uni.showToast({
			// 								title: '登录失败！',
			// 								duration: 2000
			// 							});
			// 						}
			// 					},
			// 				});
			// 			} else {
			// 				uni.showToast({
			// 					title: '请先安装微信或升级版本',
			// 					icon: "none"
			// 				});
			// 			}
			// 		}
			// 		// 
			// 	});
			// },
			//向后台更新信息
			updateUserInfo() {
				let _this = this;

				// console.log(_this);
				uni.request({
					url: this.$baseUrl + '/front/member/updateUserInfos', //服务器端地址
					data: {
						openId: _this.detail.openid,
						nickName: _this.userInfo.nickName,
						phonenumber: _this.userInfo.mobile,
						avatar: _this.userInfo.avatarUrl,
						sex: _this.userInfo.gender,
						sessionKey: _this.detail.session_key,
						unionId: _this.detail.unionid
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							_this.checkLogin()
						}
					}
				});
			},
			checkLoginOpenid() {
				let _this = this;
				uni.request({
					url: this.$baseUrl + '/front/member/checkOpenid', //服务器端地址
					data: {
						openId: _this.detail.openid,
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code !== 0) {
							_this.updataUserOne()
						} else {
							_this.updataUserTwo()
						}
					}
				});
			},
			updataUserOne() {
				let _this = this;
				uni.request({
					url: this.$baseUrl + '/front/member/updateUserInfos', //服务器端地址
					data: {
						openId: _this.detail.openid,
						nickName: _this.userInfo.nickName,
						phonenumber: _this.userInfo.mobile,
						avatar: _this.userInfo.avatarUrl,
						sex: _this.userInfo.gender,
						sessionKey: _this.detail.session_key,
						unionId: _this.detail.unionid
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							_this.checkLogin()
						}
					}
				});
			},
			updataUserTwo() {
				let _this = this;
				uni.request({
					url: this.$baseUrl + '/front/member/updateUserInfos', //服务器端地址
					data: {
						openId: _this.detail.openid,
						sessionKey: _this.detail.session_key,
						unionId: _this.detail.unionid
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							_this.checkLogin()
						}
					}
				});
			},
			//判斷登陸情況
			checkLogin() {
				let _this = this;
				// console.log(_this);
				uni.request({
					url: this.$baseUrl + '/front/login', //服务器端地址
					data: {
						openId: _this.detail.openid,
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							let token = res.data.data.token
							_this.$util.setKey('token', token)
							uni.showToast({
								icon: 'none',
								title: '登陆成功',
								mask: true
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/member/member'
								})
							}, 500)
						} else {
							uni.showToast({
								icon: 'none',
								title: result.msg,
								mask: true
							});
						}
					}
				});
			},
			//向后台更新信息
			updateUserInfokey() {
				let _this = this;
				uni.request({
					url: this.$baseUrl + '/front/member/updateUserInfo', //服务器端地址
					data: {
						userId: _this.userId,
						nickName: _this.userInfo.nickName,
						sessionKey: _this.detail.session_key,
						avatar: _this.userInfo.avatarUrl,
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							_this.checkLogin()
						}
					}
				});
			},
			wxGetPhone(e) {
				// console.log("phone", e);
				if (!e.detail.code) {
					uni.showToast({
						title: '获取手机号失败',
						icon: 'none'
					})
					return;
				}
				this.decryptPhone(e.detail);
			},
			//解密手机
			decryptPhone(obj) {
				// console.log(obj)
				var _this = this;
				_this.$refs.loading.open()
				uni.request({
					url: this.$baseUrl + '/front/member/mobileUserInfo',
					method: 'POST',
					data: {
						code: obj.code,
						encryptedData: obj.encryptedData,
						iv: obj.iv,
						session_key: _this.detail.session_key
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
							if (_this.userInfo.mobile) {
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
			gohome() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.my-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 25%;

		.avatar-img {
			width: 78px;
			height: 78px;
		}

		.login-desc {
			color: #999;
			font-size: 14px;
			margin-top: 16px;
		}

		.login-btn {
			margin-top: 16px;
			width: 85%;
		}

		.backhome {
			width: 110px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			background: #0091ff;
			border-radius: 30px;
			color: #fff;
			margin-bottom: 80px;
		}
	}
</style>
