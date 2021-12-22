// vite.config.js
// import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// const path = require("path");
import Parse from 'parse/dist/parse.min.js';

const VITE_PARSE_APP_ID = 'macOSicons'
const VITE_PARSE_JAVASCRIPT_KEY = 'macOSicons'

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = 'https://media.macosicons.com/parse'
var IconsBase = Parse.Object.extend("Icons2");

let icons = new Parse.Query(IconsBase)
console.log("icons: ", icons);


export default {
  base: "./",
  resolve: {
    alias: {
      vue: '@vue/compat',
      "@": resolve(__dirname, "./src")
    }
  },
  
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('coral-'),
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
