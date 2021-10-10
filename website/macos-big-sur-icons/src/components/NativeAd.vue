<template>
<!-- <div id="native-js" class="banner-01"></div> -->
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div
      @click="adClick({position: adPosition, type: 'Native'})"
      class="native-ad-wrapper"
      :id="adId"
    >
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name:"NativeAd",

    props:{
      sponsored:'',
      fullWidth:'',
      adId: '',
      adPosition: ''
    },

    components:{},
    
    data(){
        return{
          isAd: false,
        }
    },
    
    mounted: function(){
      let parent = this
      
      var adId = parent.adId
      
      this.$nextTick(function () {
        getAd()
      })


      function getAd(el){
        try {
          // if (typeof _bsa !== 'undefined' && _bsa) {
          //   _bsa.init('custom', 'CVADC53U', 'placement:SITENAME',
          //   { 
          //     target: '.banner-01',
          //     template: `
          //       <a href="##link##" class="native-banner" style="background: ##backgroundColor##">
          //       <img class="native-img" src="##logo##">
          //         <div class="native-details" style="color: ##textColor##">
          //           <span class="native-company">Sponsored by ##company##</span>
          //           <span class="native-desc">##description##</span>
          //         </div>
          //         <span class="native-cta" style="color: ##ctaTextColor##; background-color: ##ctaBackgroundColor##">##callToAction##</span>
          //         </a>
          //       `,
          //     });  }

            // <a href="##statlink##" target="_blank" rel="noopener sponsored" id="`+adId+`customAd" class="bsa-link coral-card">
          if (typeof _bsa !== 'undefined' && _bsa) {
            _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
            {
              target: '#'+adId,
              template: `
                  <a href="##link##" target="_blank" rel="noopener sponsored" id="`+adId+`customAd" class="bsa-link coral-card">
                  <div class="bsa-icon" style="background-image: url(##image##); background-color: ##backgroundColor##;"></div>
                  <div class="bsa-desc">##company## - ##tagline##</div>
                  </a>
                `
              }
            );
          }
        } catch (error) {
        }
      }      

      var attempts = 0       
      function adExist(){
        var adExists = document.getElementById(adId).children.length
        console.log();
        setTimeout(() => {
          if (attempts >= 15) return;
          if (adExists == 0) {
            try {
              attempts++
              getAd()
              adExist()
            } catch (error) {
              getAd()
              attempts++
              adExist()
              parent.isAd = false
            }
          } else return

        }, 1500);
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
          // console.log(parent.isAd);
          setTimeout(() =>{
            if (!_bsa.exists(el)) {
              getAd(el)
            }
          }, 500)
        adExist()
      }

      setTimeout(() =>{
        let nodeList = document.querySelector("#"+adId).children

        nodeList.forEach((el)=> {
          let newNodeList = document.querySelector("#"+adId).children

          if(newNodeList.length > 1){
            console.log(newNodeList.length);
            el.parentNode.removeChild(el);
          } else{
            // console.log(newNodeList.length);
            return
          }

        });
      }, 1200)

    },

    methods:{
    ...mapActions(['adClick']),
    }
}
</script>

<style>
  .fullWidth .bsa-link{
    width: 100%
  }
</style>