<template>
  <main>
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
  </main>
</template>

<script>
import profilePicIcon from "../assets/profilePic.jpg"
import Marked from 'marked';

export default {
  name: "Sponsor",
  data() {
    return {
      gitHub: {
        profile: profilePicIcon,
      },
    };
  },

  props:{
    getHomeDialog: {}
  },

  methods:{
    showDialog(dialogId, icon){
      let parent = this

      document.getElementById(dialogId).show()
    },

    marked(content){
      try {
        return Marked(content);
      } catch (error) {
        return content;
      }
    },

    getStrapiImg(strapi){
      return 'https://api.macosicons.com/'+strapi.data.attributes.url
    }
  }
};
</script>

<style>
@import url("../assets/sponsors-embed-b6c9390efcf556f7abc24c7291e23a35.css");
</style>
