<template>
  <div class="gitHub-sponsor" v-if="type == 'heroBanner'">
    <a
      aria-label="Support the project on PayPal"
      target="_blank"
      href="https://www.webbites.io/?utm_source=macOSicons.com&utm_medium=topBanner&utm_campaign=waitlist"
      style="color: black"
    >
    <article class="Box p-3">
      <div class="d-flex">

        <div class="mr-3">
          <!-- :src="getStrapiImg(getHomeDialog.announcementImg)" -->
            <img
              :src="WebBitesLogo"
              class="rounded-1 avatar-user"
              width="48"
              height="48"
              alt="@elrumo"
            />
        </div>

        <div class="d-sm-flex flex-auto">
          
          <div class="flex-sm-auto mr-sm-3">
            <div class="h3 mb-2 f-w-900">
            New project announcement
              <!-- New project announcement -->
            </div>

            <div class="mb-2 f-w-400">
              <p v-html="marked(getHomeDialog.announcement)"></p>
            </div>
          </div>

        </div>
      </div>
    </article>
    </a>
  </div>

  <main class="announcement-top-banner" v-if="type == 'topBanner'">
    <a
      aria-label="Support the project on PayPal"
      target="_blank"
      href="https://www.webbites.io/?utm_source=macOSicons.com&utm_medium=topBanner&utm_campaign=waitlist"
      style="color: black"
      >
      <!-- :href="getHomeDialog.announcementUrl" -->
    <article class="Box">
      <div class="d-flex">

        <!-- :src="getStrapiImg(getHomeDialog.announcementImg)" -->
        <!-- src="https://www.webbites.io/_nuxt/WebBites-Icon.209a5576.png" -->
        <img
          :src="WebBitesLogo"
          class="rounded-1 avatar-user"
          width="38"
          height="38"
          alt="WebBites.io"
        />

        <div class="d-sm-flex flex-auto">
          
          <div class="flex-sm-auto mr-sm-3">
            <div class="h3 mb-2 f-w-900">
            <!-- {{getHomeDialog.announcementTitle}} -->
              <!-- New project announcement -->
            </div>

            <div class="mb-2 f-w-400">
              For the past few months I've been busy working on my biggest project so far, <a href="https://www.webbites.io/?utm_source=macOSicons.com&utm_medium=topBanner&utm_campaign=waitlist">WebBites.io</a>, a new smart bookmarking service powered by AI! I hope you like and let me know what you think on <a href="https://twitter.com/elrumo">Twitter</a>!
              <!-- <vue-markdown :source="getHomeDialog.announcement"/> -->
            </div>
          </div>

        </div>
      </div>
    </article>
    </a>
  </main>

</template>

<script>
import profilePicIcon from "../assets/profilePic.jpg"
import WebBitesLogo from "../assets/webbites-logo-small.png"
import VueMarkdown from 'vue-markdown-render'

export default {
  name: "Announcement",
  data() {
    return {
      gitHub: {
        profile: profilePicIcon,
      },
      WebBitesLogo: WebBitesLogo,
    };
  },

  components:{
    VueMarkdown,
  },

  props:{
    getHomeDialog: {},
    type: {
      type: String,
      default: 'heroBanner',
      }
  },

  methods:{
    showDialog(dialogId, icon){
      let parent = this

      document.getElementById(dialogId).show()
    },

    getStrapiImg(strapi){
      // console.log(strapi);      
      return 'https://api.macosicons.com/'+strapi.data.attributes.url
    }
  }
};
</script>

<style>
@import url("../assets/sponsors-embed-b6c9390efcf556f7abc24c7291e23a35.css");
</style>
