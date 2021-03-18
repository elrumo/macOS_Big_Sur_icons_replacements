<template>
  <div @click="adClick" class="" id="iconbar-js"></div>
</template>

<script>

export default {
    name:"NativeAd",

    directives:{},

    components:{},
    
    data(){
        return{
        }
    },

    mounted: function(){
      function getAd(){
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
        }
      }

      getAd()

      setTimeout(() =>{
      // console.log("_bsa: ", _bsa);
        let el = document.getElementById("customAd")
        if (!el) {
          getAd()
        }
      }, 500)
    },

    props:{},

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

</style>