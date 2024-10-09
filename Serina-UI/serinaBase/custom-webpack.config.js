const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/**/*.html'), { nodir: true }),
      safelist: { standard: [/^fa-/] }  // Add safelist for FontAwesome if needed
    }),
  ],
};
