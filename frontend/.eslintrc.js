module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		'react/prop-types': 0,
	},
};
