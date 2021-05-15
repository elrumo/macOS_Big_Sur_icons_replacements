const path = require('path')
const purgecss = require("@fullhuman/postcss-purgecss");
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const plugins = [{
  content: [ `./public/**/*.html`, `./src/**/*.vue` ],
  defaultExtractor (content) {
    const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
    return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
  },
  safelist: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ],
}];

module.exports = {
  configureWebpack:  {
    plugins:  process.env.NODE_ENV === 'production' ?[] : plugins,
  },

  // pluginOptions: {
  //   prerenderSpa: {
  //     registry: undefined,
  //     renderRoutes: [
  //       '/',
  //       '/WhatsApp',
  //       '/blog',
  //       '/blog/welcome-to-the-blog-3',
  //       '/blog/new-paid-access',
  //       '/resources',
  //       '/resources/macos-big-sur-app-icon',
  //       '/resources/macos-big-sur-dock'
  //     ],
  //     useRenderEvent: true,
  //     headless: true,
  //     onlyProduction: false
  //   }
  // }
}
