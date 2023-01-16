<template>
  <div class="gitHub-sponsor" v-if="type == 'heroBanner'">
    <a
      aria-label="Support the project on PayPal"
      target="_blank"
      :href="getHomeDialog.announcementUrl"
      style="color: black"
    >
    <article class="Box p-3">
      <div class="d-flex">

        <div class="mr-3">
          <!-- :src="gitHub.profile" -->
            <img
              :src="getStrapiImg(getHomeDialog.announcementImg)"
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
      :href="getHomeDialog.announcementUrl"
      style="color: black"
    >
    <article class="Box">
      <div class="d-flex">

        <img
          :src="getStrapiImg(getHomeDialog.announcementImg)"
          class="rounded-1 avatar-user"
          width="48"
          height="48"
          alt="@elrumo"
        />

        <div class="d-sm-flex flex-auto">
          
          <div class="flex-sm-auto mr-sm-3">
            <div class="h3 mb-2 f-w-900">
            {{getHomeDialog.announcementTitle}}
              <!-- New project announcement -->
            </div>

            <div class="mb-2 f-w-400">
              <vue-markdown :source="getHomeDialog.announcement"/>
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
import VueMarkdown from 'vue-markdown-render'

export default {
  name: "Announcement",
  data() {
    return {
      gitHub: {
        profile: profilePicIcon,
      },
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
