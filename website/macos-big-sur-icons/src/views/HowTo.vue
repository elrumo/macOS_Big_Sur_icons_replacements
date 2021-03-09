<template>
  <div>
    <!-- <div class="single-ad"> -->
      <!-- <script v-if="isMobile" async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script> -->
    <!-- </div> -->

    <main class="content-wrapper-compact">
      
      <!-- <div class="text-and-ad-wrapper"> -->
      <!-- <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script> -->
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

export default {
  name: 'HowTo',

  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'How to change app icons in macOS Big Sur',
      description:"Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          vmid:     'og:url',
          content:  'https://macosicons.com/how-to/'
        },
        {
          property: 'og:title',
          vmid:     'og:title',
          content:  'How to change app icons in macOS Big Sur',
        },
        {
          property: 'og:description',
          vmid:     'og:description',
          content:  'Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.',
        },
        {
          property: 'og:image',
          vmid:     'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/design/How_To-Thumbnail.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          vmid:     'twitter:url',
          content:  'https://macosicons.com/how-to/'
        },
        {
          property: 'twitter:title',
          vmid:     'twitter:title',
          content:  'How to change app icons in macOS Big Sur'
        },
        {
          property: 'twitter:description',
          vmid:     'twitter:description',
          content:  'Guide to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.',
        },
        {
          property: 'twitter:image',
          vmid:     'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/design/How_To-Thumbnail.jpg'
        },
      ]
  },

  mounted: function(){
    console.log(this.$metaInfo);        
  },

  data(){
    return {
      isMobile: this.$isMobile(),

      introText:{
        h3: "How to change app icons in macOS Big Sur",
        description: "Here you'll find all the information you need to chanege the icon of your favorite macOS and iOS app. For help or support ask me on [Twitter](https://twitter.com/elrumo) or ask on our [forum](https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions).",
        isAd: true
      },

      steps:{
        download:{
          name: "download",
          text:"### Download the icon you want from [**macOSicons.com**](https://macosicons.com)",
          img: require("../assets/Instructions/downloadIcon.png"),
          gradient: false,
        },
        getInfo:{
          name: "getInfo",
          text:"### Find the app on Finder, right click on it and select **Get Info**",
          img: require("../assets/Instructions/getInfo.png"),
          gradient: true,
        },
        setApp:{
          name: "setApp",
          text:"### Drag the downloaded file to the current icon on the Info window",
          img: require("../assets/Instructions/setApp.png"),
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
