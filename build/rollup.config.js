const path = require('path');
const buble = require('rollup-plugin-buble');
const typescript = require('rollup-plugin-typescript');
const alias = require('@rollup/plugin-alias')

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath)
}
const utilsPath = resolveFile('./src/utils')
const srcPath = resolveFile('./src')

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'cjs',
    },
    plugins: [
      typescript(),
      buble(),
      alias({
        entries: [
          { find: 'utils', replacement: utilsPath },
          { find: '@', replacement: srcPath },
        ]
      })
    ],
  },
]