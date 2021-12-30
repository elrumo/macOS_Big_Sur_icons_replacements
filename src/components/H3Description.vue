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
                <p
                    class="coral-Body--L f-w-500"
                    v-html="markItDown(text.description)">
                </p>
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
import Marked from 'marked';
import NativeAd from "./NativeAd.vue";

export default {
    name: "H3Description",
    
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
            let currentPath = parent.$route.name;
            window.plausible("logSubscription", {props: {
                path: currentPath, 
            }})
        },

        markItDown(text){
            return Marked(text)
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