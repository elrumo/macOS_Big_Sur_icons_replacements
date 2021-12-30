<template>
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div
      @click="adClick"
      :class="template == 1 ? 'native-ad-wrapper': 'card-grid-nativeAd'"
      :id="adId">
    </div>
  </div>
</template>

<script>

export default {
    name:"NativeAd",

    props:{
      sponsored:'',
      fullWidth:'',
      adId: '',
      template: Number
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
        let parent = this
        window.plausible("adClick", {props: {
          path: parent.$router.currentRoute.name, 
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