const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {

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
          '/blog/new-paid-access',

          '/resources',
          '/resources/macos-big-sur-app-icon',
          '/resources/macos-big-sur-dock'
        ],
      })
    ] : []
  }
}