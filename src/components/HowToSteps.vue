<template>
    <div class="coral-Well instructions-item">
        <div class="instructions-well">
        
        <div class="instructions-title">
            <vue-markdown
                :source="step.text"
                class="marked"
            />
        </div>

        <div :class="{ 'instructions-img-wrapper': true, 'gradient':step.gradient }">
            <img class="card-img instructions-card-img" :src="step.img" alt="">
        </div>

        </div>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
    name: "HowToSteps",
    
    props:{
        step:{},
    },

    components:{
        VueMarkdown,
    },

    mounted(){
    },

    data: function(){
        return{
        }
    },
    
    computed: {
    }
}
</script>

<style>

</style>