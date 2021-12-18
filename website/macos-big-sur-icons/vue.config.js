const path = require('path')

// const plugins = [{
//   content: [ `./public/**/*.html`, `./src/**/*.vue` ],
//   defaultExtractor (content) {
//     const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
//     return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
//   },
//   safelist: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ],
// }];

const PATHS = {
  src: path.join(__dirname, 'src')
}

// plugins:  process.env.NODE_ENV === 'production' ?[] : [],
module.exports = {
  configureWebpack:  {
    // plugins:  process.env.NODE_ENV === 'dev' ?[] : [],
    plugins:  process.env.NODE_ENV === 'production' ?[] : [],
  },

  lintOnSave: false,

}
