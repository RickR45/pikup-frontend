const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-preset')
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg']
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config); 