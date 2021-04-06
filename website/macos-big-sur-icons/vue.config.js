const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  configureWebpack:  {
    plugins:  process.env.NODE_ENV === 'production' ?[
      
    ] : []
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
