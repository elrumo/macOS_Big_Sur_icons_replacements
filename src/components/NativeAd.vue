<template>
  <div
    :class="{
      'relative': true,
      'coral-card': template == 2,
    }">
    <div :class="{fullWidth: fullWidth, 'mobile-hidden': true}">
      <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
        Sponsored
      </p>

      <div
        @click="adClick"
        :class="{
          'native-ad-wrapper': template == 1,
          'card-grid-nativeAd': template != 1,
          'relative': true
        }"
        :id="adId"
      ></div>    
    </div>
    <a v-if="template == 2" class="card-no-ad" href="https://www.webbites.io" target="_blank">
          <!-- :src="webbitesAd" -->
          <img
              :src="webitesIcon"
              class="ad-banner-image"
              width="38"
              height="38"
              alt="WebBites.io"
          />
          <div class="support-page">
              <p class="coral-Body--S m-0">
                  <b href="https://www.webbites.io/?utm_source=macOSicons.com&utm_medium=topBanner&utm_campaign=waitlist">WebBites.io</b>, a new smart bookmarking service powered by AI.
              </p>
          </div>
        </a>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import webbitesAd from "../assets/WebbitesAd.jpg"
import webitesIcon from "../assets/WebBitesIcon.png"

export default {
    name:"NativeAd",

    props:{
      sponsored: '',
      zoneKey: '',
      fullWidth: '',
      adId: '',
      varToWatch: {
        type: Object,
        default: {}
      },
      template: {
        type: Number,
        default: 1
      },
    },

    components:{},
    
    data(){
        return{
          currentAd: null,
          webbitesAd: webbitesAd,
          webitesIcon: webitesIcon,
        }
    },
    
    mounted(){
      this.runAd();
    },

    watch:{

      varToWatch:{
        handler(val){
          this.refreshAd();
        },
        deep: true
      },

      getDownloads(){
        this.refreshAd();
      },
      
      $route(to, from){
        // this.runAd();
      }
    },

    methods:{

      async refreshAd(){
        // Clean up any existing BSA ads
        if (typeof _bsa !== 'undefined' && _bsa.destroy) {
          _bsa.destroy('#' + this.adId);
        }

        // Clean up DOM
        const adContainer = document.getElementById(this.adId);
        if (adContainer) {
          adContainer.innerHTML = '';
        }

        // Remove any existing custom ad elements
        const existingCustomAds = document.querySelectorAll(`[id="${this.adId}customAd"]`);
        existingCustomAds.forEach(ad => ad.remove());

        // Reset current ad tracking
        this.currentAd = null;

        // Wait a moment before creating new ad
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Run the new ad
        this.runAd();
      },

      adClick(){
        window.plausible("adClick", {props: {
          path: this.$route.name
        }})
      },

      async runAd(){
        let parent = this
        let adId = parent.adId

        const templateCompact = `
                    <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+ adId + `customAd" class="bsa-link coral-card">
                    <div class="bsa-icon" style="background-image: url(##image##); background-color: ##backgroundColor##;"></div>
                    <div class="bsa-desc">##company## - ##tagline##</div>
                    </a>
                  `

        const templateCard = `
                    <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+ adId + `customAd"" class="bsa-link">
                      <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
                        <div class="bsa-icon" style="background-image: url(##logo##);"></div>
                      </div>
                      <div class="text-ad-wrapper">
                        <img style="background: ##backgroundColor##" src="##image##">
                        <div class="bsa-desc">##description##</div>
                      </div>
                    </a>
                  `

        let template = this.template == 1 ? templateCompact : templateCard
        let zoneKey = this.zoneKey;

        try {
          if (typeof _bsa !== 'undefined' && !parent.currentAd) {
            const adContainer = document.getElementById(adId);
            if (adContainer) {
              // Ensure container is empty
              adContainer.innerHTML = '';
              
              // Initialize new ad
              _bsa.init('custom', zoneKey, 'placement:macosiconscom', {
                target: '#' + adId,
                template: template
              });

              // Check if ad was successfully loaded
              await new Promise((resolve) => setTimeout(resolve, 500));
              const adElement = document.querySelector(`#${adId} .bsa-link`);
              if (adElement) {
                // Track current ad
                parent.currentAd = adElement;
              }
            }
          }
        } catch (error) {
          console.log('Ad load failed:', error);
        }
      }
    },

    computed: {
      ...mapGetters(['getDownloads'])
    }
}
</script>

<style>
  .fullWidth .bsa-link{
    width: 100%
  }
</style>
