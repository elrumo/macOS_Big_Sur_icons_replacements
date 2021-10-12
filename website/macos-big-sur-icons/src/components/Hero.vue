<template>
<div class="content-wrapper-regular">
  <div id="hero" class="hero-wrapper">

    <!-- <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div> -->
    <div class="hero-text-area" v-if="iconsEmpty">    
        

        <div
          class="ad-hero mobile-hidden"
        >
          <NativeAd
            :adPosition="'Hero Top'"
            :adId="'iconbar-js-hero'"
            :key="$route.fullPath + 'ad' + '_hero'"
          />
        </div>

        <div class="desktop-hidden m-t-20"></div>

        <p class="coral-Body--S m-b-0 p-b-10">
          Hosting by
          <a href="https://fosshost.org/" rel="noopener" target="_blank" class="coral-Link">
              FossHost
          </a> 
        </p>

        <h1
          class="main-heading m-t-0 coral-Heading--XL coral-Heading--regular"
        >
          <span style="display: none;" class="f-w-100 f-s-26">
            macOS Big Sur <span class="coral-Body--XS m-b-0"> &  Monterey </span>
          </span>
          <!-- The Icons Page -->
           macOS App icons
        </h1>

        <p class="coral-Body--L w-100 body-text">
          Download one of our free icon templates from the
            <router-link to="/resources">
            <span class="underline"> resources page.</span>
            </router-link>
        </p>
        

        <div class="m-auto m-t-35">
          
          <!-- Desktop Buttons -->
          <div class="d-inline-block mobile-hidden">
            <button
              v-if="!getUser.isAuth"
              @click="showDialog('loginDialog')"
              is="coral-button"
              variant="cta"
            >
              <span>Sign in/up</span>
            </button>

            <button
              v-else
              is="coral-button"
              variant="cta"
              @click="showDialog(submitIconDialog)"
            >
              <span>Submit icons</span>
            </button>

            <a
              rel="noopener"
              class="p-l-20"
              target="_blank"
              href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
              @click="logDonation('hero')"
            >
              <button
                is="coral-button"
                variant="quiet"
              >
                <span>Donate</span>
              </button>
            </a>

          </div>

          <!-- Mobile Buttons -->
          <div class="d-inline-block desktop-hidden">
            <button
              v-if="!getUser.isAuth"
              @click="showDialog('loginDialog')"
              is="coral-button"
              variant="cta"
            >
              <span>Sign in/up</span>
            </button>

            <button
              v-else
              @click="showDialog(submitIconDialog)"
              is="coral-button"
              variant="cta"
            >
              <span>Submit icons</span>
            </button>

            <a
              rel="noopener"
              class="m-l-20"
              target="_blank"
              href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
              @click="logDonation('header')"
            >
              <button
                  is="coral-button"
                  variant="quiet"
              >
                <span>Donate</span>
              </button>
            </a>
          </div>

        </div>


    </div>
    
    <!-- <div class="mobile-hidden">
      <img class="hero-img" :src="imgs.heroImg" alt="">
    </div> -->

  </div>
</div>
</template>

<script>
import Sponsor from "./Sponsor.vue";
import NativeAd from "./NativeAd.vue";
import { mapGetters } from "vuex";

import Parse from 'parse'

export default {
  name: "Hero",

  components:{
    Sponsor,
    NativeAd
  },

  data() {
    return {
      ad: true,
      // imgs:{
      //   heroImg: require("../assets/icons_hero.jpg")
      // }
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
    },

    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    goToSponsor() {
      window.open("https://github.com/sponsors/elrumo?o=esc", "_blank");
    },
  },

  destroyed: function() {
  },
  
  mounted: function() {
    
  },

  computed: {
    ...mapGetters(["getUser"])
  } 

};
</script>

<style>

.ad-hero{
  padding-bottom: 30px;
}

@media only screen and (max-width: 820px){
  .ad-hero{
    padding-top: 30px;
    padding-bottom: 30px;
  }
}

#iconbar-js{
  height: 42px;
  overflow: hidden;
  transition: 0.3s;
}

#iconbar-js:hover{
  transform: translateY(-3px);
  opacity: 1;
}

.bsa-link {
  border: 1px solid rgba(256, 256, 256, 0.3);
  position: relative;
  /* top: -6px; */
  display: inline-flex;
  height: 40px;
  border-radius: 5px;
  background-color: #262729;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
    Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
  align-items: center;
}

.bsa-icon {
  display: flex;
  box-sizing: border-box;
  padding: 8px;
  width: 40px;
  height: 100%;
  border-radius: 5px 0 0 5px;
  background-position: center;
  background-origin: content-box;
  background-size: cover;
  background-repeat: no-repeat;

  object-fit: contain;
}

.bsa-desc {
  padding: 10px 14px;
  /* color: #fff; */
  text-decoration: none;
  letter-spacing: .2px;
  font-size: 14px;
  line-height: 1.35;
}

</style>
