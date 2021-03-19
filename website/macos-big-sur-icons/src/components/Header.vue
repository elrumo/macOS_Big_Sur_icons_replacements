<template>
    <div
        id="header"
        :class="{'scrolled-shadow': distanceFromTop & scrolled, 'scrolled-header': scrolled, header: true, 'coral-bg':true}"
    >

        <Dialog/>

        <div class="header-wrapper">
            
            <div class="header-logo-name">
                <router-link to="/">
                    <h3 class="coral-Heading--M m-0 text-left">
                        macOSicons
                    </h3>
                </router-link>

                <p class="header-item coral-Body--S">
                    By
                    <a href="https://webbites.io/"
                        rel="noopener"
                        target="_blank"
                        class="underline"
                    >
                        Elias
                    </a> 

                    <span class="mobile-hidden">
                        <dir class="d-inline-block m-0 p-l-10 p-r-10">
                            <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
                        </dir>
                        
                        <span class=" opacity-70">
                            Hosting by
                            <a href="https://fosshost.org/"
                                rel="noopener"
                                target="_blank"
                                class="underline"
                            >
                                FossHost
                            </a> 
                        </span>
                    </span>
                </p>
            </div>
            
            <!-- Mobile -->
            <div class="desktop-hidden coral--large">
                <div class="burger-btn" @click="openOverlay">
                    <coral-icon class="m-auto" id="mobile-menu-icon" :icon="icons.burgerMenu" size="XL" alt="Larger" title="XL">
                    </coral-icon>
                </div>

                <coral-overlay id="popover"
                    class="mobile-nav-wrapper"
                    target="#target_1"
                    interaction="on"
                >
                    <div v-click-outside="away"
                        class="header-grid-btns mobile-nav-options"
                    >

                        <!-- Back to all icons -->
                        <div @click="away" v-if="this.$route.name != 'Home'">
                            <router-link to="/" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                Back to all Icons
                            </router-link>
                        </div>

                        <!-- Forum -->
                        <div @click="away" >
                            <a
                                href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions"
                                rel="noopener" target="_blank"
                                class="_coral-Button _coral-Button--primary _coral-Button--quiet"
                            >
                                <span style="position: relative; left: -1px">
                                    Forum
                                </span>
                            </a>
                        </div>
                        
                        <!-- blog -->
                        <!-- <div @click="away" v-if="this.$route.name != 'BlogHome'">
                            <router-link to="/blog" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                <span>
                                    Blog
                                </span>
                            </router-link>
                        </div> -->
                        
                        <!-- Resources -->
                        <div @click="away">
                            <router-link to="/resources" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                <span>
                                    Resources
                                </span>
                            </router-link>
                        </div>
                        
                        <!-- Instructions -->
                        <!-- <div @click="away" v-if="this.$route.name != 'HowTo'">
                            <router-link to="/how-to" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                Instructions
                            </router-link>
                        </div> -->
                        <hr class="coral-Divider--S">
                        
                        <!-- Buy me a coffee -->
                        <div>
                            <a
                                rel="noopener"
                                target="_blank"
                                class="_coral-Button _coral-Button--primary _coral-Button--quiet"
                                href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                                @click="logDonation('header')"
                            >
                                <span>Buy me a coffee</span>
                            </a>
                        </div>
                        
                        <!-- Submit icons -->
                        <div>
                            <button class="_coral-Button _coral-Button--primary _coral-Button--quiet" @click="showDialog('submitIcon')">
                                <span>Submit icons</span>
                            </button>
                        </div>
                    </div>
                </coral-overlay>
            </div>
            
            <!-- Desktop -->
            <div class="mobile-hidden">
                <div class="header-grid-btns">

                    <!-- Back to all icons -->
                    <div class="opacity-50" v-if="this.$route.name != 'Home'">
                        <router-link to="/">
                            <button is="coral-button" variant="quiet">
                                <span>Back to Icons</span>
                            </button>
                        </router-link>
                    </div>

                    <!-- Forum -->
                    <div>
                        <a
                            href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions"
                            rel="noopener" target="_blank"
                        >
                            <button is="coral-button" variant="quiet">
                                <span>Forum</span>
                            </button>
                        </a>
                    </div>
                    
                    <!-- blog -->
                    <!-- <div>
                        <router-link to="/blog">
                            <button is="coral-button" variant="quiet">
                                <span>Blog</span>
                            </button>
                        </router-link>
                    </div> -->

                    <!-- Resources -->
                    <div>
                        <router-link to="/resources">
                            <button is="coral-button" variant="quiet">
                                <span>Resources</span>
                            </button>
                        </router-link>
                    </div>

                    <!-- Instructions -->
                    <!-- <div>
                        <router-link to="/how-to">
                            <button is="coral-button" variant="quiet">
                                <span>Instructions</span>
                            </button>
                        </router-link>
                    </div> -->
                    
                    <!-- Buy me a coffee -->
                    <div>
                        <a rel="noopener" class="" target="_blank" href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN" @click="logDonation('header')">
                            <button is="coral-button">
                                <span>Buy me a coffee</span>
                            </button>
                        </a>
                    </div>
                    
                    <!-- Submit icons -->
                    <!-- <div class="hide-on-shrink">
                        <button is="coral-button" variant="cta" @click="showDialog('submitIcon')">
                            <span>Submit icons</span>
                        </button>
                    </div> -->
                    
                    <!-- Twitter -->
                    <a href="https://twitter.com/elrumo" target="_blank" rel="noopener">
                        <img :src="icons.twitter" class="header-item header-icon" alt="">
                    </a>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
import Dialog from './Dialog.vue'
import vClickOutside from 'v-click-outside'

export default {
    name:"Header",

    directives:{
      clickOutside: vClickOutside.directive
    },

    components:{
        Dialog,
    },
    
    data(){
        return{
            darkMode: false,
            icons:{
                twitter: require("../assets/icons/twitter.svg"),
                burgerMenu: require("../assets/icons/burgerMenu.svg"),
            },
            isMenu: false,
            scrolled: false,
        }
    },

    props:{
        submitIconDialog: String,
        distanceFromTop: true,
    },

    methods:{
        
        away(e) {
            let parent = this
            let popover = document.getElementById("popover")
            
            let menuIsClicked = e.target.id == "mobile-menu-icon"

            if (parent.isMenu && !menuIsClicked) {
                parent.isMenu = false
                popover.hide();
            }
            
        },

        openOverlay(){
            let parent = this
            let popover = document.getElementById("popover")
            
            console.log(parent.isMenu);

            if (parent.isMenu) {
                popover.hide()
            } else{
                popover.show()
            }

            parent.isMenu = !parent.isMenu
        },

        logDonation(location){
            window.plausible("logDonation", {props: {
                location: location, 
            }})
        },

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