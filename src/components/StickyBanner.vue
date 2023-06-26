<template>
    <div v-if="showStickyBanner" id="stickyBanner">
        <div class="sticky-banner card-wrapper card-hover mobile-hidden coral-card">
            <div class="lgbt-wrapper">
    
                <div @click="closeBanner" class="close-add-btn">
                    <svg style="z-index: 9; width: 12px; height: 12px" class="icon icon-absolute" xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 12 12">
                        <title>CrossLarge</title>
                        <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
                    </svg>
                </div>
    
                <!-- <div style="z-index: 2" class="card-grid-nativeAd">
                                        <div
                                          class="card-ad2">
                                        </div>
                                      </div> -->
    
                <!-- <CarbonAd
                                      adId="carbonAd"
                                    /> -->
    
                <NativeAd :template="3" key="CWYDCK3E" adId="CWYDCK3E" zoneKey="CWYDCK3E" />
    
                <a class="card-no-ad absolute" rel="noopener" href="https://www.webbites.io" target="_blank">
                    <img
                        :src="webbitesAd"
                        class="ad-banner-image"
                        width="38"
                        height="38"
                        alt="WebBites.io"
                    />
                    <div class="support-page">
                        <p class="coral-Body--S m-0">
                           Introducing <a href="https://www.webbites.io/?utm_source=macOSicons.com&utm_medium=topBanner&utm_campaign=waitlist">WebBites.io</a>, a new smart bookmarking service powered by AI.
                        </p>
                    </div>
                </a>
    
            </div>
    
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NativeAd from "./NativeAd.vue";
import CarbonAd from "./CarbonAd.vue";

import WebBitesLogo from "../assets/webbites-logo-small.png"
import og_webbites from "../assets/og_webbites.jpg"
import webbitesAd from "../assets/WebbitesAd.jpg"

import lgbtIcon from "../assets/Resources/lgbt.png"

export default {
    name: "StickyBanner",

    props: {
        sponsored: '',
        fullWidth: '',
        adId: '',
    },

    components: {
        NativeAd,
        CarbonAd
    },

    data() {
        return {
            imgs: {
                lgbt: lgbtIcon
            },
            showStickyBanner: true,
            WebBitesLogo: WebBitesLogo,
            og_webbites: og_webbites,
            webbitesAd: webbitesAd,
        }
    },

    mounted() {
        // setTimeout(() => {
        //     let childCount = document.getElementById("CWYDCK3E").childElementCount;
        //     if (childCount == 0) {
        //         this.closeBanner()
        //     }
        // }, 1600);
    },

    watch: {
        $route(to, from) {}
    },

    methods: {
        ...mapActions(['showEl', 'setSelectedIcon', 'addClickCount', 'adClick']),

        closeBanner() {
            // document.getElementById("stickyBanner").remove()
            this.showStickyBanner = false;
        },
    }

}
</script>

<style>
</style>