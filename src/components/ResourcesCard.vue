<template>
    <router-link class="resources-card-container" :to="getLink">
        <div class="coral-Well instructions-item Box">
            <div id="statusPill" class="new-pill" v-if="isNew(step)">
                <coral-status variant="info">New</coral-status>
            </div>
            <div class="resources-card-wrapper">

                <div
                    v-if="!step.gradient"
                    :class="{
                        'instructions-img-wrapper': true,
                        'gradient':step.gradient 
                    }"
                >
                    <v-lazy-image
                        :src-placeholder="placeholderImage"
                        :src="getImage"
                        :alt="getImage"
                        class="card-img resources-card-img"
                    />
                </div>

                <div v-else :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
                    <v-lazy-image
                        :src-placeholder="placeholderImage"
                        :src="getImage ? getImage : placeholderImage"
                        :alt="getImage"
                        class="card-img resources-card-img"
                    />
                </div>

                <div class="resources-card-title">
                    <p
                        :class="{
                            'resource-card-text': true,
                            'coral-Body--L': true,
                            'f-w-500': !step.description,
                            'f-w-900': step.description,
                            'm-0': true,
                        }"
                    >
                        {{ step.title }}
                    </p>
                    <p
                        v-if="step.description"
                        :class="{
                            'resource-card-text': true,
                            'coral-Body--S': true,
                            'f-w-500': true,
                            'm-0': true,
                            'opacity-70': true,
                        }"
                    >
                        {{ step.description }}
                    </p>
                </div>

            </div>
        </div>
    </router-link>
</template>

<script>
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
        VLazyImage
    },

    data(){
        return{
            placeholderImage: placeholderImage
        }
    },

    mounted: function(){
    },

    methods:{
        isNew(item){
            if(item.feature != null){
                return item.feature
            }

            let postDate = new Date(item.created_at)
            postDate = Date.parse(postDate)
            postDate = postDate + 172800000 // Ads 48 hours to page date
            let dateNow = Date.now()

            if (item.created_at == undefined || postDate < dateNow) {
                return true;
            } else {
                return false
            }
        }
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

<style lang="less">
  @import '@/CSS/resources-card.less';
</style>