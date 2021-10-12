<template>
    <div>

        <div :class="{
            'h3-description': true,
            'm-t-20': true,
            'text-center': text.isCenter,
        }">
            <h1 class="coral-Heading--XL resource-heading">
               <b> {{ text.h3 }}</b>
            </h1>

            <div class="h3-description-body">
                <p
                    class="coral-Body--L f-w-500"
                    v-html="markItDown(text.description)">
                </p>
            </div>

            <div v-if="text.isAd" class="m-t-40 m-b-20">
                <p class="coral-Body--XS">
                    Sponsored by
                </p>
<<<<<<< Updated upstream
                <NativeAd :adId="'iconbar-js-h3'" :key="$route.fullPath + 'ad'"/>
=======
                <NativeAd
                    :adPosition="'H3 Description Desktop'"
                    :adId="'iconbar-js-h3'"
                />
>>>>>>> Stashed changes
            </div>

        </div>

<<<<<<< Updated upstream
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
                    <div @click="adClick" class="single-ad mobile-ad">
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
=======
>>>>>>> Stashed changes
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
        ...mapActions(['adClick',]),

        logSubscription(){
            let parent = this
            let currentPath = parent.$router.currentRoute.name;
            window.plausible("logSubscription", {props: {
                path: currentPath, 
            }})
        },

        markItDown(text){
            console.log("text: ", text);
            return Marked(text, { sanitize: true })
        }
    },

    computed: {
    }
}
</script>

<style>

</style>