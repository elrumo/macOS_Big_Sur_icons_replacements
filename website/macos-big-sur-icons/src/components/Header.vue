<template>
    <div id="header" class="header">
        <p class="header-item-left coral-Body--S p-t-5">
            <a href="mailto:elias.ruiz.monserrat@gmail.com" target="_blank" class="coral-Link">
                Contact me
            </a> 
        </p>
        
        <p class="coral-Body--S p-t-5 d-inline-block absolute transform-centre">
            By 
            <a href="https://webbites.io/" target="_blank" class="coral-Link">
                Elias
            </a> 
        </p>

        <!-- <img v-if="darkMode" class="header-item-right dark-mode-btn" href="https://twitter.com/elrumo" target="_blank" :src="icons.twitter" alt="dark-mode-btn"> -->

        <p class="header-item-right coral-Body--S p-t-5">
            Hosting by <a href="https://fosshost.org/" target="_blank" class="coral-Link"> fosshost</a>
        </p>
        <!-- <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
            <a href="https://twitter.com/elrumo" target="_blank" class="coral-Link"> 
                <coral-icon size="M" alt="Smallest" title="XS">
                        <img :src="icons.twitter">
                </coral-icon>
            </a>
        </p> -->
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