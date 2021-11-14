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
// @ is an alias to /src
import { mapActions } from 'vuex'
import Header from '@/components/Header.vue'
import ResourcesCard from '@/components/ResourcesCard.vue'
import Footer from '@/components/Footer.vue'
import H3Description from '@/components/H3_Description.vue'

import axios from 'axios'

import pages from '@/api/pages.json';


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
      isMobile: this.$isMobile(),
      introText:{
        h3: "Tutorials",
        description: "More tutorials on everything macOS icons coming soon. If you’d like to contribute or make suggestions, let us know on our [Discord](https://discord.gg/f4mTRyyTkT) channel or [Twitter](https://twitter.com/elrumo).",
        isAd: false,
        isCenter: true,
      },
      resourcesData: [
        {
          feature_image: "https://i.imgur.com/gKriWTY.jpg",
          title: "Introduction to macOS icon design",
          description: "Learn how to designicons for macOS in Photoshop",
        },
        {
          feature_image: "https://i.imgur.com/ScAgHYI.jpg",
          title: "More coming soon",
          description: "If you’d like to contribute or make suggestions, let us know on our Discord channel or Twitter.",
        }
      ],
      tutorials: {},
    }
  },
  
  mounted: async function(){
    const parent = this;
    let learningHome, tutorials, user
    
    try {
      user = await axios.post('http://localhost:1347/auth/local',{
          identifier: 'elias.ruiz.monserrat@gmail.com',
          password: 'xN7SE48hXYNfn6J',
      })
    } catch (error) {
      console.log("Error getting user data: ", error);
    }
    
    try {
      learningHome = await axios.get('http://localhost:1347/learn',{
        headers: {
          Authorization:'Bearer ' + user.data.jwt
        }
      })
      
      parent.introText = {
        h3: learningHome.data.title,
        description: learningHome.data.description,
        isAd: false,
        isCenter: true,
      }
    } catch (error) {
      console.log("Error getting learning page data: ", error);
    }

    try {
      tutorials = await axios.get('http://localhost:1347/tutorials')
      parent.tutorials = tutorials.data
    } catch (error) {
      console.log("Error getting tutorials: ", error);
    }

  },

  methods: {
    ...mapActions([
      'getPageData',
      'adClick'
    ]),

    async getPages(){
      console.log(this.getPageData);
    }
  }

}
</script>

<style>
</style>
