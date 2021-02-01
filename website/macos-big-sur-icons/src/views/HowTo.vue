<template>
<div>

    <Header :distanceFromTop="true"/>

    <div class="single-ad isMobile">
      <script v-if="isMobile" async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
    </div>

    <main class="content-wrapper" style="max-width: 1050px !important">
      
      <div class="text-and-ad-wrapper">
        <div>
          <h3 class="coral-Heading--XL">Installation Instructions</h3>
          <h3 class="coral-Heading--M coral-Heading--light m-t-10">macOS</h3>
        </div>

        <div>
          <div class="single-ad mobile-ad">
            <script v-if="!isMobile" async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
          </div>
        </div>
      </div>

      <div class="instructions-grid m-t-30">        
        <HowToSteps v-for="step in steps" :key="step.name" :step='step'/>
        
        <!-- <div class="single-ad ">
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
        </div> -->
      </div>

    </main>

    <footer class="p-b-20 coral-Body--S">
      Made with ❤️ by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
      <dir class="d-inline-block m-0 p-l-15 p-r-10">
        <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
      </dir>
      <a href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN" target="_blank" class="coral-Link">Support the project</a>
    </footer>

</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import HowToSteps from '@/components/HowToSteps.vue'
import VueMobileDetection from 'vue-mobile-detection'

export default {
  name: 'HowTo',
  
  data(){
    return {
      isMobile: this.$isMobile(),
      steps:{
        download:{
          name: "download",
          text:"## Download the icon you want from [**macOSicons.com**](https://macosicons.com)",
          img: require("../assets/Instructions/downloadIcon.png"),
          gradient: false,
        },
        getInfo:{
          name: "getInfo",
          text:"## Find the app on Finder, right click on it and select **Get Info**",
          img: require("../assets/Instructions/getInfo.png"),
          gradient: true,
        },
        setApp:{
          name: "setApp",
          text:"## Drag the downloaded file to the current icon on the Info window",
          img: require("../assets/Instructions/setApp.png"),
          gradient: true,
        }
      }
    }
  },

  components: {
    Header,
    HowToSteps
  },
  
  methods: {
    // mobile() {
    //   console.log(this.$isMobile());
    //   return
    // }
  }

}
</script>
