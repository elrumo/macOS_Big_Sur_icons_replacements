<template>
    <div id="header" class="header coral-bg">

        <Dialog/>

        <div class="header-wrapper">
            <p class="header-item coral-Body--S d-inline-block">
                Built by 
                <a href="https://webbites.io/" target="_blank" class="coral-Link">
                    Elias
                </a> 
            </p>

            
            <div class="header-grid-btns">

                <div>
                    <router-link to="/about">
                        <button is="coral-button" variant="quiet">
                            <span>About</span>
                        </button>
                    </router-link>
                </div>

                <div>
                    <router-link to="/how-to">
                        <button is="coral-button" variant="quiet">
                            <span>How do I install an icon?</span>
                        </button>
                    </router-link>
                </div>
        

                <div>
                    <a class="" target="_blank" href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN" >
                        <button is="coral-button">
                            <span>Donate</span>
                        </button>
                    </a>
                </div>

                <div>
                    <button is="coral-button" variant="cta" @click="showDialog('submitIcon')">
                        <span>Submit icons</span>
                    </button>
                </div>

            </div>

            <!-- Twitter -->
            <!-- <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
                <a href="https://twitter.com/elrumo" target="_blank" class="coral-Link"> 
                    <coral-icon size="M" alt="Smallest" title="XS">
                            <img :src="icons.twitter">
                    </coral-icon>
                </a>
            </p> -->
        </div>
    </div>
</template>

<script>
import Dialog from './Dialog.vue'

export default {
    name:"Header",
    
    components:{
        Dialog
    },

    data(){
        return{
            darkMode: false,
            icons:{
                twitter: require("../assets/icons/twitter.svg"),
            }
        }
    },

    props:{
        submitIconDialog: String,
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

        showDialog(dialog) {
            let dialogEl = document.getElementById(dialog);
            dialogEl.show();
        },

        showDialog(dialogId){
            document.getElementById(dialogId).show()
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