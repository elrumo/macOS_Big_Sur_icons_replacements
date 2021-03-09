<template>
  <div>
    <main class="content-wrapper" style="max-width: 1050px !important">

      <H3-Description :text="introText"/>

      <div class="resources-grid card-grid" id="how-to-install">        
        <ResourcesCard v-for="step in steps" :key="step.name" :step='step'/>

        <div class="resources-card-ad">
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import ResourcesCard from '@/components/ResourcesCard.vue'
import Footer from '@/components/Footer.vue'
import H3Description from '@/components/H3_Description.vue'

export default {
  name: 'Resources',
  
  components: {
    Header,
    ResourcesCard,
    Footer,
    H3Description
  },

  data(){
    return {
      isMobile: this.$isMobile(),
      introText:{
        h3: "Resources",
        description: "Resources to help you design, showcase and share icons for macOS and other platforms soon.",
        isAd: false
      },
      steps:{
        download:{
          name: "bigSurDock",
          text:"macOS Big Sur Dock",
          img: require("../assets/Resources/Dock_Light.jpg"),
          gradient: false,
        },
        getInfo:{
          name: "bigSurIconTemplate",
          text:"macOS Big Sur eMacs Icon",
          img: require("../assets/Resources/emac_icon.jpg"),
          gradient: false,
        },
        setApp:{
          name: "setApp",
          text:"macOS Big Sur App Icon",
          img: require("../assets/Resources/icon_template.jpg"),
          gradient: false,
        }
      }
    }
  },
  
  methods: {
  }

}
</script>

