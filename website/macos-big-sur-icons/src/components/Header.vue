<template>
    <div id="header" class="header">
        <p class="header-item-left coral-Body--S p-t-5">
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements#credits" target="_blank" class="coral-Link">Credits</a>
        </p>
        
        <p class="coral-Body--S p-t-5 d-inline-block absolute transform-centre">
        Made by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
        </p>

        <img v-if="darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="moon-light.svg" alt="dark-mode-btn">
        <img v-if="!darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="sun-dark.svg" alt="light-mode-btn">

        <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" class="coral-Link"> 
            GitHub 
        </a>
        </p>
    </div>
</template>

<script>
export default {
    name:"Header",
    
    data(){
        return{
            darkMode: false,
        }
    },

    methods:{
        toggleDarkMode(){
            let parent = this
            let body = document.getElementById("body")
            let searchIcon = document.getElementById("coral-css-icon-Magnifier")
            
            body.classList.toggle('coral--light')
            body.classList.toggle('coral--dark')
            searchIcon.classList.toggle('fill-light')
            searchIcon.classList.toggle('fill-dark')
            parent.darkMode = !parent.darkMode
        },
    },

    mounted: function(){
        let parent = this
        
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            parent.toggleDarkMode()
        }
    }
}
</script>

<style>

</style>