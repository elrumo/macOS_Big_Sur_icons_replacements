<template>
    <div class="coral-Well instructions-item Box">
        <div class="resources-card-wrapper">
        
        <div :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
            <img class="card-img resources-card-img" :src="step.img" alt="">
        </div>

        <div class="resources-card-title">
            <p class="coral-Body--L f-w-500 m-0">
                {{ step.text }}
            </p>
        </div>

        </div>
    </div>
</template>

<script>
import Marked from 'marked';

export default {
    name: "HowToSteps",
    
    props:{
        step:{},
    },

    data: function(){
        return{
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