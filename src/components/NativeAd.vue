<template>
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div
      @click="adClick"
      :class="{
        'coral-card': template == 2,
        'native-ad-wrapper': template == 1,
        'card-grid-nativeAd': template != 1
      }"
      :id="adId">
    </div>
  </div>
</template>

<script>

export default {
    name:"NativeAd",

    props:{
      sponsored: '',
      zoneKey: '',
      fullWidth: '',
      adId: '',
      template: {
        type: Number,
        default: 1
      },
    },

    components:{},
    
    data(){
        return{
          isAd: false,
          count: 0
        }
    },
    
    mounted(){
      this.runAd();
    },

    watch:{
      refreshAd(val){
        if (val) {
          _bsa.reload('#' + this.adId)
          // set refreshAd to false
          this.$store.commit('setDataToArr', { arr: 'refreshAd', data: false })
        }
      },
      $route(to, from){
        // this.runAd();
      }
    },

    methods:{
      adClick(){
        window.plausible("adClick", {props: {
          path: this.$route.name
        }})
      },

      runAd(){
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
          if (typeof _bsa !== 'undefined' && !parent.isAd) {
            document.getElementById(adId).innerHTML = ''
            _bsa.init('custom', zoneKey, 'placement:macosiconscom', {
              target: '#' + adId,
              template: template
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    computed: {
      // get the getter getRefreshAd
      refreshAd() {
        return this.$store.getters.getRefreshAd
      }

    }
}
</script>

<style>
  .fullWidth .bsa-link{
    width: 100%
  }
</style>