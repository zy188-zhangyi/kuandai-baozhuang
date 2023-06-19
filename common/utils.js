export default {
	urlParams(scene) {
		const str = decodeURIComponent(scene).replace('?', '&')
		let strArr = str.split('&')
		strArr = strArr.filter(item => item)
		const result = {}
		strArr.filter(item => {
			const key = item.split('=')
			result[key[0]] = key[1]
		})
		return result
	},
	/**
	 * 检查登录
	 * @return {Boolean}
	 */
	checkUser(murl) {
		const token = uni.getStorageSync('token');
		const areaId = uni.getStorageSync('areaId');
		uni.request({
			url: murl,
			header: {
				'Authorization': 'Bearer ' + token || '',
				'content-type': 'application/json'
			},
			data: {
				areaId: areaId || ''
			},
			method: 'POST',
			success: (res) => {
				let result = res.data
				if (result.code == 0) {
					return true
				} else {
					uni.navigateTo({
						url: '/pages/member/index'
					})
					return false
				}
			},
			fail: function() {
				uni.navigateTo({
					url: '/pages/member/index'
				})
				return false
			}
		})
		return false
	},
	wxComChat(murl) {
		uni.request({
			url: murl,
			header: {
				'content-type': 'application/json'
			},
			data: {},
			method: 'POST',
			success: (res) => {
				let result = res.data
				if (result.code == 0) {
					// console.log(result)
					wx.openCustomerServiceChat({
						extInfo: {
							url: result.data.chaturl //客服地址链接
						},
						corpId: result.data.comid, //必须和你小程序上的一致
						sendMessageTitle: '宽带报装',
						success(res) {
							console.log(res, 1)
						},
						fail(res) {
							console.log(res, 2)
						},
					})
				}
			},
			fail: function() {
				console.log('企业微信客服失败', 3)
			},
		})
	},
	isLogin() {
		const token = uni.getStorageSync('token');
		if (token) {
			return true;
		}else{
			uni.navigateTo({
				url: '/pages/member/index'
			})
		}
	},
	formatTime(time) {
		if (typeof time !== 'number' || time < 0) {
			return time
		}

		var hour = parseInt(time / 3600)
		time = time % 3600
		var minute = parseInt(time / 60)
		time = time % 60
		var second = time

		return ([hour, minute, second]).map(function(n) {
			n = n.toString()
			return n[1] ? n : '0' + n
		}).join(':')
	},

	/*
	 * @description 生成时间戳
	 */
	timestamp() {
		var date = new Date();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		var hours = date.getHours();
		var Minutes = date.getMinutes();
		var Seconds = date.getSeconds();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		if (hours >= 0 && hours <= 9) {
			hours = "0" + hours;
		}
		if (Minutes >= 0 && Minutes <= 9) {
			Minutes = "0" + Minutes;
		}
		if (Seconds >= 0 && Seconds <= 9) {
			Seconds = "0" + Seconds;
		}
		var times = date.getFullYear() + '' + month + '' + strDate + '' + hours + '' + Minutes + '' + Seconds;
		return times;
	},
	/*
	 * @description 计算两个时间之间的时间差 多少天时分秒
	 * @param endTime 结束时间
	 */
	intervalTime(beginTime, endTime) {
		let start = beginTime;
		let end = endTime
		if (beginTime < endTime) {
			start = beginTime;
			end = endTime;
		} else {
			start = endTime;
			end = beginTime;
		}
		var date3 = (end - start) * 1000; //时间差的毫秒数
		//计算出相差天数
		var days = Math.floor(date3 / (24 * 3600 * 1000));
		//计算出小时数
		var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
		var hours = Math.floor(leave1 / (3600 * 1000));

		//计算分钟数
		var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
		var minutes = Math.floor(leave2 / (60 * 1000));

		//计算秒数
		var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
		var seconds = Math.round(leave3 / 1000);
		return days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
	},

	/*
	 * @description 判读是否为外链
	 * @param path
	 * @returns {boolean}
	 */
	isExternal(path) {
		return /^(https?:|mailto:|tel:)/.test(path);
	},
	/**
	 * @description 校验密码是否小于6位
	 * @param str
	 * @returns {boolean}
	 */
	isPassword(str) {
		return str.length >= 6;
	},

	/**
	 * @description 判断是否为数字
	 * @param value
	 * @returns {boolean}
	 */
	isNumber(value) {
		const reg = /^[0-9]*$/;
		return reg.test(value);
	},

	/**
	 * @description 判断是否是小写字母
	 * @param str
	 * @returns {boolean}
	 */
	isLowerCase(str) {
		const reg = /^[a-z]+$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否是大写字母
	 * @param str
	 * @returns {boolean}
	 */
	isUpperCase(str) {
		const reg = /^[A-Z]+$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否是大写字母开头
	 * @param str
	 * @returns {boolean}
	 */
	isAlphabets(str) {
		const reg = /^[A-Za-z]+$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否是字符串
	 * @param str
	 * @returns {boolean}
	 */
	isString(str) {
		return typeof str === "string" || str instanceof String;
	},

	/**
	 * @description 判断是否是数组
	 * @param arg
	 * @returns {arg is any[]|boolean}
	 */
	isArray(arg) {
		if (typeof Array.isArray === "undefined") {
			return Object.prototype.toString.call(arg) === "[object Array]";
		}
		return Array.isArray(arg);
	},

	/**
	 * @description 判断是否是手机号
	 * @param str
	 * @returns {boolean}
	 */
	isPhone(str) {
		const reg = /^1\d{10}$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否是身份证号(第二代)
	 * @param str
	 * @returns {boolean}
	 */
	isIdCard(str) {
		const reg =
			/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否是邮箱
	 * @param str
	 * @returns {boolean}
	 */
	isEmail(str) {
		const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否中文
	 * @param str
	 * @returns {boolean}
	 */
	isChina(str) {
		const reg = /^[\u4E00-\u9FA5]{2,4}$/;
		return reg.test(str);
	},

	/**
	 * @description 判断是否为空
	 * @param str
	 * @returns {boolean}
	 */
	isNull(str) {
		return (
			str == null ||
			false ||
			str === "" ||
			str.trim() === "" ||
			str == undefined ||
			str.toLocaleLowerCase().trim() === "null"

		);
	},

	/**
	 * @description 判断是否为固话
	 * @param str
	 * @returns {boolean}
	 */
	isTel(str) {
		const reg =
			/^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
		return reg.test(str);
	},

	// 获取WiFi信息
	// 需要权限
	// android.permission.ACCESS_WIFI_STATE
	// android.permission.INTERNET
	getWiFiIP() {
		// MainActivity
		var MainActivity = plus.android.runtimeMainActivity()
		// Context
		var Context = plus.android.importClass('android.content.Context')
		// WiFi 相关包  
		plus.android.importClass("android.net.wifi.WifiManager")
		plus.android.importClass("android.net.wifi.WifiInfo")
		plus.android.importClass("android.net.wifi.ScanResult")
		plus.android.importClass("java.util.ArrayList")
		// WiFi 管理实例
		var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
		// 开启 WiFi
		// wifiManager.setWifiEnabled(true)
		// 当前连接 WiFi 信息  
		var wifiInfo = wifiManager.getConnectionInfo()
		// console.log(wifiInfo.toString())
		var ipAddress = wifiInfo.getIpAddress()
		var ip = ((ipAddress & 0xff) + "." + (ipAddress >> 8 & 0xff) + "." + (ipAddress >> 16 & 0xff) + "." + (
			ipAddress >> 24 & 0xff))
		// console.log(ip)
		return ip
	},

	/**
	 * @description 判断是否为数字且最多两位小数
	 * @param str
	 * @returns {boolean}
	 */
	isNum(str) {
		const reg = /^\d+(\.\d{1,2})?$/;
		return reg.test(str);
	},

	//取值
	getKey(key, sync = true) {
		try {
			if (sync) {
				return uni.getStorageSync(key);
			} else {
				let data = '';
				uni.getStorage({
					key: key,
					success: function(res) {
						data = res.data;
					}
				});
				return data;
			}
		} catch (e) {
			return false;
		}
	},



	//赋值
	setKey(key, value, sync = true) {
		try {
			if (sync) {
				return uni.setStorageSync(key, value);
			} else {
				uni.setStorage({
					key: key,
					data: value
				});
			}
		} catch (e) {

		}
	},



	//移除
	delKey(key, sync = true) {
		try {
			if (sync) {
				return uni.removeStorageSync(key);
			} else {
				uni.removeStorage({
					key: key
				});
			}
		} catch (e) {
			return false;
		}
	},


	//清空
	clearKey(sync = true) {
		try {
			if (sync) {
				return uni.clearStorageSync();
			} else {
				uni.clearStorage();
			}
		} catch (e) {
			return false;
		}
	},
	dateTimeStr(str) {
		var date = new Date(),
			year = date.getFullYear(), //年
			month = date.getMonth() + 1, //月
			day = date.getDate(), //日
			hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
			minute = date.getMinutes() < 10 ? date.getMinutes() : date.getMinutes(), //分
			second = date.getSeconds() < 10 ? date.getSeconds() : date.getSeconds(); //秒
		month >= 1 && month <= 9 ? (month = "0" + month) : "";
		day >= 0 && day <= 9 ? (day = "0" + day) : "";
		hour >= 0 && hour <= 9 ? (hour = "0" + hour) : "";
		minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
		second >= 0 && second <= 9 ? (second = "0" + second) : "";
		if (str.indexOf('y') != -1) {
			str = str.replace('y', year)
		}
		if (str.indexOf('m') != -1) {
			str = str.replace('m', month)
		}
		if (str.indexOf('d') != -1) {
			str = str.replace('d', day)
		}
		if (str.indexOf('h') != -1) {
			str = str.replace('h', hour)
		}
		if (str.indexOf('i') != -1) {
			str = str.replace('i', minute)
		}
		if (str.indexOf('s') != -1) {
			str = str.replace('s', second)
		}
		return str;
	},
	getDistance(lat1, lng1, lat2, lng2) {
		const radLat1 = (lat1 * Math.PI) / 180.0;
		const radLat2 = (lat2 * Math.PI) / 180.0;
		const a = radLat1 - radLat2;
		const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
		let s =
			2 *
			Math.asin(
				Math.sqrt(
					Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
				)
			);
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		s = s * 1000;
		if (isNaN(s)) {
			return 0 + "m";
		}
		// if (s > 100000) {
		// 	// 大于100Km时
		// 	s = Math.floor((s / 1000) * 100) / 100;
		// 	return s.toFixed() + "km";
		// }
		if (s > 1000) {
			// 大于1000米时
			s = Math.floor((s / 1000) * 100) / 100;
			return s.toFixed(1) + "km";
		}
		// 小于1000米直接返回
		return s.toFixed() + "m";
	},
	GetUpFileUrl(domain, url) {
		if (!url) {
			return url
		}
		if (url.toLowerCase().indexOf("http") >= 0) {
			return url
		}
		let reg = new RegExp('^/*' + domain + "/*");
		return domain + "/" + url.replace(reg, '')
	},
	setTabBar(index,text){
		uni.setTabBarItem({
			 index,
			 text,
		})
	}

}
