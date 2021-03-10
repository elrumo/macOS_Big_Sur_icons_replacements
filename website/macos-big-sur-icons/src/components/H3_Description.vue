<template>
    <div>
        <div class="h3-description" v-if="!text.isCenter">
            <h1 class="coral-Heading--XL resource-heading">
               <b> {{ text.h3 }}</b>
            </h1>

            <div class="h3-description-body" v-if="!text.isAd">
                <p class="coral-Body--L f-w-500 m-b-50" v-html="markItDown">
                </p>
            </div>

            <div v-else class="text-and-ad-wrapper">
                <p class="coral-Body--L f-w-500 m-b-50" v-html="markItDown">
                </p>
                <div class="single-ad mobile-ad">
                    <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
                </div>
            </div>
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
                href="https://blog.macosicons.com/blog/#subscribe"
                rel="noopener" target="_blank"
            >
                <button is="coral-button" variant="cta">
                    <span>Subscribe to blog</span>
                </button>
            </a>

        </div>
    </div>
</template>

<script>
import Marked from 'marked';

export default {
    name: "H3_Description",
    
    props:{
        text:{},
    },

    data: function(){
        return{
        }
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