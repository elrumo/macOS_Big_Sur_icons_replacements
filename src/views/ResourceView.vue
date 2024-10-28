<template>
  <div>
    <div class="content-wrapper-compact text-left">
      <!-- Back to all resources -->
      <router-link to="/resources">
        <p class="coral-Detail read-more read-more-left coral-Detail--XL m-t-32 coral-Link">
          {{ getArticleTemplate.backToAllArticles ? getArticleTemplate.backToAllArticles : 'All resources' }}
        </p>
      </router-link>
      
      <!-- Resource Wrappper -->
      <div
        class="resource-content-wrapper"
      >
        <!-- Resource Image -->
        <div class="resource-image">  
          <figure class="post-full-image m-0 coral-Well p-0">
            <img
              v-lazy="{
                  src: getSingleResourceData.feature_image,
                  loading: placeholderImage,
                  error: placeholderImage
              }" 
            />
          </figure>

          <NativeAd
            :template="1"
            class="m-t-24"
            :sponsored="false"
            :key="$route.fullPath + 'ad'"
            adId="CWYDCK3J"
            zoneKey="CWYDCK3J"
          />
        </div>
        
        <!-- Resource Description -->
        <div class="resource-description">

          <h3
            :class="{
              'coral-Heading--L': true,
              'coral-Heading--heavy': true,
              'm-0': true,
              'skeleton-m': getSingleResourceData.title ? false : true,
              'skeleton': getSingleResourceData.title ? false : true
            }"
          >
            {{ getSingleResourceData.title }}
          </h3>        

          <hr class="coral-Divider--S m-t-16 m-b-16">


          <!-- Resource Content -->
          <div
            :class="{
              'coral-Body--M': true,
              'resource-excerpt': true,
              'skeleton-xl': getSingleResourceData.title ? false : true,
              'skeleton': getSingleResourceData.title ? false : true
            }"
            v-html="getSingleResourceData.description"

          >
          </div>

          <p
            :class="{
              'coral-Detail': true,
              'coral-Detail--L': true,
              'text-details': true,
              'p-b-16': true,
            }"
            v-if="getSingleResourceData.resourceUrl"
          >
            {{ getArticleTemplate.downloadResource ? getArticleTemplate.downloadResource : 'Get Template For' }}
          </p>

          <a target="_blank\" class="m-r-8\" :href="getSingleResourceData.resourceUrl" style="text-decoration: none">
            <button class="coral-btn coral-btn-primary\" variant="CTA\">Figma</button>
          </a>
          
          <!-- Download btns wrapper -->
          <div>
            
            <!-- Download btns skeleton -->
            <div 
              v-if="!getSingleResourceData.resourceUrl"
              class="grid-4-col"
            >
              <div
                v-for="n in 2"
                :key="'skeletonBtn-'+n"
                class="skeleton skeleton-xs skeleton-button"
              >
              </div>
            </div>

            <!-- Download btns -->
            <div v-else class="flex-row-grid">
              <a
                v-for="url in getSingleResourceData.resourceUrls"
                :key="'button_'+url.id"
                :href="url.url"
                target="_blank"
                rel="noopener"
              >
                <component
                  :is="'coral-button'"
                  variant="ghost"
                >
                  <span>
                    {{url.platform}}
                  </span>
                </component>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- More resources -->
      <div class="more-resources">
        <h3 class="coral-Heading--L coral-Heading--heavy m-0">
          {{ getArticleTemplate.moreArticles ? getArticleTemplate.moreArticles : 'More resources' }}
        </h3>

        <div class="resources-grid card-grid" id="how-to-install">
          <ResourcesCard
            v-for="resource in getResourcesData" :key="resource.name"
            :step='resource'
            :link="'/resources/'+resource.slug"
          />
          <CarbonAd class="resources-card-container" adId="resourceItem"/>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex';
import localPosts from '@/api/posts.json';
import ResourcesCard from '@/components/ResourcesCard.vue'
import NativeAd from "@/components/NativeAd.vue";
import CarbonAd from '@/components/CarbonAd.vue';

import pages from '@/api/pages.json';
import placeholderImage from "../assets/placeholder-image.gif"

export default {
  name: 'ResourceView',

  components: {
    ResourcesCard,
    NativeAd,
    CarbonAd
  },

  data: function(){
    return {
      placeholderImage: placeholderImage,
      resourceItem: localPosts,
      resourcesData: pages,
      meta: {
        title: ""
      },
      fullUrl: ""
    }
  },

  async mounted(){
    const slug = this.$route.params.resource;
    this.fetchResourceFromSlug(slug)
    this.fetchResourcesHome()
    // await this.fetchArticleTemplate({slug: 'article-resource', state: 'articleTemplate'})
  },

  methods:{
    ...mapActions([
      'adClick',
      'fetchResourcesHome',
      'fetchResourceFromSlug',
      'fetchArticleTemplate'
    ]),

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
    },

    async getPageData(){
      const parent = this;

      parent.showAd = false;
      setTimeout(function () {
        parent.showAd = true;
      }, 200);

      let routerName = this.$router.currentRoute.value.params.resource
      let moreResources = parent.$store.state.moreResources
      let storeResourcesData = parent.resourcesData
      let storeResourceItem = parent.$store.state.singleResourceData
      
      parent.fullUrl = "https://macosicons.com/"+routerName

      for(let post in Object.keys(storeResourcesData)){
        try {
          if (storeResourcesData[post].slug == routerName) {
            parent.resourceItem = storeResourcesData[post];
          }
        } catch (error) {
        }
      }

      // Get all resourcesData to fill "More Resources" component
      parent.resourcesData = await moreResources;

      // Check if blog data has already been fetched, if not, fetch only the blog required
      if (moreResources.length == undefined) {
        const resourceItem = await parent.$store.dispatch('getSinglePageAction', routerName);
        
        // If the blog post requested does not exists, redirect user to main blog page
        if (resourceItem == undefined) { 
          parent.$router.push('/resources')
        }

        // Botched together to get local blog data while real blog is loading. Temporary fix, this will need to be server side rendered.
        for(let post in Object.keys(storeResourceItem)){
          try {
            if (storeResourceItem[post].slug == routerName) {
              parent.resourceItem = storeResourceItem[post];
            }
          } catch (error) {
          }
        }
        
        parent.resourceItem = resourceItem;

      } else{
        // Get individual page from all resources data 
        for(let post in Object.keys(storeResourcesData)){
          try {
            if (storeResourcesData[post].slug == routerName) {
              parent.resourceItem = storeResourcesData[post];
            }
          } catch (error) {
          }
        }
      }
    },

  },

  computed:{
    ...mapGetters([
      'getSingleResourceData',
      'getArticleTemplate',
      'getResourcesData',
    ])
  },

  // metaInfo() {
  //   return {
  //     // if no subcomponents specify a metaInfo.title, this title will be used
  //     title: this.resourceItem.title,
  //     description: this.resourceItem.excerpt,
  //     // all titles will be injected into this template
  //     titleTemplate: '%s | macOSicons',
  //     meta:[
  //       // Facebook
  //       {
  //         property: 'og:url',
  //         vmid:     'og:url',
  //         content:   this.fullUrl,
  //       },
  //       {
  //         property: 'og:title',
  //         vmid:     'og:title',
  //         content:  this.resourceItem.title + ". Over 5000+ free icons for Big Sur.",
  //       },
  //       {
  //         property: 'og:description',
  //         vmid:     'og:description',
  //         content:  this.resourceItem.excerpt + ". Over 5000+ free icons for Big Sur.",
  //       },
  //       {
  //         property: 'og:image',
  //         vmid:     'og:image',
  //         content:  this.resourceItem.feature_image,
  //       },

  //       // Twitter
  //       {
  //         property: 'twitter:url',
  //         vmid:     'twitter:url',
  //         content:   this.fullUrl,
  //       },
  //       {
  //         property: 'twitter:description',
  //         vmid:     'twitter:description',
  //         content:  this.resourceItem.excerpt + ". Over 5000+ free icons for Big Sur.",
  //       },
  //       {
  //         property: 'twitter:title',
  //         vmid:     'twitter:title',
  //         content:  this.resourceItem.title + ". Over 5000+ free icons for Big Sur.",
  //       },
  //       {
  //         property: 'twitter:image',
  //         vmid:     'twitter:image',
  //         content:  this.resourceItem.feature_image,
  //       },
  //     ]
  //   }
  // },

}
</script>

<style lang="scss">
  // @import '@/CSS/blog.less';
  @import '@/CSS/resources-card.scss';
</style>