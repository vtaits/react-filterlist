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

      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    },

    cjs: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],

      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    },

    test: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],

      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    },
  },
};
