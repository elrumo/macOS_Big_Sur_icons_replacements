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
                <NativeAd :adId="'iconbar-js-h3'" :key="$route.fullPath + 'ad'"/>
                <NativeAd
                    :adPosition="'H3 Description Desktop'"
                    :adId="'iconbar-js-h3'"
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