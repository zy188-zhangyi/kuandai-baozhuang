const PACKAGE_INFO_KEY = '__package_info__'
function check(url, param = {}) {
	// 合并默认参数
	param = Object.assign({
		title: "检测到有新版本！",
		content: "请升级app到最新版本！",
		canceltext: "暂不升级",
		oktext: "立即升级"
	}, param)

	var updateUrl = url + '/front/wicket/updateapp'; //定义升级

	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		let platform = plus.os.name.toLocaleLowerCase()
		uni.request({
			url: updateUrl,
			header: {
				'content-type': 'application/json'
			},
			data: {
				appid: 'daiwei'
			},
			method: 'POST',
			success: (res) => {
				let result = res.data
				if (result.code == 0) {
					// console.log(result)
					// console.log(widgetInfo.version)

					let data = result.data ? result.data : null;
					// console.log(data)
					// console.log(data.version)
					if (widgetInfo.version === data.version) {
						return;
					}
					if (platform == 'ios') {
						console.log('暂不理会ios');
						// 如果是ios,则跳转到appstore
						// plus.runtime.openURL(result.data.data.url)
						return;
					}
					// android进行如下操作
					let Durl = data.updateUrl[0]
					let downUrl = url + '/' + Durl.url
					let downTip = data.updateTips
					let dforceUpdate = false
					if (data.forceUpdate) {
						dforceUpdate = true
					}
					let dtitle = data.title
					let dtype = 'wgt'
					if (downUrl) {
						dtype = 'apk'
					}
					let fcontents = downTip.replace(/<br>/g,"\n")
					// console.log(downUrl)
					let datas = {
						title: dtitle, // 标题
						contents: fcontents, // 升级内容
						is_mandatory: dforceUpdate, // 是否强制更新
						url: downUrl, // 安装包下载地址
						platform: 'android', // 安装包平台
						type: dtype // 安装包类型
					}
					// updateUseModal(datas)
					uni.setStorageSync(PACKAGE_INFO_KEY, datas)
					uni.navigateTo({
						url: `/pages/upgrade/upgrade?local_storage_key=${PACKAGE_INFO_KEY}`,
						fail: (err) => {
							console.error('更新弹框跳转失败', err)
							uni.removeStorageSync(PACKAGE_INFO_KEY)
						}
					})
					return
				}
			}
		});
	});
}


/**
 * 使用 uni.showModal 升级
 */
function updateUseModal(packageInfo) {
	const {
		title, // 标题
		contents, // 升级内容
		is_mandatory, // 是否强制更新
		url, // 安装包下载地址
		platform, // 安装包平台
		type // 安装包类型
	} = packageInfo;

	let isWGT = type === 'wgt'
	let isiOS = !isWGT ? platform.includes('iOS') : false;
	let confirmText = isiOS ? '立即跳转更新' : '立即下载更新'

	return uni.showModal({
		title,
		content: contents,
		showCancel: !is_mandatory,
		confirmText,
		success: res => {
			if (res.cancel) return;

			// 安装包下载
			if (isiOS) {
				plus.runtime.openURL(url);
				return;
			}

			uni.showToast({
				title: '后台下载中……',
				duration: 1000
			});

			// wgt 和 安卓下载更新
			uni.downloadFile({
				url,
				success: res => {
					if (res.statusCode !== 200) {
						console.error('下载安装包失败', err);
						return;
					}
					// 下载好直接安装，下次启动生效
					plus.runtime.install(res.tempFilePath, {
						force: false
					}, () => {
						if (is_mandatory) {
							//更新完重启app
							plus.runtime.restart();
							return;
						}
						uni.showModal({
							title: '安装成功是否重启？',
							success: res => {
								if (res.confirm) {
									//更新完重启app
									plus.runtime.restart();
								}
							}
						});
					}, err => {
						uni.showModal({
							title: '更新失败',
							content: err
								.message,
							showCancel: false
						});
					});
				}
			});
		}
	});
}

export default {
	check
}
