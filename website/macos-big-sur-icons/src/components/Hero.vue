<template>
<div id="hero" class="hero-wrapper">
      <h3 class="main-heading coral-Heading--XL coral-Heading--regular">
        <span class="f-w-100 f-s-26">macOS Big Sur</span>
        <br>
        Replacement Icons
      </h3>

      <p class="coral-Body--L w-100 body-text p-t-20">
        Click on each icon to download it, or on the button bellow to donwload all {{Object.keys(iconList).length}} icons.
        <!-- <br><br> -->
        Click on the button bellow to contribute. Use this
        <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template%20-%20Icon%20-%20App.sketch">Sketch</a>,
        <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template%20-%20Icon%20-%20App.fig">Figma</a> or
        <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template%20-%20Icon%20-%20App.ai">Illustrator</a>,
        <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template%20-%20Icon%20-%20App.psd">Photoshop</a> template to make the icons.
      </p>
<!--       
      <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
        GitHub
      </a> -->

      <div class="m-auto m-t-30">
        
        <a class="" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip">
          <button  is="coral-button" variant="cta">
            <span>Download all icons</span>
          </button>
        </a>

        <div class="p-l-20 d-inline-block">
          <button is="coral-button" @click="showDialog(submitIconDialog)" >
            <span>Contribute</span>
          </button>
        </div>

      </div>

    </div>
</template>

<script>
export default {
    name:"Hero",
    
    data(){
        return{
        }
    },

    props:{
      iconList: {},
      submitIconDialog: String
    },

    methods:{
      showDialog(dialog){
        let dialogEl = document.getElementById(dialog)
        dialogEl.show()
      },
    },

    mounted: function(){
    }
}
</script>

<style>

</style>