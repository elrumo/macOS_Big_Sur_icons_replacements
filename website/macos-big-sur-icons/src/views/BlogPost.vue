<template>
  <div>
      <Header/>
      
      <div class="blog-list-wrapper">
        
        <div class="blog-intro-wrapper">
          <router-link to="/blog">
            <p class="coral-Detail read-more read-more-left coral-Detail--XL m-t-30 coral-Link">
              All Posts
            </p>
          </router-link>

          <h3 class="coral-Heading--XXL coral-Heading--heavy">{{ blogPost.title }}</h3>

          <p class="coral-Body--XL">{{ blogPost.excerpt }}</p>
          
          <hr class="coral-Divider--S m-t-20 m-b-10">

          <p class="coral-Detail coral-Detail--L opacity-80 m-b-50 m-l-10">
            <span class="coral-Detail--light">
              {{ getDate(blogPost.published_at) }}
            </span>
            <span class="m-l-5 m-r-5">•</span>
            <span class="coral-Detail--light">
              {{ blogPost.reading_time }} Min Read
            </span>
          </p>
          
          <figure class="post-full-image">
            <img :src="blogPost.feature_image"/>
          </figure>
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
        </div>

        <div class="blog-post-wrapper post-full-content" v-html="blogPost.html"> </div>
      
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import { getBlogPost } from '@/api/posts';

import smoothscroll from 'smoothscroll-polyfill';

export default {
  name: 'BlogPost',

  components: {
    Header
  },

  data: function(){
    return {
      blogPost: {}
    }
  },

  mounted: async function(){
    const parent = this;

    let routerName = this.$router.currentRoute.params.post

    const blogPost = await getBlogPost(routerName);
    parent.blogPost = blogPost;



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
    }
  },

  computed:{
  }
}
</script>

<style lang="less">
  @import '@/CSS/blog.less';
</style>