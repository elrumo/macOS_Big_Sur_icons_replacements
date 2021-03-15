<template>
<div class="content-wrapper-regular">
  <div id="hero" class="hero-wrapper">

    <!-- <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div> -->
    <div class="hero-text-area" v-if="iconsEmpty">    
        

        <div class="ad-hero">
          <p class="coral-Body--XS p-b-5">
            Sponsored by
          </p>
          <div class="opacity-80" id="iconbar-js"></div>
        </div>

        <p class="coral-Body--S m-b-0 desktop-hidden">
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
          To contribute, download free icon templates from the
            <router-link to="/resources">
            <span class="underline"> resources page. </span>
            </router-link>
        </p>
        

        <div class="m-auto m-t-35">

          <div class="d-inline-block mobile-hidden">
            <button
              is="coral-button"
              variant="cta"
              @click="showDialog(submitIconDialog)"
            >
              <span>Submit icons</span>
            </button>
          </div>

          <a
            rel="noopener"
            class="mobile-hidden p-l-20"
            target="_blank"
            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
            @click="logDonation('hero')"
          >
            <button
              is="coral-button"
              variant="quiet"
            >
              <span>Buy me a coffee</span>
            </button>
          </a>


          <div class="d-inline-block desktop-hidden">
            <button
              is="coral-button"
              variant="cta"
              @click="showDialog(submitIconDialog)"
            >
              <span>Submit icons</span>
            </button>
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

export default {
  name: "Hero",

  components:{
    Sponsor
  },

  data() {
    return {
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

  mounted: function() {
    // let adId = document.getElementById("_custom_")

    (function() {
      if (typeof _bsa !== 'undefined' && _bsa) {
        _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
        {
          target: '#iconbar-js',
          template: `
              <a href="##statlink##" target="_blank" rel="noopener sponsored" class="bsa-link">
              <div class="bsa-icon" style="background-image: url(##image##); background-color: ##backgroundColor##;"></div>
              <div class="bsa-desc">##company## - ##tagline##</div>
              </a>
            `
          }
        );
      }
    })();


  },

  computed: {
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
  transition: 0.3s;
  height: 40px
}

#iconbar-js:hover{
  transform: translateY(-3px);
  opacity: 1;
}

.bsa-link {
  position: relative;
  top: -6px;
  display: inline-flex;
  height: 40px;
  border-radius: 5px;
  background-color: #262729;
  box-shadow: 0 0 1px hsla(220, 4%, 15%, .5);
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
  color: #fff;
  text-decoration: none;
  letter-spacing: .2px;
  font-size: 14px;
  line-height: 1.35;
}

</style>
