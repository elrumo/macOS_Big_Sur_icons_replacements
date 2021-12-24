<template>
  <div>
    <main class="content-wrapper-compact">

      <H3-Description
        :text="getLearningHome"
        class="m-b-48 p-b-8 p-t-48"
      />

      <div class="resources-grid card-grid m-t-48" id="how-to-install">
        <!-- {{getLearningResources}} -->
        <coral-wait
          v-if="getLearningResources.length == 0"
          class="m-auto"
          size="L"
          indeterminate=""
        />

        <ResourcesCard
          v-for="tutorial in getLearningResources"
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
import H3Description from '@/components/H3Description.vue'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex';

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
    }
  },
  
  mounted: async function(){
    this.fetchLearningResources()
    this.fetchLearningHome()
  },

  methods: {
    ...mapActions([
      'fetchLearningResources',
      'fetchLearningHome',
    ]),
  },

  computed: {
    ...mapGetters([
      'getLearningResources',
      'getLearningHome',
    ]),
  },

}
</script>

<style>
</style>
