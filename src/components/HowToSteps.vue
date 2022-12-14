<template>
    <div class="coral-Well instructions-item">
        <div class="instructions-well">
        
        <div class="instructions-title">
            <div class="marked" v-html="markItDown"></div>
        </div>

        <div :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
            <img class="card-img instructions-card-img" :src="step.img" alt="">
        </div>

        </div>
    </div>
</template>

<script>
import { marked } from 'marked';

export default {
    name: "HowToSteps",
    
    props:{
        step:{},
    },

    mounted(){
    },

    data: function(){
        return{
        }
    },
    
    computed: {
        markItDown(){
            let text = this.step.text
            return marked(text, { sanitize: true })
        }
    }
}
</script>

<style>

</style>