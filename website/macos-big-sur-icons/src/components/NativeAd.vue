<template>
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true,}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div @click="adClick" class="" id="iconbar-js">
    </div>
  </div>
</template>

<script>

export default {
    name:"NativeAd",

    props:{
      sponsored:'',
      fullWidth:''
    },

    components:{},
    
    data(){
        return{
          isAd: false,
        }
    },
    
    mounted: function(){
      let parent = this

      function getAd(el){
        try {
          if (typeof _bsa !== 'undefined' && !parent.isAd) {
            _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
            {
              target: '#iconbar-js',
              template: `
                  <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link coral-card">
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
        var adExists = document.getElementById("iconbar-js").children.length
        console.log();
        setTimeout(() => {
          if (attempts >= 4) return;
          if (adExists == 0) {
            try {
              getAd()
              console.log("attempts: ", attempts);
              attempts++
              adExist()
            } catch (error) {
              getAd()
              attempts++
              adExist()
              parent.isAd = false
            }
          } else return

        }, 800);
      }

      let el = document.getElementById("customAd")

      window.BSANativeCallback = (a) => {
        const total = a.ads.length;
        if (!total) {
          getAd(el)
          parent.isAd = true
        }
      }

      // getAd(el)

      if (!parent.isAd) {
          // // console.log(parent.isAd);
          // setTimeout(() =>{
          //   if (!_bsa.exists(el)) {
          //     getAd(el)
          //   }
          // }, 500)
        adExist()
      }

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