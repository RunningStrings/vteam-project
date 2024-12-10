const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
    ...defaultConfig,
    resolver: {
        ...defaultConfig.resolver,
        alias: {
        '@components': './components',
        '@constants': './constants',
        '@hooks': './hooks',
        '@screens': './screens',
        '@assets': './assets',
        '@app': './app',
        },
    },
};
