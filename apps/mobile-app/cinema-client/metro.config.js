const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// use workspace config 
const config = {
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react' || moduleName === 'react-native') {
        return context.resolveRequest(
          context,
          path.resolve(__dirname, 'node_modules', moduleName),
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  watchFolders: [
    path.resolve(__dirname, '../../..'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
