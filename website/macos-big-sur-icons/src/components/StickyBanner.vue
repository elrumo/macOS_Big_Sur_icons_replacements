<template>
  <div id="stickyBanner" class="sticky-banner card-wrapper card-hover coral-card">
    
    <div class="lgbt-wrapper">
      
      <svg @click="closeBanner" class="icon icon-absolute" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
        <title>CrossLarge</title>
        <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
      </svg>

      <img class="lgbt-img" :src="imgs.lgbt" alt="">
      
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
          <button is="coral-button" variant="CTA">
              Show your support
          </button>
        </a>

      </div>

    </div>

  </div>
</template>

<script>

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
    },

    methods:{

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
    height: fit-content !important;
    width: 100%;
    max-width: 430px !important;
    padding: 15px 10px;
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
}

</style>