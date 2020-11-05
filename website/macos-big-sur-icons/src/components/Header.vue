<template>
    <div id="header" class="header">
        <p class="header-item-left coral-Body--S p-t-5">
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" class="coral-Link">
            GitHub
        </a>
        </p>
        
        <p class="coral-Body--S p-t-5 d-inline-block absolute transform-centre">
        Made by <a href="https://webbites.io/" target="_blank" class="coral-Link">Elias</a>
        </p>

        <img v-if="darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="moon-light.svg" alt="dark-mode-btn">
        <img v-if="!darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="sun-dark.svg" alt="light-mode-btn">

        <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
        <a href="https://twitter.com/elrumo" target="_blank" class="coral-Link"> 
            Twitter
            <coral-icon size="S" alt="Smallest" title="XXS">
                    <img :src="icons.twitter">
            </coral-icon>
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
            icons:{
                twitter: require("../assets/icons/twitter.svg"),
            }
        }
    },

    methods:{
        toggleDarkMode(){
            let parent = this
            let body = document.getElementById("body")
            let searchIcon = document.getElementById("coral-css-icon-Magnifier")
            
            body.classList.toggle('coral--light')
            body.classList.toggle('coral--dark')
            if(searchIcon == null){
            } else{
                searchIcon.classList.toggle('fill-light')
                searchIcon.classList.toggle('fill-dark')
            }
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