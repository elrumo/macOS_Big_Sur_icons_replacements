<template>
  <div>
    <main class="content-wrapper-compact">

      <H3-Description :text="introText"/>

      <div class="resources-grid card-grid" id="how-to-install">        
        <ResourcesCard v-for="resource in resourcesData" :key="resource.name" :step='resource'/>

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
        description: "Resources to help you design, showcase and share icons for macOS and other platforms soon.",
        isAd: false
      },
      resourcesData: pages
    }
  },
  
  mounted: async function(){
    const parent = this;
    let storeResourcesData = parent.$store.state.resourcesData
    console.log("storeResourcesData: ", await storeResourcesData);
    parent.resourcesData = await storeResourcesData;
  },

  methods: {
  }

}
</script>

