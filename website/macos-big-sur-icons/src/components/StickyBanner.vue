<template>
  <div id="stickyBanner">
    <div class="sticky-banner card-wrapper card-hover coral-card">
      
      <div class="lgbt-wrapper">

        <svg @click="closeBanner" class="icon icon-absolute" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
          <title>CrossLarge</title>
          <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
        </svg>

        <a @click="addClickCount({id:'4KlGUMi162', appName: 'Pride'})" href="https://media.macosicons.com/parse/files/macOSicons/69812d83d48551a9287933774347fe7a_Pride.icns">
          <img class="lgbt-img" :src="imgs.lgbt" alt="">
        </a>
        
        <div class="lgbt-text">
          
          <!-- <h2 class="coral-Heading--S m-5">
            Support
          </h2> -->
          
          <p class="coral-Body--M">
            50% of the ad revenue and donations this month will be donated to
            <a rel="noopener"
              class="coral-Link"
              href="https://www.stonewall.org.uk/"
              target="_blank"
            > 
              Stonewall.
            </a>
          </p>

          <a rel="noopener"
            class="coral-Link"
            href="https://www.paypal.com/donate?hosted_button_id=5PMNX4DPW83KN"
            target="_blank"
            
          >
            <button @click="adClick" is="coral-button" variant="CTA">
                Donate now
            </button>
          </a>

        </div>

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
    
<<<<<<< Updated upstream
    mounted: function(){
      let parent = this
=======
    mounted(){
      
      // this.$nextTick(function () {
      //   let parent = this
      //   parent.getAd()
      // })
      // this.$router.onReady(function(){
      //   console.log("ready");
      //   let parent = this
      //   parent.getAd()
      // });

    },

    watch:{
      $route (to, from){

          this.$router.onReady(function(){
            let parent = this

            function getAd(){
              try {
                if (typeof _bsa !== 'undefined') {
                _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
                  {
                    target: '.card-ad2',
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
                  )
                }
              } catch (error) {
                console.log("error: ", error);
              }

              // setTimeout(() => {
              //   let ad = document.querySelector('.bsa-link')
              //   if (ad == null) {
              //     console.log('no ad');
              //     getAd()
              //     console.log('no ad');
              //   }
              // }, 1500);

            }
            getAd()


            // if (el.length >= 1) {
            //   console.log('exists: ', el);
            //   getAd()
            //   getAd()
            //   getAd()
            //   setTimeout(() => {
            //     getAd()
            //   }, 1000);
            // } else{
            //   console.log('Hiii');
            //   getAd()
            //   getAd()
            // }
            
          });
          // this.getAd()
      }
>>>>>>> Stashed changes
    },

    methods:{
      ...mapActions(['showEl', 'setSelectedIcon', 'addClickCount']),

      closeBanner(){
        document.getElementById("stickyBanner").remove()
      },

      adClick(){
        let parent = this
        window.plausible("logDonation", {props: {
          location: parent.$router.currentRoute.name,
          campaign: "Pride Month",
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
    padding: 15px 10px 20px 10px;
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