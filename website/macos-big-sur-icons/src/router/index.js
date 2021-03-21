import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import HomeView from '../views/HomeView.vue'
import BlogPost from '../views/BlogPost.vue'
import BlogHome from '../views/BlogHome.vue'

Vue.use(VueRouter)
Vue.use(VueMeta)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/blog',
    name: 'BlogHome',
    component: BlogHome
  },
  {
    path: '/blog/:post',
    name: 'BlogPost',
    component: BlogPost
  },
  {
    path: '/blog/welcome-to-the-blog-3',
    name: 'BlogPost-Welcome',
    component: BlogPost,
    meta: { 
      title: 'Welcome to the macOSicons blog.',
      description:"A brief retrospective of macOSicons.com, my future plans for the site and new upcoming features.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources/welcome-to-the-blog-3'
        },
        {
          property: 'og:title',
          content:  'Welcome to the macOSicons blog.',
        },
        {
          property: 'og:description',
          content:  'A brief retrospective of macOSicons.com, my future plans for the site and new upcoming features.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          content:  'A brief retrospective of macOSicons.com, my future plans for the site and new upcoming features.',
        },
        {
          property: 'twitter:title',
          content:  'Welcome to the macOSicons blog.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },
      ]
    }
  },
  {
    path: '/how-to',
    name: 'HowTo',
    component: () => import('../views/HowTo.vue')
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum.vue')
  },
  {
    path: '/resources/macos-big-sur-app-icon',
    name: 'Resource-BigSur-template',
    component: () => import('../views/ResourceView.vue'),
    meta: { 
      title: 'Free app icon template for macOS Big Sur.',
      description:"Template to create app icons for macOS Big Sur. Contains instructions on how to upload your icons to macOSicons.com and a set of predefined styles ready for you to apply and edit.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free app icon template for macOS Big Sur.',
        },
        {
          property: 'og:description',
          content:  'Template to create app icons for macOS Big Sur. Contains instructions on how to upload your icons to macOSicons.com and a set of predefined styles ready for you to apply and edit.',
        },
        {
          property: 'og:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/03/intro-app-template-2.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          content:  'Template to create app icons for macOS Big Sur. Contains instructions on how to upload your icons to macOSicons.com and a set of predefined styles ready for you to apply and edit.',
        },
        {
          property: 'twitter:title',
          content:  'Free app icon template for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/03/intro-app-template-2.jpg'
        },
      ]
    }
  },
  {
    path: '/resources/macos-big-sur-dock',
    name: 'Resource-BigSur-dock-template',
    component: () => import('../views/ResourceView.vue'),
    meta: { 
      title: 'Free app icon Dock template for macOS Big Sur.',
      description:"Figma template to show off your icons on the macOS Big Sur dock. Has dark and light variants and four different styles.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free app icon Dock template for macOS Big Sur.',
        },
        {
          property: 'og:description',
          content:  'Figma template to show off your icons on the macOS Big Sur dock. Has dark and light variants and four different styles.',
        },
        {
          property: 'og:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/03/intro_dock-2.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          content:  'Figma template to show off your icons on the macOS Big Sur dock. Has dark and light variants and four different styles.'
        },
        {
          property: 'twitter:title',
          content:  'Free app icon Dock template for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/03/intro_dock-2.jpg'
        },
      ]
    }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('../views/Resources.vue'),
    meta: { 
      title: 'Free icon templates resources for macOS Big Sur.',
      description:"Resources and templates to help you design and showcase icons for macOS.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free icon templates resources and over 5000+ icons for macOS Big Sur.',
        },
        {
          property: 'og:description',
          content:  'Resources and templates to help you design and showcase icons for macOS. Over 5000+ free icons ready for Big Sur.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          content:  'Resources and templates to help you design and showcase icons for macOS. Over 5000+ free icons ready for Big Sur.',
        },
        {
          property: 'twitter:title',
          content:  'Free icon templates resources and over 5000+ icons for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },
      ]
    }
  },
  {
    path: '/resources/:resource',
    name: 'Resource',
    component: () => import('../views/ResourceView.vue')
  },
  {
    path: '/:search',
    name: 'Search',
    component: HomeView
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
