<template>
  <div>
    <main class="content-wrapper-compact">

      <H3-Description :text="introText" class="m-b-50"/>

      <div class="resources-grid card-grid" id="how-to-install">
        
        <ResourcesCard
          :step='instructions'
          :link="instructions.link"
        />

        <ResourcesCard
          v-for="resource in resourcesData"
          :key="resource.name"
          :link="'/resources/'+resource.slug"
          :step='resource'
        />

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

import pages from '@/api/pages.json';

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
        description: "Here you'll find guides, resources and templates to help you design and showcase icons for macOS.",
        isAd: false
      },
      instructions:{
        title: "How to change app icons",
        feature_image: require("../assets/Instructions/intro-instructions.jpg"),
        link: "/how-to",
      },
      resourcesData: pages
    }
  },
  
  mounted: async function(){
    const parent = this;
    let storeResourcesData = parent.$store.state.resourcesData
    // console.log("storeResourcesData: ", await storeResourcesData);
    parent.resourcesData = await storeResourcesData;
  },

  methods: {
  }

}
</script>

