<template>
    <div
        v-if="isNotEmpty"
        class="about-block"
    >
        <h1 v-if="text.h3" class="coral-Heading--XL resource-heading">
            <b> {{ text.h3 }}</b>
        </h1>

        <div v-if="text.description" class="h3-description-body">
            <p
                class="coral-Body--L f-w-500"
                v-html="markItDown(text.description)">
            </p>
        </div>

    </div>
</template>

<script>
import Marked from 'marked';

export default {
    name: "AboutBlock",
    
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
        markItDown(text){
            return Marked(text)
        }
    },

    computed: {
        isNotEmpty(){
            console.log(Object.keys(this.text).length);
            return Object.keys(this.text).length > 0
        }
    }
}
</script>

<style>

</style>