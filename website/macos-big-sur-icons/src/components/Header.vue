<template>
    <div
        id="header"
        :class="{'scrolled-shadow': distanceFromTop & scrolled, 'scrolled-header': scrolled, header: true, 'coral-bg':true}"
    >

        <Dialog/>

        <div class="header-wrapper">
            <p class="header-item coral-Body--S mobile-hidden">
                Built by
                <a href="https://webbites.io/" rel="noopener" target="_blank" class="coral-Link">
                    Elias
                </a> 

                <dir class="d-inline-block m-0 p-l-15 p-r-10">
                    <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
                </dir>

                Hosting by
                <a href="https://fosshost.org/" rel="noopener" target="_blank" class="coral-Link">
                    FossHost
                </a> 
            </p>

            
            <div class="header-grid-btns">

                <!-- <div>
                    <router-link to="/about">
                        <button is="coral-button" variant="quiet">
                            <span>About</span>
                        </button>
                    </router-link>
                </div> -->

                <div v-if="this.$route.name != 'HowTo'">
                    <router-link to="/how-to">
                        <button is="coral-button" variant="quiet">
                            <span>How do I install an icon?</span>
                        </button>
                    </router-link>
                </div>

                <div v-else>
                    <router-link to="/">
                        <button is="coral-button" variant="quiet">
                            <span>Back to all Icons</span>
                        </button>
                    </router-link>
                </div>
        

                <div>
                    <a rel="noopener" class="" target="_blank" href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN" >
                        <button is="coral-button">
                            <span>Donate</span>
                        </button>
                    </a>
                </div>

                <div class="mobile-hidden">
                    <button is="coral-button" variant="cta" @click="showDialog('submitIcon')">
                        <span>Submit icons</span>
                    </button>
                </div>

            </div>

            <!-- Twitter -->
            <!-- <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
                <a rel="noopener" href="https://twitter.com/elrumo" target="_blank" class="coral-Link"> 
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
            },
            scrolled: false,
        }
    },

    props:{
        submitIconDialog: String,
        distanceFromTop: true,
    },

    methods:{

        handleScroll () {
            this.scrolled = window.scrollY > 20;
        },

        toggleDarkMode(){
            let parent = this
            let body = document.getElementById("body")
            
            body.classList.remove('coral--light')
            body.classList.add('coral--dark')
            parent.darkMode = true
        },

        showDialog(dialog) {
            let dialogEl = document.getElementById(dialog);
            dialogEl.show();
            plausible("Downloads")
        },

    },

    mounted: function(){
        let parent = this
        
        window.addEventListener('scroll', this.handleScroll);

        if(window.matchMedia('(prefers-color-scheme: dark)').matches){

            parent.toggleDarkMode()
        }
    },

    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
}
</script>

<style>

</style>