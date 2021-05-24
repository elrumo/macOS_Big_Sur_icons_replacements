<template>
    <div>
        


        <div class="h3-description m-t-20" v-if="!text.isCenter">
            <h1 class="coral-Heading--XL resource-heading">
               <b> {{ text.h3 }}</b>
            </h1>

            <div class="h3-description-body">
                <p class="coral-Body--L f-w-500" v-html="markItDown">
                </p>
            </div>

            <div v-if="text.isAd" class="m-t-40 m-b-20">
                <p class="coral-Body--XS">
                    Sponsored by
                </p>
                
                <NativeAd :adId="'iconbar-js-h3'" :key="$route.fullPath + 'ad'"/>
                <!-- <div class="" id="iconbar-js"></div> -->
            </div>
            <!-- <div class="text-and-ad-wrapper">
                <p class="coral-Body--L f-w-500 " v-html="markItDown">
                </p>
                <div class="single-ad mobile-ad">
                    <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
                </div>
            </div> -->
        </div>

        <div v-else class="h3-description h3-description-center">
            <h1 class="coral-Heading--XXL resource-heading">
               <b> {{ text.h3 }}</b>
            </h1>

            <div class="m-b-30">
                <div v-if="!text.isAd" class="h3-description-body">
                    <p class="coral-Body--L" v-html="markItDown">
                    </p>
                </div>

                <div v-else class="text-and-ad-wrapper">
                    <p class="coral-Body--XL" v-html="markItDown">
                    </p>
                    <div class="single-ad mobile-ad">
                        <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
                    </div>
                </div>
            </div>

            <a
                v-if="text.isButton"
                :href="text.link"
                rel="noopener"
                target="_blank"
                data-instant
            >
                <button @click="logSubscription" is="coral-button" variant="cta">
                    <span>Subscribe to blog</span>
                </button>
            </a>

        </div>
    </div>
</template>

<script>
import Marked from 'marked';
import NativeAd from "./NativeAd.vue";

export default {
    name: "H3_Description",
    
    props:{
        text:{},
    },
    
    components:{
        NativeAd
    },

    data: function(){
        return{
        }
    },

    mounted: function(){

    },
    
    methods:{
        logSubscription(){
            let parent = this
            let currentPath = parent.$router.currentRoute.name;
            window.plausible("logSubscription", {props: {
                path: currentPath, 
            }})
        },
    },

    computed: {
        markItDown(){
            let text = this.text.description
            
            return Marked(text, { sanitize: true })
        }
    }
}
</script>

<style>

</style>