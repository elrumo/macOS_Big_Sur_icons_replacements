<template>
<div id="hero" class="hero-wrapper">
      <h3 class="main-heading coral-Heading--XL coral-Heading--regular">
        <span class="f-w-100 f-s-26">macOS Big Sur</span>
        <br>
        Replacement Icons
      </h3>

      <p class="coral-Body--L w-100 body-text p-t-20">
        Click on each icon to download it or on the button bellow to download all {{iconList.length}} icons. To contribute, click 
        <span @click="showDialog(submitIconDialog)" class="coral-Link cursor-pointer"> 
          here.
        </span>
         We'll let you know once the icon has been approved.
      </p>
<!--       
      <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
        GitHub
      </a> -->

      <div class="m-auto m-t-30">
        <a class="" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip">
          <button  is="coral-button" variant="cta">
            <span>Download all</span>
          </button>
        </a>
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