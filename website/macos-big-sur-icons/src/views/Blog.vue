<template>
<div>
    <Header/>
    <h2 class="m-t-50" v-for="post in posts" :key="post.title">
      <div class="m-t-50" v-html="post.html"></div>
    </h2>
</div>
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
    
    // smoothscroll.polyfill();

    const posts = await getPosts();
    for(let post in posts){
      console.log(posts[post].title);
    }

    parent.posts = posts;

  },

  computed:{
  }
}
</script>
