<template>
  <div>
    <main class="content-wrapper-compact">

      <H3-Description
        :text="introText"
        class="m-b-48 p-b-8 p-t-48"
      />

      <div class="resources-grid card-grid" id="how-to-install">

        <ResourcesCard
          v-for="tutorial in tutorials"
          :key="tutorial.id"
          :step='tutorial'
          :link="'/learn/'+tutorial.slug"
        />

      </div>

    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ResourcesCard from '@/components/ResourcesCard.vue'
import Footer from '@/components/Footer.vue'
import H3Description from '@/components/H3_Description.vue'

import axios from 'axios'

export default {
  name: 'Learn',
  
  components: {
    Header,
    ResourcesCard,
    Footer,
    H3Description
  },

  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Free icon templates resources for macOS Monterey, Big Sur.',
      description:"Resources and templates to help you design and showcase icons for macOS.",
      // all titles will be injected into this template
      titleTemplate: 'Learning resources | macOSicons',
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
      introText:{
        h3: "Tutorials",
        description: "More tutorials on everything macOS icons coming soon. If you’d like to contribute or make suggestions, let us know on our [Discord](https://discord.gg/f4mTRyyTkT) channel or [Twitter](https://twitter.com/elrumo).",
        isAd: false,
        isCenter: true,
      },
      tutorials: {},
    }
  },
  
  mounted: async function(){
    const parent = this;
    
    // Tutorials homepage
    try {
      let learningHome = await axios.get('https://api.macosicons.com/home-page')

      parent.introText = {
        h3: learningHome.data.title,
        description: learningHome.data.intro_text,
        isAd: false,
        isCenter: true,
      }
    } catch (error) {
      console.log("Error getting learning page data: ", error);
    }
    
    // Tutorials
    try {
      let tutorials = await axios.get('https://api.macosicons.com/tutorials')
      // Set image from array to object
      for(let tutorial in tutorials.data){
        tutorials.data[tutorial].feature_image = 'https://api.macosicons.com/'+tutorials.data[tutorial].feature_image[0].formats.medium.url
      }
      parent.tutorials = tutorials.data
    } catch (error) {
      console.log("Error getting tutorials: ", error);
    }

  },

  methods: {
  }

}
</script>

<style>
</style>
