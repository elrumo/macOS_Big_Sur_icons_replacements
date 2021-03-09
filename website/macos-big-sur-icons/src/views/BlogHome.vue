<template>
  <div>
      <div class="blog-list-wrapper">
        
        <iframe class="subscribe-blog-wrapper" src="https://blog.macosicons.com/blog/#subscribe" frameborder="0"></iframe>

        <div class="m-t-50 post-wrapper" v-for="post in posts" :key="post.title">
          <p class="coral-Detail coral-Detail--L opacity-80">
            {{ getDate(post.published_at) }}
          </p>
        
          <h3 class=" coral-Heading--L coral-Heading--heavy m-t-0">
            {{ post.title }}
          </h3>

          <h3 class=" coral-Heading--S coral-Heading--light m-t-10">
            {{ post.excerpt }}
          </h3>

          <router-link :to="'/blog/'+post.slug">
            <p class="coral-Detail read-more read-more-right coral-Detail--XL m-t-30 coral-Link">
              Read more
            </p>
          </router-link>

          <hr class="coral-Divider--S m-t-40">
        </div>

        <div class="single-ad mobile-ad m-t-50 m-b-50">
          <script async="async" type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&amp;placement=macosiconscom" id="_carbonads_js"></script>
        </div>

      </div>

  </div>
  <!-- <div class="m-t-50" v-html="post.html"></div> -->
</template>

<script>
// @ is an alias to /src
import { getPosts } from '@/api/posts';

import localPosts from '@/api/posts.json';

export default {
  name: 'BlogHome',

  components: {
  },

  data: function(){
    return {
      postsFetched: false,
      posts: localPosts,
    }
  },

  mounted: async function(){
    const parent = this;
    let storeBlogData = parent.$store.state.blogPosts

    if (storeBlogData.length == undefined) {
      const posts = await getPosts();
      parent.$store.commit('pushBlogs', posts)
    }

    parent.posts = parent.$store.state.blogPosts;
    
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