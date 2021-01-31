<template>
    <div class="coral-Well instructions-item">
        <div class="instructions-well">
        
        <div class="instructions-title">
            <div class="h2-marked" v-html="markItDown"></div>
        </div>

        <div :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
            <img class="instructions-img" :src="step.img" alt="">
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

<style>

</style>