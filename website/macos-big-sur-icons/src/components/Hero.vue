<template>
  <div id="hero" class="hero-wrapper">
    
    <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div>
  
  <div v-if="iconsEmpty">    
      <h3
        class="main-heading m-t-0 p-t-20 coral-Heading--XL coral-Heading--regular"
      >
        <span class="f-w-100 f-s-26">macOS Big Sur</span>
        <br />
        Replacement Icons
      </h3>

      <p class="coral-Body--L w-100 body-text p-t-20">
        Click on each icon to download it,
        <!-- <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip">
          download
        </a>
        all {{ iconListLen }} icons,  -->
        visit the
        <a
          class="coral-Link"
          href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements"
          target="_blank"
        >
          GitHub page
        </a>
          or follow the develoment on 
        <a
          class="coral-Link"
          href="https://twitter.com/intent/tweet?text=Check%20out%20macOSicons.com%20for%20over%203,500%20BigSur%20ready%20icons%20by%20@elrumo"
          target="_blank"
        >
          Twitter.
        </a>
        <!-- <br><br> -->
        To contribute and make new icons, use these templates:
        <a
          class="coral-Link"
          href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.sketch"
          >Sketch</a
        >,
        <a
          class="coral-Link"
          href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.fig"
          >Figma</a
        >,
        <a
          class="coral-Link"
          href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.ai"
          >Illustrator</a
        >, or
        <a
          class="coral-Link"
          href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.psd"
          >Photoshop</a
        >.
      </p>

      <!-- <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
          GitHub
        </a> -->

      <div class="m-auto m-t-35">
        <div class="d-inline-block">
          <button
            is="coral-button"
            variant="cta"
            @click="showDialog(submitIconDialog)"
          >
            <span>Contribute</span>
          </button>
        </div>

        <!-- <a class="p-l-20" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
            <button  is="coral-button" variant="quiet">
              <span>GitHub</span>
            </button>
          </a> -->

        <a
          class="p-l-20"
          href="https://www.paypal.com/donate?hosted_button_id=5PMNX4DPW83KN"
          target="_blank"
        >
          <button is="coral-button" variant="quiet">
            <!-- <span>☕️ Buy me a hot chocolate</span> -->
            <span class="p-r-5 f-s-16">☕️</span> <span>Buy me a hot chocolate</span>
          </button>
        </a>

        <!-- <div class="p-l-20 d-inline-block">
            <button is="coral-button" variant="quiet" @click="showDialog(submitIconDialog)" >
              <span>GitHub</span>
            </button>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Sponsor from "./Sponsor.vue";

export default {
  name: "Hero",

  components:{
    Sponsor
  },

  data() {
    return {
    };
  },

  props: {
    list: {},
    submitIconDialog: String,
    iconListLen: 0,
    iconsEmpty: Boolean
  },

  methods: {
    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    goToSponsor() {
      window.open("https://github.com/sponsors/elrumo?o=esc", "_blank");
    },
  },

  mounted: function() {},
};
</script>

<style>
</style>
