<template>
    <img class="icon-UI" :src="img" :alt="alt+' icon'">
</template>

<script>

export default {
    name:"IconUI",

    directives:{},

    components:{},
    
    data(){
        return{
        }
    },

    props:{
      img: "",
      alt: ""
    },

    methods:{}
}
</script>

<style>

</style>