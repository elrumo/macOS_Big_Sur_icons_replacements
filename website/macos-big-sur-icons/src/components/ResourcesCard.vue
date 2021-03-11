<template>
    <router-link :to="link">
        <div class="coral-Well instructions-item Box">
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
        console.log(this.step);
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