<template>
    <div
        id="header"
        :class="{'scrolled-shadow': distanceFromTop & scrolled, 'scrolled-header': scrolled, header: true, 'coral-bg':true}"
    >
        
        <!-- <div v-if="true">
            {{ toggleOverflow() }}
        </div> -->
        <OptionsMenu :optionsList="optionsList"/>
        <Dialog/>
        <SubmissionDialog/>
        <LoginDialog/>
        <AccountDialog/>

        <div class="header-wrapper">
            
            <div class="header-logo-name">
                <router-link to="/">
                    <h3 class="coral-Heading--M m-0 text-left">
                        macOSicons
                    </h3>
                </router-link>

                <p class="header-item coral-Body--S">
                    By
                    <!-- <a href="https://webbites.io/" -->
                    <a href="https://eliasruiz.com/"
                        rel="noopener"
                        target="_blank"
                        class="underline"
                    >
                        Elias
                    </a> 

                    <span class="mobile-hidden">
                    </span>
                </p>
            </div>
            
            <!-- Mobile -->
            <div class="desktop-hidden coral--large">
                <div class="burger-btn" @click="toggleOverlay">
                    <coral-icon class="m-auto" id="mobile-menu-icon" :icon="icons.burgerMenu" size="XL" alt="Larger" title="XL">
                    </coral-icon>
                </div>

                <coral-overlay id="popover"
                    class="mobile-nav-wrapper"
                    target="#target_1"
                    interaction="on"
                >
                    <div 
                        class="header-grid-btns mobile-nav-options"
                    >
                    
                        <!-- Account Profile -->
                        <div v-if="getUser.isAuth" class="profile-nav">
                            <img 
                                id="profilePicNav-mobile" 
                                @click="showEl({
                                    elId: 'profileNavPopover', 
                                    targetId: 'profilePicNav-mobile'
                                })"
                                class="profile-pic-nav m-l-5" 
                                :src="icons.profilePic" alt=""
                            >
                            <!-- <OptionsMenu :optionsList="optionsList"/> -->
                        </div>

                        <!-- Back to all icons -->
                        <div @click="toggleOverlay" v-if="this.$route.name != 'Home'">
                            <router-link to="/" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                Back to all Icons
                            </router-link>
                        </div>

                        <!-- Forum -->
                        <div @click="toggleOverlay" >
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
                        <div @click="toggleOverlay" v-if="this.$route.name != 'BlogHome'">
                            <router-link to="/blog" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                <span>
                                    Blog
                                </span>
                            </router-link>
                        </div>
                        
                        <!-- Resources -->
                        <div class="resourcesLink" @click="toggleOverlay">
                            <coral-status variant="info" class="_coral-StatusLight--info _coral-StatusLight" color=""></coral-status>
                            <router-link to="/resources" class="_coral-Button _coral-Button--primary _coral-Button--quiet">
                                <span>
                                    Resources
                                </span>
                            </router-link>
                        </div>
                        
                        <hr class="coral-Divider--S">
                        
                        <!-- Donate -->
                        <div class="">
                            <a
                                rel="noopener"
                                target="_blank"
                                class="m-b-10"
                                href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                                @click="logDonation('header')"
                            >
                                <button is="coral-button" variant="cta">
                                    <span>Donate</span>
                                </button>
                            </a>
                        </div>

                            <!-- Submit icons -->
                        <div v-if="getUser.isAuth" class="profile-nav m-b-20">
                            <button is="coral-button" variant="quiet" @click="showEl('submissionDialog')">
                                <span>Submit</span>
                            </button>
                        </div>
                        
                        <!-- Twitter -->
                        <div class="header-icon-wrapper">
                            <a href="https://twitter.com/elrumo" class="" target="_blank" rel="noopener">
                                <img :src="icons.twitter" class="header-item header-icon" alt="Twitter logo">
                            </a>
                            <a href="https://discord.gg/f4mTRyyTkT" class="p-l-20" target="_blank" rel="noopener">
                                <img :src="icons.discord" class="header-item header-icon" alt="Discord Logo">
                            </a>
                            <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" class="p-l-20" target="_blank" rel="noopener">
                                <img :src="icons.github" class="header-item header-icon" alt="GitHub Logo">
                            </a>
                        </div>

                    </div>
                </coral-overlay>
            </div>
            
            <!-- Desktop -->
            <div class="mobile-hidden">
                <div class="header-grid-btns">
                    
                    <!-- Twitter + Discord -->
                    <div class="header-icon-wrapper">
                        <a href="https://twitter.com/elrumo" class="" target="_blank" rel="noopener">
                            <img style="height: 17px;" :src="icons.twitter" class="header-item header-icon" alt="Twitter logo">
                        </a>
                        <a href="https://discord.gg/f4mTRyyTkT" class="p-l-20" target="_blank" rel="noopener">
                            <img style="height: 17px;" :src="icons.discord" class="header-item header-icon" alt="Discord Logo">
                        </a>
                        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" class="p-l-20" target="_blank" rel="noopener">
                            <img :src="icons.github" class="header-item header-icon" alt="GitHub Logo">
                        </a>
                    </div>
                    
                    <!-- Back to all icons -->
                    <div class="opacity-70" v-if="this.$route.name != 'Home'">
                        <router-link to="/">
                            <button is="coral-button" variant="quiet">
                                <span>All Icons</span>
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
                    <div>
                        <router-link to="/blog">
                            <button is="coral-button" variant="quiet">
                                <span>Blog</span>
                            </button>
                        </router-link>
                    </div>

                    <!-- Resources -->
                    <div class="resourcesLink">
                        <!-- <coral-status variant="info"></coral-status> -->
                        <router-link to="/resources">
                            <button is="coral-button" variant="quiet">
                                <span>Resources</span>
                            </button>
                        </router-link>
                    </div>
                    
                    <!-- Buy me a coffee -->
                    <div class="hide-on-shrink">
                        <a
                            rel="noopener"
                            class=""
                            target="_blank"
                            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                            @click="logDonation('header')"
                        >
                            <button
                                is="coral-button"
                                variant="quiet"
                            >
                                <span>Donate</span>
                            </button>
                        </a>
                    </div>
                    
                    <!-- Account Profile -->
                    <div v-if="getUser.isAuth" class="profile-nav">
                        <button is="coral-button" variant="quiet" @click="showEl('submissionDialog')">
                            <span>Submit</span>
                        </button>

                        <img 
                            id="profilePicNav-desktop" 
                            @click="showEl({
                                elId: 'profileNavPopover',
                                targetId: 'profilePicNav-desktop'
                                })" 
                            class="profile-pic-nav m-l-5" 
                            :src="icons.profilePic" alt=""
                        >
                    </div>

                    <!-- Submit icons -->
                    <div v-if="!getUser.isAuth" class="p-l-10">
                        <button is="coral-button" variant="cta" @click="showEl('loginDialog')">
                            <span>Submit icons</span>
                        </button>
                    </div>
                    
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import Dialog from './Dialog.vue'
import SubmissionDialog from './SubmissionDialog.vue'
import LoginDialog from './LoginDialog.vue'
import AccountDialog from './AccountDialog.vue'
import OptionsMenu from './OptionsMenu.vue'

import { mapGetters, mapActions } from 'vuex'

import Parse from 'parse'

export default {
    name:"Header",

    directives:{
    },

    components:{
        Dialog,
        LoginDialog,
        OptionsMenu,
        AccountDialog,
        SubmissionDialog
    },
    
    data(){
        return{
            darkMode: false,
            icons:{
                twitter: require("../assets/icons/twitter.svg"),
                discord: require("../assets/icons/Discord.svg"),
                github: require("../assets/icons/github.svg"),
                burgerMenu: require("../assets/icons/burgerMenu.svg"),
                settings: require("../assets/icons/Settings.svg"),

                profilePic: require("../assets/Resources/accounts/profilePic.png"),
            },
            isMenu: false,
            scrolled: false,
            
            currentUser: Parse.User.current(),

            optionsList: [
                {
                    name: "Account Settings",
                    img: require("../assets/icons/Settings.svg"),
                    onClick: {
                        method: this.showEl,
                        data: "accountDialog"
                    }
                },
                {
                    name: "Profile",
                    img: require("../assets/icons/User.svg"),
                    onClick:{
                        method: this.changePath,
                        data: "/u/"
                    }
                },
                {
                    name: "Logout",
                    img: require("../assets/icons/LogOut.svg"),
                    onClick: {
                        method: this.logOut
                    }
                }
            ]
        }
    },

    props:{
        submitIconDialog: String,
        distanceFromTop: true,
    },

    methods:{
        ...mapActions(['showEl', "logOut", "changePath"]),

        toggleOverlay(){
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

        toggleOverflow(){
            document.documentElement.style.overflow = '';
        },

        handleScroll () {
            this.scrolled = window.scrollY > 20;
        },

        toggleDarkMode(){
            let parent = this
            let body = document.getElementById("body")
            let isDarkModeOn = parent.darkMode
            
            if (!isDarkModeOn) {
                body.classList.remove('coral--light')
                body.classList.add('coral--dark')
                parent.darkMode = true
            } else{
                body.classList.remove('coral--dark')
                body.classList.add('coral--light')
                parent.darkMode = false
            }
        },

        onDialogOpen(){
            // Set all the dialog compoents as targets
            const targetNode = document.getElementsByTagName("coral-dialog");
            
            // Function to make body overflow when dialog is open, so it doesn't scroll when interacting with the dialog
            function callback(mutationList, observer) {
                mutationList.forEach( (mutation) => {
                    if(mutation.attributeName == "open" && mutation.target.open){
                    document.documentElement.style.overflow = 'hidden';
                    } else if(mutation.attributeName == "open" && !mutation.target.open){
                    document.documentElement.style.overflow = '';
                }
                });
            }
            const observerOptions = { childList: true, attributes: true}
            
            // Add an observer for each dialog target elemnt
            targetNode.forEach((node) => {
                const observer = new MutationObserver(callback);
                observer.observe(node, observerOptions);
            })
        },

    },

    mounted: function(){
        let parent = this

        // Scroll listener to add/remove nav meny shadow
        window.addEventListener('scroll', this.handleScroll);

        // Obvserve everytime the dialog is opened
        parent.onDialogOpen()
        
        if (this.getUser.isAuth) {
            // Set the "Go to profile" button to go to the user that has logged in
            parent.optionsList[1].onClick.data = "/u/" + this.getUser.userData.username
        }

        // Sets light/dark mode based on browser
        let useDark = window.matchMedia('(prefers-color-scheme: dark)');
        // Sets light/dark mode based on browser on first load
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            parent.toggleDarkMode()
        }
        useDark.addListener((evt) => parent.toggleDarkMode());
    },

    computed: {
        ...mapGetters(['getUser']),

    },

    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
}
</script>

<style>

</style>