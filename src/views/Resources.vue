<template>
  <div>

    <main class="content-wrapper-compact">
      <H3-Description
        :text="getResourcesHomeTemplate.H3Description ? getResourcesHomeTemplate.H3Description : introText"
      />

      <div class="resources-grid card-grid" id="how-to-install">
        
        <ResourcesCard
          :step='instructions'
          :link="instructions.link"
        />

        <ResourcesCard
          v-for="resource in getResourcesData"
          :key="resource.id"
          :link="'/resources/'+resource.slug"
          :step='resource'
        />

        <!-- <CarbonAd class="resources-card-container" adId="resourcesHome"/> -->

        <!-- <NativeAd
          :adPosition="'Loading error'"
          :template="2"
          adId="CWYD65Q7"
          zoneKey="CWYD65Q7"
          key="CWYD65Q7"
        /> -->

        <!-- <div
          class="card-hover resources-card-container relative coral-card resources-card-ad"
          @click="adClick({position: 'Icon Grid Bottom', type: 'Carbon'})"
        >
          <a
              class="card-no-ad relative"
              href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
              rel="noopener"
              target="_blank"
              style="width: 100%; left: 0;"
            >
              <div class="support-page">
                <h3 class="coral-Heading--S m-0">
                  Support this page
                </h3>
                <p class="coral-Body--S m-0">
                  Please consider disabling your ad blocker or making a
                  <a  
                    rel="noopener"
                    class="coral-Link"
                    target="_blank"
                    href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                  >
                    donation 
                  </a>
                 to support this project.
                </p>
              </div>
            </a>
        </div> -->

        
      </div>

    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex'
import Header from '@/components/Header.vue'
import ResourcesCard from '@/components/ResourcesCard.vue'
import Footer from '@/components/Footer.vue'
import H3Description from '@/components/H3Description.vue'
import CarbonAd from '@/components/CarbonAd.vue';
import NativeAd from '@/components/NativeAd.vue'

// import pages from '@/api/pages.json';

import featureImageIcon from "../assets/Instructions/intro-instructions.jpg"

export default {
  name: 'Resources',
  
  components: {
    Header,
    ResourcesCard,
    Footer,
    H3Description,
    CarbonAd,
    NativeAd
  },

  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Free icon templates resources for macOS Monterey, Big Sur.',
      description:"Resources and templates to help you design and showcase icons for macOS.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com/resources'
        },
        {
          property: 'og:title',
          content:  'Free icon templates resources and over 5000+ icons for macOS Monterey, Big Sur.',
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
          content:  'Free icon templates resources and over 5000+ icons for macOS Monterey, Big Sur.',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Resources-thumbnail.jpg'
        },
      ]
  },

  data(){
    return {
      isMobile: this.$isMobile(),
      introText:{
        h3: "Resources",
        description: "Here you'll find guides, resources and templates to help you design and showcase icons for macOS.",
        isCenter: true,
        isAd: true
      },
      instructions:{
        title: "How to change app icons",
        feature_image: featureImageIcon,
        link: "/how-to",
        slug: "/how-to"
      },
      // resourcesData: pages
    }
  },
  
  mounted: async function(){
    // let storeResourcesData = this.$store.state.resourcesData
    // this.resourcesData = await storeResourcesData;
    // this.getPageData();
    this.fetchResourcesHome();

    // this.fetchArticleTemplate({slug: 'resources-home', state: 'resourcesTemplate'});
  },

  methods: {
    ...mapActions([
      'getPageData',
      'adClick',
      'fetchResourcesHome',
      'fetchArticleTemplate'
    ]),

    async getPages(){
      console.log(this.getPageData);
    }
  },

  computed: {
    ...mapGetters([
      'getResourcesData',
      'getResourcesHomeTemplate'
    ])
  }

}
</script>

