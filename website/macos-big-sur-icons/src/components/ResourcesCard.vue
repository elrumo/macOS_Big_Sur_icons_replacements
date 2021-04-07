<template>
    <router-link :to="link">
        <div class="coral-Well instructions-item Box">
            <div class="new-pill" v-if="isNew(step)">
                <coral-status variant="info">New</coral-status>
            </div>
            <div class="resources-card-wrapper">
            
            <div v-if="!step.gradient" class="instructions-img-wrapper">
                <img
                    class="card-img resources-card-img"
                    :src="step.feature_image"
                    alt=""
                >
            </div>

            <div v-else :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
                <img
                    class="card-img resources-card-img"
                    :src="step.feature_image"
                alt="">
            </div>

            <div class="resources-card-title">
                <p class="coral-Body--L f-w-500 m-0">
                    {{ step.title }}
                </p>
            </div>

            </div>
        </div>
    </router-link>
</template>

<script>
import Marked from 'marked';

export default {
    name: "HowToSteps",
    
    props:{
        step:{},
        link: ""
    },

    data: function(){
        return{
        }
    },

    mounted: function(){
    },

    methods:{
        isNew(item){
            let postDate = new Date(item.created_at)
            postDate = Date.parse(postDate)
            postDate = postDate + 172800000 // Ads 48 hours to page date
            let dateNow = Date.now()

            if (item.created_at == undefined || postDate < dateNow) {
                return false
            } else {
                return true;
            }
        }
    },
    
    computed: {
        markItDown(){
            let text = this.step.text
            return Marked(text, { sanitize: true })
        }
    }
}
</script>

<style lang="less">
  @import '@/CSS/resources-card.less';
</style>