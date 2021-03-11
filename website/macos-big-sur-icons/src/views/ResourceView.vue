<template>
  <div>
    <div class="content-wrapper-compact text-left">

      <router-link to="/resources">
        <p class="coral-Detail read-more read-more-left coral-Detail--XL m-t-30 coral-Link">
          All Resources
        </p>
      </router-link>

    <div class="resource-content-wrapper">

      <div class="resource-image">  
        <figure class="post-full-image m-0 coral-Well p-0">
          <img :src="resourceItem.feature_image"/>
        </figure>
      </div>

      <div class="resource-description">
        <div>
          <h3 class="coral-Heading--L coral-Heading--heavy m-0">
            {{ resourceItem.title }}
          </h3>        
          <!-- <p class="coral-Detail coral-Detail--L opacity-80 ">
            <span class="coral-Detail--light">
              {{ getDate(resourceItem.published_at) }}
            </span>
          </p> -->
          <hr class="coral-Divider--S m-t-20 m-b-10 m-b-20">
        </div>

        <!-- Resource Content -->
        <p class="coral-Body--M resource-excerpt">{{ resourceItem.excerpt }}</p>
        <div class="blog-post-wrapper post-full-content" id="page-js" v-html="resourceItem.html"></div>

      </div>


    </div>
    <!-- More resources -->
    <div class="moreResources">

      <h3 class="coral-Heading--L coral-Heading--heavy m-0">More resources</h3>

      <div class="resources-grid card-grid" id="how-to-install">
        
        <div v-for="resource in resourcesData" :key="resource.name" @click="getPageData">
          <ResourcesCard
            :step='resource'
            :link="'/resources/'+resource.slug"
          />
        </div>

        <div class="resources-card-ad">
          <div v-if="showAd" class="resources-card-ad">
            <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
          </div>
        </div>

      </div>

    </div>

    </div>
  
  </div>
</template>

<script>
// @ is an alias to /src
import localPosts from '@/api/posts.json';
import ResourcesCard from '@/components/ResourcesCard.vue'

import pages from '@/api/pages.json';

export default {
  name: 'ResourceView',

  components: {
    ResourcesCard
  },

  data: function(){
    return {
      resourceItem: localPosts,
      resourcesData: pages,
      showAd: true
    }
  },

  mounted: async function(){
    let parent = this;

    parent.getPageData()
  },

  methods:{
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

      let routerName = this.$router.currentRoute.params.resource
      let moreResources = parent.$store.state.moreResources
      let storeResourcesData = parent.resourcesData
      let storeResourceItem = parent.$store.state.singleResourceData
      
      console.log("resourcesData: ", await moreResources);

      for(let post in Object.keys(storeResourcesData)){
        try {
          if (storeResourcesData[post].slug == routerName) {
            console.log(storeResourcesData[post].title);
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

        console.log("storeResourceItem: ", storeResourceItem);
        // Botched together to get local blog data while real blog is loading. Temporary fix, this will need to be server side rendered.
        for(let post in Object.keys(storeResourceItem)){
          try {
            if (storeResourceItem[post].slug == routerName) {
              // console.log(storeResourceItem[post].html);
              parent.resourceItem = storeResourceItem[post];
            }
          } catch (error) {
          }
        }
        
        parent.resourceItem = resourceItem;

      } else{
        console.log("Gii");
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
    }
  },

  computed:{
  }
}
</script>

<style lang="less">
  // @import '@/CSS/blog.less';
  @import '@/CSS/resources-card.less';
</style>