<template>
  <div :class="{fullWidth: fullWidth, 'mobile-hidden': true,}">
    <p v-if="sponsored" class="coral-Detail coral-Detail--S coral-Detail--light opacity-50">
      Sponsored
    </p>
    <div @click="adClick" class="" id="iconbar-js"></div>
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
        }
    },

    mounted: function(){

      function getAd(){
        console.log("_bsa");
        if (typeof _bsa !== 'undefined' && _bsa) {
          _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
          {
            target: '#iconbar-js',
            template: `
                <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link">
                <div class="bsa-icon" style="background-image: url(##image##); background-color: ##backgroundColor##;"></div>
                <div class="bsa-desc">##company## - ##tagline##</div>
                </a>
              `
            }
          );
          let el = document.getElementById("customAd")
          console.log(el);
          // if (!el) {
          //   console.log(el);
          // }
        }
      }

      getAd()

      setTimeout(() =>{
        let el = document.getElementById("customAd")
        if (!_bsa.exists(el)) {
          getAd()
        }
      }, 800)
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