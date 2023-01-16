<template>
    <div>
        <div
            v-if="isNotEmpty"
            :class="{
                'h3-description': true,
                'text-center': text.isCenter,
            }"
        >
            <h1
                v-if="text.h3"
                class="coral-Heading--XL resource-heading"
            >
               <b> {{ text.h3 }}</b>
            </h1>

            <div v-if="text.description" class="h3-description-body">
                <vue-markdown
                    :source="text.description"
                    class="coral-Body--L f-w-500"
                />
            </div>

            <div
                v-if="text.isAd"
                class="m-t-48 m-b-24"
            >
                <p class="coral-Body--XS">
                    Sponsored by
                </p>
                    <!-- :adId="'iconbar-js-h3'" -->
                <NativeAd
                    :adId="'resources-ad'"
                    :template="1"
                    :key="$route.fullPath + 'ad' + '_resources'"
                />
            </div>

        </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { marked } from 'marked';
import NativeAd from "./NativeAd.vue";

import VueMarkdown from 'vue-markdown-render'

export default {
    name: "H3Description",
    
    props:{
        text:{},
    },
    
    components:{
        NativeAd,
        VueMarkdown
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
            let currentPath = parent.$route.name;
            window.plausible("logSubscription", {props: {
                path: currentPath, 
            }})
        }
    },

    computed: {
        isNotEmpty(){
            return Object.keys(this.text).length > 0
        }
    }
}
</script>

<style>

</style>