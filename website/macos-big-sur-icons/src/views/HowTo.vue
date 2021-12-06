<template>
  <div>
    <main class="content-wrapper-compact">
      
      <router-link to="/resources">
        <p class="coral-Detail read-more read-more-left coral-Detail--XL m-t-32 coral-Link">
          All Resources
        </p>
      </router-link>

      <H3-Description :text="introText"/>

      <div class="instructions-grid card-grid" id="how-to-install">        
        <HowToSteps v-for="step in steps" :key="step.name" :step='step'/>
      </div>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import HowToSteps from '@/components/HowToSteps.vue'
import H3Description from '@/components/H3_Description.vue'

import downloadIcon from "../assets/Instructions/downloadIcon.png"
import getInfoIcon from "../assets/Instructions/getInfo.png"
import setAppIcon from "../assets/Instructions/setApp.png"

export default {
  name: 'HowTo',

  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'How to change app icons on macOS Big Sur & Monterey',
      description:"Guide to download and change app icons on macOS Big Sur & Monterey using Finder and a website with over 5000+ free app icons.",
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
          content:  'How to change app icons on macOS Big Sur & Monterey',
        },
        {
          property: 'og:description',
          content:  'Guide to download and change app icons on macOS Big Sur & Monterey using Finder and a website with over 5000+ free app icons.',
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
          content:  'How to change app icons on macOS Big Sur & Monterey'
        },
        {
          property: 'twitter:description',
          content:  'Guide to download and change app icons in macOS Big Sur & Monterey using Finder and a website with over 5000+ free app icons.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/design/How_To-Thumbnail.jpg'
        },
      ]
  },

  mounted: function(){     
  },

  data(){
    return {
      isMobile: this.$isMobile(),

      introText:{
        h3: "How to change app icons on macOS Big Sur & Monterey",
        description: "Here you'll find all the information you need to chanege the icon of your favorite macOS and iOS app. For help or support ask me on [Twitter](https://twitter.com/elrumo) or ask on our [forum](https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions).",
        isAd: true
      },

      steps:{
        download:{
          name: "download",
          text:"### Download the icon you want from [**macOSicons.com**](https://macosicons.com)",
          img: downloadIcon,
          gradient: false,
        },
        getInfo:{
          name: "getInfo",
          text:"### Find the app in Finder, right click on it and select **Get Info**",
          img: getInfoIcon,
          gradient: true,
        },
        setApp:{
          name: "setApp",
          text:"### Drag the downloaded file to the current icon on the Info window",
          img: setAppIcon,
          gradient: true,
        }
      }
    }
  },

  components: {
    Header,
    HowToSteps,
    H3Description    
  },
  
  methods: {
  }

}
</script>
