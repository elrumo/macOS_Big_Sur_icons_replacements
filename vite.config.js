// vite.config.js
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import mkcert from'vite-plugin-mkcert'

export default {
  base: "./",
  server: {
    https: false
  },
  resolve: {
    alias: {
      vue: '@vue/compat',
      "@": resolve(__dirname, "./src")
    }
  },
  
  plugins: [
    mkcert(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('coral'),
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ]
}



// // vite.config.js

// import { defineConfig } from 'vite'
// import vue from "vue";
// // import { createVuePlugin as vue } from "vite-plugin-vue2";
// const path = require("path");

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue({
//       template: {
//         compilerOptions: {
//           compatConfig: {
//             MODE: 2
//           }
//         }
//       }
//     })
//   ],
//   resolve: {
//     alias: {
//       vue: '@vue/compat',
//       "@": path.resolve(__dirname, "./src")
//     },
//   },
// })
