const path = require('path');
// const { resolve } = path

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src/'),
      // "utils": path.resolve(__dirname, 'src/utils')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};