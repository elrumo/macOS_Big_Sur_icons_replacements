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
      // sponsored: {
      //   type: Boolean,
      //   default: false,
      // },
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
    
    mounted: function(){
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
      let zoneKey = this.zoneKey;
      let count = this.count
      
      function initAds() {
        if (typeof _bsa !== 'undefined' && _bsa) {
          _bsa.init('custom', zoneKey, 'placement:macosiconscom', {
            target: '#' + adId,
            template: template,
          })
          // check if _bsa.callback is already defined;
          // if not, define it as a function
          console.log(_bsa.callback);
          _bsa.callback = BSANativeCallbacks // This is the callback function
        }
      };

      function BSANativeCallbacks(a) {
        // console.log(a.ads);
        if (a.ads.length == 0) {
          count++
          console.log(adId + ' ' + count);
          initAds();
          // Do something here to display fallback when the ads array is empty
        }
      }
      
      // initAds()
      // return

      function getAd(el){
        try {
          if (typeof _bsa !== 'undefined' && !parent.isAd ) {
            document.getElementById(adId).innerHTML = ''
            // el.innerHTML = ''
            _bsa.init('custom', zoneKey, 'placement:macosiconscom',{
              target: '#'+adId,
              template: template
            });
            // _bsa.callback = BSANativeCallback // This is the callback function
          }
        } catch (error) {
          console.log(error);
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

      let el = document.getElementById(adId)

      // function BSANativeCallback(a){
      //   console.log(a.ads);
      //   if (a.ads.length == 0) {
      //     getAd(el)
      //     parent.isAd = true
      //   }
      // }

      if (!parent.isAd) {
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
              console.log(newNodeList.length);
              el.parentNode.removeChild(el);
            } else{
              // console.log(newNodeList.length);
              return
            }

          };
        } catch (error) {
          
        }
      }, 100)

    },

    methods:{
      adClick(){
        window.plausible("adClick", {props: {
          path: this.$route.name
        }})
      }
    }
}
</script>

<style>
  .fullWidth .bsa-link{
    width: 100%
  }
</style>