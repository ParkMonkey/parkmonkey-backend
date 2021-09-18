/* eslint-disable unicorn/prefer-module */

module.exports = {
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:unicorn/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	plugins: ['@typescript-eslint', 'simple-import-sort', 'import', 'unicorn'],
	rules: {
		'import/no-default-export': 'error',
		'import/prefer-default-export': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				ts: 'never',
			},
		],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'unicorn/prefer-module': 'off',
		'unicorn/prefer-node-protocol': 'off',
		'unicorn/prefer-ternary': 'off',
		'unicorn/prevent-abbreviations': 'off',
		'unicorn/consistent-function-scoping': 'off',
		'unicorn/no-useless-undefined': 'off',
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
	},
};
