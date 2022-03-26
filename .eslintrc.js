module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'], // 添加 prettier 插件,
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    quotes: ['error', 'double'], //引号规则为：“双引号”，否则一律按照 “error” 处理（你也可以改成warn试一下）
  },
};
