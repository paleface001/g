module.exports = {
  babelrc: {
    // presets: ['@babel/env'],
    // sourceMaps: 'inline',
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: false,
          modules: 'auto',
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      [
        '@babel/plugin-proposal-class-properties',
        {
          // @see https://github.com/storybookjs/storybook/issues/6069#issuecomment-472544973
          loose: true,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      // let rollup do commonjs works
      // @see https://github.com/rollup/rollup-plugin-babel#modules
      '@babel/plugin-transform-modules-commonjs',
      // 开发模式下以原始文本引入，便于调试
      [
        // import glsl as raw text
        'babel-plugin-inline-import',
        {
          extensions: [
            // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
            // '.json',
            '.glsl',
          ],
        },
      ],
      // 按需引用 @see https://github.com/lodash/babel-plugin-lodash
      'lodash',
      // 内联 WebGL 常量 @see https://www.npmjs.com/package/babel-plugin-inline-webgl-constants
      // isCDNBundle ? 'inline-webgl-constants' : {},
    ],
  },
  extensions: ['.es6', '.es', '.jsx', '.js', '.ts'],
  include: ['src/**', 'lib/**', 'tests/**'],
  exclude: ['bower_components/**', 'node_modules/**'],
};
