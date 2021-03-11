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

     metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Free icon templates resources for macOS Big Sur.',
      description:"Resources and templates to help you design and showcase icons for macOS.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          vmid:     'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          vmid:     'og:title',
          content:  'Free icon templates resources and over 5000+ icons for macOS Big Sur.',
        },
        {
          property: 'og:description',
          vmid:     'og:description',
          content:  'Resources and templates to help you design and showcase icons for macOS. Over 5000+ free icons ready for Big Sur.',
        },
        {
          property: 'og:image',
          vmid:     'og:image',
          content:  'https://macosicons.com/img/intro-instructions.543ccaf7.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          vmid:     'twitter:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'twitter:description',
          vmid:     'twitter:description',
          content:  'Resources and templates to help you design and showcase icons for macOS. Over 5000+ free icons ready for Big Sur.',
        },
        {
          property: 'twitter:title',
          vmid:     'twitter:title',
          content:  'Free icon templates resources and over 5000+ icons for macOS Big Sur.',
        },
        {
          property: 'twitter:image',
          vmid:     'twitter:image',
          content:  'https://macosicons.com/img/intro-instructions.543ccaf7.jpg'
        },
      ]
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

