<template>
  
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div
      @click="adClick"
      :class="{
        'coral-card': true,
        'native-ad-wrapper': template == 1,
        'card-grid-nativeAd': template != 1
      }"
      :id="adId"
    >
        <!-- template == 1 ? 'native-ad-wrapper': 'card-grid-nativeAd', -->
    </div>
  </div>
 <!-- <div
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
  </div> -->
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
      isAd: false,
    }
  },

  props: {
    adId: String,
    template: {
      type: Number,
      default: 1
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    sponsored: {
      type: Boolean,
      default: false,
    }
  },

  mounted() {
    let parent = this
    var adId = parent.adId

    const templateCompact =  `
                <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+adId+`customAd" class="bsa-link coral-card">
                <div class="bsa-icon" style="background-image: url(##image##); background-color: ##backgroundColor##;"></div>
                <div class="bsa-desc">##company## - ##tagline##</div>
                </a>
              `

    const templateCard =  `
                <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+adId+`customAd"" class="bsa-link">
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

    function getAd(el){
      try {
        if (typeof _bsa !== 'undefined' && !parent.isAd ) {
          document.getElementById(adId).innerHTML = ''
          // el.innerHTML = ''
          _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
          {
            target: '#'+adId,
            template: template
            }
          );
        }
      } catch (error) {
        console.log('BSA ad initialization error:', error);
      }
    }

    getAd()

    var attempts = 0       

    function adExist(){
      var adExists

      setTimeout(() => {
        try {
          adExists = document.getElementById(adId).children.length
        } catch (error) {
        }

        // console.log(document.getElementById(adId).children.length);

        if (adExists > 0 || attempts >= 25) return;
        // if (attempts >= 25) return;
        if (adExists == 0) {
          try {
            attempts++
            adExist()
            getAd()
          } catch (error) {
            attempts++
            adExist()
            getAd()
            parent.isAd = false
          }
        } else return

      }, 800);
    }

    let el = document.getElementById(adId+"customAd")

    window.BSANativeCallback = (a) => {
      const total = a.ads.length;
      if (!total) {
        getAd(el)
        parent.isAd = true
      }
    }

    if (!parent.isAd) {
        // // console.log(parent.isAd);
        // setTimeout(() =>{
        //   if (!_bsa.exists(el)) {
        //     getAd(el)
        //   }
        // }, 500)
        try {
          adExist()
        } catch (error) {
        }
    }

    setTimeout(() =>{
      try {
        let nodeList = document.querySelector("#"+adId).children
        
        for(let el in nodeList){
          let newNodeList = document.querySelector("#"+adId).children

          if(newNodeList.length > 1){
            el.parentNode.removeChild(el);
          } else{
            return
          }

        };
      } catch (error) {
        
      }
    }, 100)

    function runAd() {
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
