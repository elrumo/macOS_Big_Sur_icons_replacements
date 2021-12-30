<template>
  
 <div
    style="min-height: 145px; max-height:280px"
    class="card-hover relative coral-card"
  >
    <div
      style="z-index: 2"
      :class="['absolute', 'card-grid-nativeAd', 'bsa-cpc', adId]"
      @click="adClick({position: 'Icon Grid Top', type: 'Native'})"
    ></div>
    
    <div class="support-page card-no-ad relative">
      <h3 class="coral-Heading--S m-0">
        Support this page
      </h3>
      <div v-html="getSupportMessage">
      </div>
    </div>
  </div>
</template>

<script>

import Sponsor from "./Sponsor.vue";
import NativeAd from "./NativeAd.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "CarbonAd",

  components:{
    Sponsor,
    NativeAd
  },

  data() {
    return {
    }
  },

  props: {
    adId: String
  },

  mounted() {
    const scriptId = 'bsa-cpc-script';
    const elId = this.adId
    const parentEl = document.querySelector('.'+elId);
  
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = '//m.servedby-buysellads.com/monetization.js'
      document.head.appendChild(script)
      script.onload = () => {
        try {
          load(parentEl)
        } catch (error) {
        }
      }
    } else {
        try {
          load(parentEl)
        } catch (error) {
        }
    }

    function load(el) {
      if (typeof _bsa !== 'undefined' && _bsa) {
        // cleanup any existing ad to avoid them stacking
        el.innerHTML = ''
        _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom', {
          target: '.'+elId,
          // target: '.'+elId,
          // target: '.bsa-cpc',
            // <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd"" class="bsa-link">
          template: `
            <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+elId+`customAd"" class="bsa-link">
              <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
                <div class="bsa-icon" style="background-image: url(##logo##);"></div>
              </div>
              <div class="text-ad-wrapper">
                <img style="background: ##backgroundColor##" src="##image##">
                <div class="bsa-desc">##description##</div>
              </div>
            </a>
          `
        })
      } else{
        console.log("no bsa");
      }
    }



  },

  methods:{ 
    ...mapActions([
      'adClick',
    ]),

  },

  computed: {
    ...mapGetters([
      "getSupportMessage"
    ])
  } 
};

</script>


<style>
</style>
