<template>
  <div class="content-wrapper-compact">
    
    <main class="blog-list-wrapper">

      <!-- Header -->
      <div class="p-t-48 p-t-48">
        
        <!-- Back to all resources -->
        <router-link to="/learn">
          <p class="coral-Detail read-more read-more-left coral-Detail--XL m-t-32 coral-Link">
            All learning resources
          </p>
        </router-link>
        
        <!-- Title -->
        <h3 class="coral-Heading--XXL coral-Heading--heavy">
          {{ getSingleTutorial.title }}
        </h3>

        <!-- Description -->
        <p class="coral-Body--XL">
          {{ getSingleTutorial.description }}
        </p>
        
        <hr class="coral-Divider--S m-t-24 m-b-8">
        
        <!-- Date -->
        <p class="coral-Detail coral-Detail--L opacity-80 m-b-32 m-l-8">
          <span class="coral-Detail--light">
            {{ getDate(getSingleTutorial.publishedAt) }}
          </span>
        </p>

        <!-- Video -->
        <figure
          v-if="getSingleTutorial.video"
          class="post-full-image"
        >
            <!-- :src="getSingleTutorial.url" -->
          <iframe
            width="100%" 
            height="515" 
            :src="getVideoUrl"
            title="YouTube video player"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </figure>

        <!-- Image -->
        <figure v-else class="post-full-image">
          <img
            :src="getSingleTutorial.feature_image"
            width="100%" 
            title="YouTube video player"
          />
        </figure>
      </div>

      <!-- Content -->
      <div
        class="blog-post-wrapper post-full-content"
        v-html="markItDown(getSingleTutorial.tutorial_content)"
      ></div>

      <!-- About macOSicons -->
      <!-- <section class="p-t-32 m-b-48 p-b-40">
        <div class="">
          <hr class="coral-Divider--S">
        </div>
    
        <H3-Description
          class="p-t-8 p-b-48"
          :text="subscribe"
        />
      
        <div class="">
          <hr class="coral-Divider--S">
        </div>
      </section> -->
    </main>
    
    <div class="moreResources p-t-48 m-t-48">
      <h3 class="text-left coral-Heading--L coral-Heading--heavy m-0">
        More learning resources
      </h3>
      <div class="resources-grid text-left card-grid">
        <ResourcesCard
          v-for="tutorial in tutorials"
          :key="tutorial.id"
          :step='tutorial'
          :link="'/learn/'+tutorial.slug"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex'
import Header from '@/components/Header.vue'
import ResourcesCard from '@/components/ResourcesCard.vue'
import NativeAd from '@/components/NativeAd.vue'
import H3Description from '@/components/H3_Description.vue'

import Marked from 'marked';
import axios from 'axios'

export default {
  name: 'learningResource',
  
  components: {
    Header,
    ResourcesCard,
    NativeAd,
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
      tutorials: {},
      resource: {},
      subscribe:{
        h3: "macOSicons.com",
        description: "Hi! I'm Elias, and I'm building an open platform for all things icons, where you can [download](https://macosicons.com) thousands of macOS ready icons, [resources](https://macosicons.com/resources) and [learn](https://macosicons.com/learn) how to make them.",
        isAd: false,
        isCenter: true,
        isButton: true
      },
    }
  },
  
  mounted: async function(){
    const slug = this.$route.params.learningResource;    
    await this.getTutorialFromSlug(slug)
    
    let isError = this.getSingleTutorial.error
    if(isError) this.$router.push('/learn');
  },

  methods: {
    ...mapActions([
      'getPageData',
      'adClick',
      'getTutorialFromSlug'
    ]),

    markItDown(text){
      if(text){
        return Marked(text)
      }
    },

    getDate(dateString){
      // var date = dateString;
      let date = new Date(dateString);
      var monthDate = date.getDate();
      var year = date.getUTCFullYear();

      let weekDay = date.getUTCDay()
      switch (weekDay) {
        case 0:
          weekDay = "Monday"
          break;
        case 1:
          weekDay = "Tuesday"
          break;
        case 2:
          weekDay = "Wendesday"
          break;
        case 3:
          weekDay = "Thursday"
          break;
        case 4:
          weekDay = "Friday"
          break;
        case 5:
          weekDay = "Saturday"
          break;
        case 6:
          weekDay = "Sunday"
          break;
          
        default:
          break;
      }
      
      let month = date.getUTCMonth();
      switch (month) {
        case 0:
          month = "Jan"
          break;
        case 1:
          month = "Feb"
          break;
        case 2:
          month = "March"
          break;
        case 3:
          month = "Apr"
          break;
        case 4:
          month = "May"
          break;
        case 5:
          month = "Jun"
          break;
        case 6:
          month = "Jul"
          break;
        case 7:
          month = "Aug"
          break;
        case 8:
          month = "Sep"
          break;
        case 9:
          month = "Oct"
          break;
        case 10:
          month = "Nov"
          break;
        case 11:
          month = "Dec"
          break;
          
        default:
          break;
      }
      // var date = new Date(dateString);
      return month + " " + monthDate + ', ' + year
    }
  },

  computed:{
    ...mapGetters([
      'getSingleTutorial'
    ]),

    getVideoUrl(){
      let url = this.getSingleTutorial.video
      url = url.substring(url.indexOf('?') + 3)
      return 'https://www.youtube.com/embed/'+url
    },

  }
}
</script>

