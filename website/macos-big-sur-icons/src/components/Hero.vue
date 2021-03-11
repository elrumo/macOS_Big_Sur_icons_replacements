<template>
<div class="content-wrapper-regular">
  <div id="hero" class="hero-wrapper">

    <!-- <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div> -->
    <div class="hero-text-area" v-if="iconsEmpty">    
        
        <!-- <p class="coral-Body--S desktop-hidden"> -->
        <p class="coral-Body--S m-b-0">
          Hosting by
          <a href="https://fosshost.org/" rel="noopener" target="_blank" class="coral-Link">
              FossHost
          </a> 
        </p>

        <h1
          class="main-heading m-t-0 coral-Heading--XL coral-Heading--regular"
        >
          <span class="f-w-100 f-s-26">macOS Big Sur</span>
          <br />
          Free app icons
        </h1>

        <p class="coral-Body--L w-100 body-text">
            <!-- Sponsor the project on
          <a rel="noopener" class="coral-Link" href="https://github.com/sponsors/elrumo">
            GitHub
          </a>
            and follow its develoment on 
          <a rel="noopener"
            class="coral-Link"
            href="https://twitter.com/elrumo"
            target="_blank"
          >
            Twitter.
          </a> -->
          
          To contribute, download our free templates from the
            <router-link to="/resources">
            <b> resources page. </b>
            </router-link>
        </p>

        <div class="m-auto m-t-35">

          <a rel="noopener"
            class="mobile-hidden p-r-20"
            target="_blank"
            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
            @click="logDonation('hero')"
          >
            <button
              is="coral-button"
              variant="cta"
            >
              <!-- variant="outline" -->
              <span>Donate</span>
            </button>
          </a>

          <div class="d-inline-block mobile-hidden">
            <button
              is="coral-button"
              variant="quiet"
              @click="showDialog(submitIconDialog)"
            >
              <span>Submit icons</span>
            </button>
          </div>

          <div class="d-inline-block desktop-hidden">
            <button
              is="coral-button"
              variant="cta"
              @click="showDialog(submitIconDialog)"
            >
              <span>Submit icons</span>
            </button>
          </div>


          <!-- <span>☕️ Buy me a hot chocolate</span> -->
          <!-- <span>Help keep this site alive</span> -->
          <!-- <span class="p-r-5 f-s-16">☕️</span> <span>Buy me a hot chocolate</span> -->
      
        </div>
    </div>
    
    <img class="hero-img mobile-hidden" :src="imgs.heroImg" alt="">

  </div>
</div>
</template>

<script>
import Sponsor from "./Sponsor.vue";

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
    
    logDonation(location){
      window.plausible("logDonation", {props: {
          location: location, 
      }})
    },

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
