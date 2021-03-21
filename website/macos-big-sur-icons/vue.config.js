const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  pwa: {
    name: 'macOSicons',
    manifestCrossorigin: 'use-credentials'
  },
  configureWebpack:  {
    plugins: process.env.NODE_ENV === 'production' ? [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: [ 
          '/',
          '/WhatsApp',
          '/blog',
          '/blog/welcome-to-the-blog-3',
          '/resources',
          '/resources/macos-big-sur-app-icon',
          '/resources/macos-big-sur-dock'
        ],
      })
    ] : []
  }
}