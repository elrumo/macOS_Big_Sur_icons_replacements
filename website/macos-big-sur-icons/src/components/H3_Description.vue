<template>
    <div>
        <div class="h3-description">
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