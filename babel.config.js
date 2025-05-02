/* eslint-disable prettier/prettier */
module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};



// babel.config.js
