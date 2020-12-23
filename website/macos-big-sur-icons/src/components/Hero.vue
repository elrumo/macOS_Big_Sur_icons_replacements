<template>
  <div id="hero" class="hero-wrapper">
    <div class="PH-badge">
      <Sponsor class="gitHub-sponsor"/>
    </div>

    <h3
      class="main-heading m-t-0 p-t-20 coral-Heading--XL coral-Heading--regular"
    >
      <span class="f-w-100 f-s-26">macOS Big Sur</span>
      <br />
      Replacement Icons
    </h3>

    <p class="coral-Body--L w-100 body-text p-t-20">
      Click on each icon to download it,
      <a
        class="coral-Link"
        href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip"
      >
        download
      </a>
      all {{ iconListLen }} icons, or visit the
      <a
        class="coral-Link"
        href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements"
        target="_blank"
      >
        GitHub
      </a>
      repo.
      <!-- <br><br> -->
      To contribute and make new icons, use these templates:
      <a
        class="coral-Link"
        href="http://82.145.63.160:1337/parse/files/macOSicons/cd04572e1cefd8c6a017f1422f13ea09_Template-Icon-App.sketch"
        >Sketch</a
      >,
      <a
        class="coral-Link"
        href="http://82.145.63.160:1337/parse/files/macOSicons/ea404ea43049839734099c08e08551b4_Template-Icon-App.fig"
        >Figma</a
      >,
      <a
        class="coral-Link"
        href="http://82.145.63.160:1337/parse/files/macOSicons/49b00ff2cc6631044209f6881a766883_Template-Icon-App.ai"
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

    <div class="m-auto m-t-30">
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
          <span>Buy me a hot chocolate</span>
          <!-- <span>One-time Donation</span> -->
        </button>
      </a>

      <!-- <div class="p-l-20 d-inline-block">
          <button is="coral-button" variant="quiet" @click="showDialog(submitIconDialog)" >
            <span>GitHub</span>
          </button>
        </div> -->
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
