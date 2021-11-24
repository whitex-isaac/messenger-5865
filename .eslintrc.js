module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['airbnb-base'],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		'linebreak-style': 0,
		allowIndentationTabs: true,
		'no-unused-vars': 'warn', //warns about unused variables
		'no-eval': 'error',
		'no-console': 'warn',
	},
};
