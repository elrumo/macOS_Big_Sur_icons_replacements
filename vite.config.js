// // vite.config.js
// import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'
// import mkcert from 'vite-plugin-mkcert'
// // Update to use dynamic import for the static copy plugin
// import { defineConfig } from 'vite'

// // We'll use a different approach without the plugin that's causing issues
// export default defineConfig({
//   base: "./",
//   server: {
//     https: true
//   },
//   resolve: {
//     alias: {
//       vue: '@vue/compat',
//       "@": resolve(__dirname, "./src")
//     }
//   },
  
//   build: {
//     sourcemap: true,
//     cssCodeSplit: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           'coral-spectrum': ['@adobe/coral-spectrum']
//         }
//       }
//     }
//   },
  
//   assetsInclude: ['**/*.svg'],
  
//   plugins: [
//     mkcert(),
//     vue({
//       template: {
//         compilerOptions: {
//           isCustomElement: tag => tag.includes('coral'),
//           compatConfig: {
//             MODE: 2
//           }
//         }
//       }
//     }),
//     // Custom plugin to handle the icon copying
//     {
//       name: 'copy-coral-icons',
//       apply: 'build',
//       async closeBundle() {
//         // During build, you can handle copying icons manually
//         // We'll rely on a public directory copy instead
//         console.log('Remember to copy Coral Spectrum icons to your public directory');
//       }
//     }
//   ],
  
//   // Add this to optimize your build for selective imports
//   optimizeDeps: {
//     include: ['@adobe/coral-spectrum']
//   }
// })

// vite.config.js
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// import mkcert from 'vite-plugin-mkcert'
import ui from '@nuxt/ui/vite'

export default {
  base: "/",
  server: {
    // https: true // Temporarily disabled - mkcert has network issues
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  plugins: [
    // mkcert(), // Temporarily disabled - has network issues
    ui({
      ui: {
        colors: {
          primary: 'blue',
          neutral: 'slate'
        }
      }
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('coral')
        }
      }
    })
  ]
}