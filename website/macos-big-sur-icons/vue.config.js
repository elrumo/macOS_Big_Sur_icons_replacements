const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  configureWebpack:  {
    plugins:  process.env.NODE_ENV === 'production' ?[
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: [ 
          '/',
          '/WhatsApp',
          
          '/blog',
          '/blog/welcome-to-the-blog-3',
          '/blog/new-paid-access',

          '/resources',
          '/resources/macos-big-sur-app-icon',
          '/resources/macos-big-sur-dock'
        ],
        
        // renderAfterDocumentEvent: 'render-ready',
        
        renderer: new Renderer({
          // Wait to render until the element specified is detected with document.querySelector.
          headless: true, // Let's you watch what's happening.
          renderAfterTime: 5000,

          // renderAfterElementExists: '#app'
        })
      })
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
