<template>
<div class="content-wrapper">
  <div id="hero" class="hero-wrapper">

    <!-- <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div> -->
  
    <div class="hero-text-area" v-if="iconsEmpty">    
        <h3
          class="main-heading m-t-0 p-t-20 coral-Heading--XL coral-Heading--regular"
        >
          <span class="f-w-100 f-s-26">macOS Big Sur</span>
          <br />
          Replacement Icons
        </h3>

        <p class="coral-Body--L w-100 body-text p-t-20">
            Sponsor the project on
          <a class="coral-Link" href="https://github.com/sponsors/elrumo">
          GitHub
          </a>
          and follow the develoment on 
          <a
            class="coral-Link"
            href="https://twitter.com/elrumo"
            target="_blank"
          >
            <b>Twitter.</b>
          </a>
          <!-- </a>
          or visit the
          <a
            class="coral-Link"
            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements"
            target="_blank"
          >
            GitHub
          </a>
          page. -->
          <!-- <br><br> -->
          To contribute and make new icons, use these templates:
          <a
            class="coral-Link"
            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.sketch"
            @click="updateCount('cftvIOYXek')"
          >
          <!-- <a
            class="coral-Link"
            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.sketch"
            @click="updateCount('cftvIOYXek')"
          > -->
            Sketch,
          </a>
          <a
            class="coral-Link"
            href="https://www.figma.com/community/file/930870327989917713/MacOS-Big-Sur-icon-template"
            @click="updateCount('ecCJEYIUyF')"
          >
            Figma,
          </a>
          <a
            class="coral-Link"
            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.ai"
            @click="updateCount('fu7UfKs2zz')"
          >
            Illustrator,
          </a>
          or
          <a
            class="coral-Link"
            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.psd"
          >
            Photoshop
          </a>.
        </p>

        <!-- <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
            GitHub
          </a> -->

        <div class="m-auto m-t-35">
          <div class="d-inline-block">
            <button
              is="coral-button"
              variant="cta"
              @click="showDialog(submitIconDialog)"
            >
              <span>Contribute</span>
            </button>
          </div>

          <!-- <a class="p-l-20" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
              <button  is="coral-button" variant="quiet">
                <span>GitHub</span>
              </button>
            </a> -->

            <!-- href="https://ko-fi.com/I3I63CFCN" -->
            <!-- href="https://www.buymeacoffee.com/elrumo" -->
          <a
            class="p-l-20"
            target="_blank"
            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
          >
            <button is="coral-button" variant="quiet">
              <!-- <span>☕️ Buy me a hot chocolate</span> -->
              <!-- <span class="p-r-5 f-s-16">☕️</span> <span>Buy me a hot chocolate</span> -->
              <span>Donate</span>
              <!-- <span>Help keep this site alive</span> -->
            </button>
          </a>

          <!-- <div class="p-l-20 d-inline-block">
              <button is="coral-button" variant="quiet" @click="showDialog(submitIconDialog)" >
                <span>GitHub</span>
              </button>
            </div> -->
        </div>
    </div>
    
    <img class="hero-img" :src="imgs.heroImg" alt="">

  </div>
</div>
</template>

<script>
import Sponsor from "./Sponsor.vue";

// import Parse from 'parse'
// import dotenv from 'dotenv'; // Used to access env varaibles
// dotenv.config()

// const VUE_APP_PARSE_APP_ID = process.env.VUE_APP_PARSE_APP_ID
// const VUE_APP_PARSE_JAVASCRIPT_KEY = process.env.VUE_APP_PARSE_JAVASCRIPT_KEY
// const VUE_APP_PARSE_MASTERKEY = process.env.VUE_APP_PARSE_MASTERKEY

// Parse.initialize(VUE_APP_PARSE_APP_ID, VUE_APP_PARSE_JAVASCRIPT_KEY)
// Parse.serverURL = 'https://onionicons.com/parse'

// var Icons = Parse.Object.extend("Icons");
// var icons = new Icons();

export default {
  name: "Hero",

  components:{
    Sponsor
  },

  data() {
    return {
      imgs:{
        heroImg: require("../assets/icons_hero.jpg")
      }
    };
  },

  props: {
    list: {},
    submitIconDialog: String,
    iconListLen: 0,
    iconsEmpty: Boolean,
    parseObj: {},
  },

  methods: {

    async updateCount(id){
      let parent = this;

      let Icons = await parent.parseObj

      let query = new Icons.Query(Icons)
      let docToUpdate = await query.get(id)

      docToUpdate.increment("downloads")
      docToUpdate.save().then(() => {
        console.log("Saved!!");
      }).catch((e) => {
        console.log("error: ", e);
      })
    },

    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    goToSponsor() {
      window.open("https://github.com/sponsors/elrumo?o=esc", "_blank");
    },
  },

  mounted: function() {},

  computed: {
  }

};
</script>

<style>
</style>
