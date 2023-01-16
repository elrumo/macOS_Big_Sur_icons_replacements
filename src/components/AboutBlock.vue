<template>
    <div
        v-if="isNotEmpty"
        class="about-block"
    >
        <h1 v-if="text.h3" class="coral-Heading--XL resource-heading">
            <b> {{ text.h3 }}</b>
        </h1>

        <div v-if="text.description" class="h3-description-body">

            <vue-markdown
                :source="text.description"
                class="coral-Body--L f-w-500"
            />
        </div>
    </div>

    <div v-else class="about-block skeleton-fill"></div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'
// import Marked from 'marked';

export default {
    name: "AboutBlock",

    components:{
        VueMarkdown,
    },
    
    props:{
        text:{},
    },

    data(){
        return{
        }
    },

    mounted(){

    },
    
    methods:{
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