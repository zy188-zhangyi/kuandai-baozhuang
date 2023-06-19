const configs = {
	dev: {
		base_tit: '宽带报装',
		base_url: 'http://127.0.0.1:7204',
		base_wx_map_key: ''
	},
}
let env = 'dev'
let config = configs[env];
export default config
