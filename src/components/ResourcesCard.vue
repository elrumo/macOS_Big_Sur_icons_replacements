<template>
    <router-link class="resources-card-container" :to="getLink">
        <div class="coral-Well instructions-item Box">
            
            <IsNew :item="step"/>

            <div class="resources-card-wrapper">
                
                <v-lazy-image
                    :src-placeholder="placeholderImage" :src="getImage" :alt="getImage"
                    :class="{
                        'card-img': true,
                        'resources-card-img': true,
                        'instructions-img-wrapper': step.gradient,
                        'gradient': step.gradient
                    }"
                />

                <div class="resource-card-title-wrapper">
                    <p
                        class="resource-card-title coral-Body--L"
                    >
                        {{ step.title }}
                    </p>
                    <p
                        v-if="step.description"
                        class="resource-card-description coral-Body--S"
                    >
                        {{ step.description }}
                    </p>
                </div>

            </div>
        </div>
    </router-link>
</template>

<script>
import IsNew from "./IsNew.vue";

import Marked from 'marked';
import VLazyImage from "v-lazy-image";
import placeholderImage from "../assets/placeholder-image.gif"

export default {
    name: "ResourcesCard",
    
    props:{
        step:{},
        link: ""
    },

    components:{
        VLazyImage,
        IsNew
    },

    data(){
        return{
            placeholderImage: placeholderImage
        }
    },

    mounted: function(){
    },

    methods:{

    },
    
    computed: {
        markItDown(){
            let text = this.step.text
            return Marked(text, { sanitize: true })
        },

        getImage(){
            if (this.step.feature_image != null) {
                return this.step.feature_image
            } else {
                return "https://i.imgur.com/tu9ZVml.png"
            }
        },

        getLink(){
            let link = this.link
            let step = this.step

            if (step.slug) {
                return link
            } else {
                return this.$router.currentRoute.path
            }
        }
    }
}
</script>

<style lang="scss">
  @import '@/CSS/resources-card.scss';
</style>