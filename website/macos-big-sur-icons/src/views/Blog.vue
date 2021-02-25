<template>
  <div>
      <Header/>
      
      <div class="blog-list-wrapper">

        <div class="m-t-50 post-wrapper" v-for="post in posts" :key="post.title">
 
          <p class="coral-Detail coral-Detail--L opacity-80">
            {{ getDate(post.published_at) }}
          </p>
        
          <h3 class=" coral-Heading--L m-t-0">
            {{ post.title }}
          </h3>

          <h3 class=" coral-Heading--S coral-Heading--light m-t-10">
            {{ post.excerpt }}
          </h3>

          <a href="">
            <p class="coral-Detail coral-Detail--XL m-t-30">
              Read more
            </p>
          </a>

          <hr class="coral-Divider--S m-t-40">

        </div>

      </div>
  </div>
  <!-- <div class="m-t-50" v-html="post.html"></div> -->
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import { getPosts } from '@/api/posts';

import smoothscroll from 'smoothscroll-polyfill';

export default {
  name: 'Blog',

  components: {
    Header
  },

  data: function(){
    return {
      posts: {}
    }
  },

  mounted: async function(){
    const parent = this;
    const posts = await getPosts();

    for(let post in posts){
      console.log(posts[post].title);
    }

    parent.posts = posts;
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

<style>

  .blog-list-wrapper{
    width: var(--page-width);
    margin: auto;
    max-width: 640px;
    text-align: left;
  }

  /* .post-wrapper{
    padding: 20px;
    transition: 0.2s;
  }
  .post-wrapper:hover{
    box-shadow: 0px 10px 50px -5px rgb(0 0 0 / 30%);
    border-radius: 4px;
    transform: translateY(-5px);
    cursor: pointer;
  } */

</style>