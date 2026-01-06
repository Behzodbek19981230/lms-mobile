module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // React Navigation patterns (e.g. headerRight) often pass inline element factories.
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
  },
};
