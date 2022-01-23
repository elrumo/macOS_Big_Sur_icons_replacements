<template>
  <div class="content-wrapper-compact">
    
    <main class="blog-list-wrapper">

      <!-- Header -->
      <div class="p-t-48 p-t-48">
        
        <div class="article-entry">
          <!-- Back to all resources -->
          <router-link to="/learn">
            <p
              :class="{
                'coral-Link': true,
                'coral-Detail': true,
                'read-more': true,
                'read-more-left': getArticleTemplate.backToAllArticles ? true : false,
                'coral-Detail--XL': true,
                'm-t-32': true,
                'skeleton': getArticleTemplate.backToAllArticles ? false : true,
                'skeleton-xxs': getArticleTemplate.backToAllArticles ? false : true
              }"
            >
              {{getArticleTemplate.backToAllArticles}}
            </p>
          </router-link>
          
          <!-- Title -->
          <h3
            :class="{
              'coral-Heading--XXL': true,
              'coral-Heading--heavy': true,
              'm-t-16': true,
              'skeleton': isSkeleton(getSingleTutorial.title),
            }"
          >
            {{ getSingleTutorial.title }}
          </h3>

          <!-- Description -->
          <p
            :class="{
              'coral-Body--XL': true,
              'skeleton': isSkeleton(getSingleTutorial.description),
            }"
          >
            {{ getSingleTutorial.description }}
          </p>
          
          <hr class="coral-Divider--S m-t-4 m-b-12">
          
          <!-- Date -->
            <WrittenBy
              :article="getSingleTutorial"
              :size="'L'"
              :showDate="true"
            />
              <!-- 'skeleton': isSkeleton(getSingleTutorial.description) -->

        </div>

        <!-- Video -->
        <div class="content-image-container">
          <figure
            v-if="getSingleTutorial.video"
            class="post-full-image"
          >
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
              v-lazy="{
                  src: getSingleTutorial.feature_image ? getSingleTutorial.feature_image : coralIcons.placeholderImage,
                  loading: coralIcons.placeholderImage,
                  error: coralIcons.placeholderImage
              }" 
            />
          </figure>
        </div>
      </div>

      <!-- Content -->
      <div class="post-full-content">
        <div
          v-html="markItDown(getSingleTutorial.tutorialBody)"
          class="blog-post-wrapper"
        ></div>

        <WrittenBy
          class="p-t-16"
          :article="getSingleTutorial"
          :size="'XL'"
          :showDate="false"
        />
      </div>
      
    </main>

    <!-- About macOSicons -->
    <AboutBlock
      :text="setProp(getArticleTemplate.aboutBlock)"
    />

      <div class="p-t-24 p-b-24">
        <hr class="coral-Divider--S">
      </div>
    
      <!-- v-if="getArticleTemplate.moreArticles" -->
    <div class="more-resources more-resources-list post-full-content">
      <h3
        :class="{
          'text-left': true,
          'coral-Heading--L': true,
          'coral-Heading--heavy': true,
          'm-0': true,
          'skeleton': isSkeleton(getArticleTemplate.moreArticles)
        }"
      >
        {{getArticleTemplate.moreArticles}}
      </h3>

      <div class="resources-grid text-left card-grid">
        <coral-wait
          v-if="getLearningResources.length == 0"
          class="m-auto p-t-16"
          size="L"
          indeterminate=""
        />
        <ResourcesCard
          v-for="tutorial in getLearningResources.slice(0,5)"
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
import H3Description from '@/components/H3Description.vue'
import WrittenBy from '@/components/WrittenBy.vue'
import AboutBlock from '@/components/AboutBlock.vue'

import Marked from 'marked';

import placeholderCoralIcon from "../assets/placeholder-icon.png"
import placeholderImage from "../assets/placeholder-image.gif"

// import {Button} from '@adobe/coral-spectrum/coral-component-button';

export default {
  name: 'learningResource',
  
  components: {
    Header,
    ResourcesCard,
    NativeAd,
    H3Description,
    WrittenBy,
    AboutBlock
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

      coralIcons:{
          loading: placeholderCoralIcon,
          placeholderImage: placeholderImage,
      },

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
    await this.fetchArticleTemplate({slug: 'article-learn', state: 'articleTemplate'})
    this.fetchLearningResources()
  },

  methods: {
    ...mapActions([
      'fetchLearningResources',
      'getPageData',
      'adClick',
      'getTutorialFromSlug',
      'fetchArticleTemplate',
    ]),

    setProp(data){
      return data ? data : {} 
    },

    markItDown(text){
      if(text){
        return Marked(text)
      }
    },

    isSkeleton(obj){
      try{
        return obj.length > 0 ? false : true
      }catch(e){
        return true;
      }
    },

    isSingleAuthor(id){
      let tutorial = this.getSingleTutorial.by.data

      let pos = tutorial.map(e => {
        return e.id;
      }).indexOf(id);
      
      if(tutorial[pos + 1] == undefined){
        return ''
      } else {
        return ' &'
      }
    },
  },

  computed:{
    ...mapGetters([
      'getSingleTutorial',
      'getLearningResources',
      'getArticleTemplate'
    ]),

    getVideoUrl(){
      let url = this.getSingleTutorial.video
      url = url.substring(url.indexOf('?') + 3)
      return 'https://www.youtube.com/embed/'+url
    },

  }
}
</script>

