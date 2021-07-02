<template>
  <div id="stickyBanner">
    <div class="sticky-banner card-wrapper card-hover coral-card">
      
      <div class="lgbt-wrapper">

        <svg @click="closeBanner" style="z-index: 9; width: 12px; height: 12px" class="icon icon-absolute" xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 12 12">
          <title>CrossLarge</title>
          <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
        </svg>
        
          <div style="z-index: 2" class="card-grid-nativeAd">
            <div @click="adClick" id="card-ad2">
            </div>
          </div>

          <a
            class="card-no-ad relative"
            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
            rel="noopener"
            target="_blank"
            style="width: 100%; left: 0;"
            @click="logDonation('support-message')"
          >
            <div class="support-page">
              <h3 class="coral-Heading--S m-0">
                Support this page
              </h3>
              <p class="coral-Body--S m-0">
                Please consider disabling your ad blocker or making a
                <a  
                  rel="noopener"
                  class="coral-Link"
                  target="_blank"
                  href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                >
                  donation 
                </a>
                to support this project.
              </p>
            </div>
          </a>

      </div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name:"StickyBanner",

    props:{
      sponsored:'',
      fullWidth:'',
      adId: '',
    },

    components:{},
    
    data(){
        return{
        imgs:{
            lgbt: require("../assets/Resources/lgbt.png")
          },
        }
    },
    
    mounted: function(){
      let parent = this
      parent.getAd()
    },

    methods:{
      ...mapActions(['showEl', 'setSelectedIcon', 'addClickCount']),

      getAd(el){
        try {
          if (typeof _bsa !== 'undefined') {
            _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
            {
              target: '#card-ad2',
              template: `
                  <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link">
                  <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
                    <div class="bsa-icon" style="background-image: url(##logo##);"></div>
                  </div>
                  <div class="text-ad-wrapper">
                    <img style="background: ##backgroundColor##" src="##image##">
                    <div class="bsa-desc">##description##</div>
                  </div>
                  </a>
                `
              }
            );
          }
        } catch (error) {
        }
      },

      closeBanner(){
        document.getElementById("stickyBanner").remove()
      },

      adClick(){
        let parent = this
        window.plausible("adClick", {props: {
          path: parent.$router.currentRoute.name,
          position: "Bottom Sticky Banner"
        }})
      }
    }
}
</script>

<style>
  .lgbt-img{
    width: 80px;
    margin: auto;
  }

  .icon-absolute{
    position: absolute;
    padding: 0px !important;
    height: 10px;
    width: 8px;
    right: 8px;
    top: 10px;
    opacity: 0.7;
    cursor: pointer;
  }
  
  .icon-absolute:hover{
    opacity: 1;
  }

  .lgbt-text{
    height: fit-content;
    margin: auto;
    text-align: left;
    display: grid;
    grid-template-columns: auto;
    gap: 10px;
  }

  .lgbt-text p{
    margin: 5px;
  }

  .lgbt-wrapper{
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
  }

  .sticky-banner ._coral-Button{
    width: 100%;
  }

  .sticky-banner{
    position: fixed !important;
    height: auto !important;
    width: 100%;
    max-width: 430px !important;
    max-height: 180px !important;
    padding: 5px;
    /* padding: 15px 10px 20px 10px; */
    bottom: 20px;
    right: 20px;
    z-index: 9;
    box-shadow: 0px 10px 30px -10px rgb(0 0 0);
    min-height: 20px !important;
}

@media only screen and (max-width: 720px){
  .sticky-banner{
    bottom: 10px;
    max-width: 500px !important;
    width: calc(100% - 20px) !important;
    right: 50%;
    transform: translateX(50%)
  }

  .lgbt-img{
    width: 70px;
  }

  #stickyBanner .card-hover:hover {
    transform: translateX(50%) !important;  
  }
}

</style>