<template>
  <div :class="{fullWidth: fullWidth}">
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
        if (typeof _bsa !== 'undefined' && _bsa) {
          console.log(_bsa);
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
        }
      }

      getAd()

      setTimeout(() =>{
      // console.log("_bsa: ", _bsa);
        let el = document.getElementById("customAd")
        if (!el) {
          getAd()
        }
      }, 600)
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