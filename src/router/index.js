import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import BlogPost from '../views/BlogPost.vue'
import BlogHome from '../views/BlogHome.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import HowTo from '../views/HowTo.vue'
import Forum from '../views/Forum.vue'
import ResourceView from '../views/ResourceView.vue'
import Learn from '../views/Learn.vue'

// Vue.use(VueRouter)
// Vue.use(VueMeta)

const routes = [
  {
    path: "/index.html",
    redirect: "/" 
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Dashboard
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/About.vue')
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/blog',
    name: 'BlogHome',
    component: BlogHome,
    meta: { 
      title: 'Blog - Free app icon Dock template for macOS Big Sur.',
      description: 'Free 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.',
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/blog'
        },
        {
          property: 'og:title',
          content:  'Free app icon Dock template for macOS Big Sur.',
        },
        {
          property: 'og:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/blog'
        },
        {
          property: 'twitter:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.'
        },
        {
          property: 'twitter:title',
          content:  'Free app icon Dock template for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
        },
      ]
    }
  },
  {
    path: '/blog/:post',
    name: 'BlogPost',
    component: BlogPost
  },
  {
    path: '/blog/new-paid-access',
    name: 'New Paid Access',
    component: BlogPost,
    meta: { 
      title: 'New paid access for macOSicons.com',
      description:"Just joking, look at the date. You do not have to pay anything. But...",
      image: "https://blog.macosicons.com/blog/content/images/2021/04/NewPaidAccess.jpg",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/blog/new-paid-access'
        },
        {
          property: 'og:title',
          content:  'New paid access for macOSicons.com',
        },
        {
          property: 'og:description',
          content:  'Just joking, look at the date. You do not have to pay anything. But...',
        },
        {
          property: 'og:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/04/NewPaidAccess.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          content:  'Just joking, look at the date. You do not have to pay anything. But...',
        },
        {
          property: 'twitter:title',
          content:  'New paid access for macOSicons.com',
        },
        {
          property: 'twitter:image',
          content:  'https://blog.macosicons.com/blog/content/images/2021/04/NewPaidAccess.jpg'
        },
      ]
    }
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
    component: HowTo,
    meta:{
      title: 'How to change app icons in macOS Big Sur',
      description:"Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/how-to/'
        },
        {
          property: 'og:title',
          content:  'How to change app icons in macOS Big Sur',
        },
        {
          property: 'og:description',
          content:  'Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/design/How_To-Thumbnail.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/how-to/'
        },
        {
          property: 'twitter:title',
          content:  'How to change app icons in macOS Big Sur'
        },
        {
          property: 'twitter:description',
          content:  'Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/design/How_To-Thumbnail.jpg'
        },
      ]
    }
  },

  {
    path: '/forum',
    name: 'Forum',
    component: Forum
  },

  {
    path: '/resources/"macos-big-sur-app-icon"',
    name: 'Resource-BigSur-template',
    component: ResourceView,
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
    path: '/resources/"macos-big-sur-dock"',
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
    path: '/learn',
    name: 'Learn',
    component: Learn,
    meta: { 
      title: 'Free macOS Big Sur icon templates and tutorials.',
      description:"Resources, templates and tutorials to help you design icons for macOS.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free macOS Big Sur icon templates and tutorials.',
        },
        {
          property: 'og:description',
          content:  'Resources, templates and tutorials to help you design icons for macOS.',
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
          content:  'Resources, templates and tutorials to help you design icons for macOS.',
        },
        {
          property: 'twitter:title',
          content:  'Free macOS Big Sur icon templates and tutorials.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },
      ]
    }
  },

  {
    path: '/learn/:learningResource',
    name: 'LearningResource',
    component: () => import('../views/LearningResource.vue'),
    meta: { 
      title: 'Free macOS Big Sur icon templates and tutorials.',
      description:"Resources, templates and tutorials to help you design icons for macOS.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free macOS Big Sur icon templates and tutorials.',
        },
        {
          property: 'og:description',
          content:  'Resources, templates and tutorials to help you design icons for macOS.',
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
          content:  'Resources, templates and tutorials to help you design icons for macOS.',
        },
        {
          property: 'twitter:title',
          content:  'Free macOS Big Sur icon templates and tutorials.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
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
    path: '/user/:user',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  },

  {
    path: '/u/:user',
    name: 'UserProfile_user',
    component: () => import('../views/UserProfile.vue')
  },

  {
    path: '/user/',
    name: 'uProfile',
    component: () => import('../views/UserProfile.vue')
  },

  {
    path: '/u/',
    name: 'uProfile_user',
    component: () => import('../views/UserProfile.vue')
  },

  {
    path: '/:search',
    name: 'Search',
    component: Home
  },

  {
    path: '/WhatsApp',
    name: 'WhatsApp',
    component: Home,
    meta: { 
      title: 'Free WhatsApp icons for macOS Big Sur.',
      description:"Free WhatsApp and 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.",
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/WhatsApp'
        },
        {
          property: 'og:title',
          content:  'Free WhatsApp icons for macOS Big Sur.',
        },
        {
          property: 'og:description',
          content:  'Free WhatsApp and 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/high-res/whatsapp-thumbnail.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com/WhatsApp'
        },
        {
          property: 'twitter:description',
          content:  'Free WhatsApp and 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led.',
        },
        {
          property: 'twitter:title',
          content:  'Free WhatsApp icons for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/high-res/whatsapp-thumbnail.jpg'
        },
      ]
    }
  },
]

// global.router = new createRouter({
const router = new createRouter({
  base: import.meta.env.BASE_URL,
  history: createWebHistory('/'),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { left: 0, top: 0 }
  }
})


export default router
