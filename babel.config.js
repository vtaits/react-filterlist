module.exports = {
  env: {
    es: {
      presets: [
        [
          '@babel/env', {
            modules: false,
          },
        ],
        '@babel/react',
      ],
    },

    cjs: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],
    },

    test: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],
    },
  },

  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
  ],
};
