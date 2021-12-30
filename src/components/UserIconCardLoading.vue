<template>
    <div class="card-wrapper card-hover coral-card">
        
        <!-- Icon image -->
        <div class="card-img-wrapper" style="max-width: 120px;">        

            <img
                class="placeholder-icon"
                alt="Placeholder icon"
                :src="coralIcons.placeholderIcon"
            >
        </div>

        <!-- Icon meta -->
        <div class="card-text-wrapper p-l-16 p-r-16 p-b-16">

            <!-- App name -->
            <h3
                class="
                    coral-font-color
                    m-t-0
                    m-b-8
                    loading-placeholder
                    loading-placeholder-large
                    p-0
                "
            >
            </h3>

            <!-- User's name -->
            <p class="coral-Body--XS opacity-60 m-b-8 loading-placeholder loading-placeholder-medium">
            </p>

            <!-- User's name -->
            <p class="coral-Body--XS opacity-60 loading-placeholder loading-placeholder-small">
            </p>

        </div>

    </div>
</template>

<script>

import placeholderIcon from "../assets/placeholder-icon.png"

export default {
    name: "UserIconCardLoading",
    
    props:{
    },

    data: function(){
        return{
            coralIcons:{
                placeholderIcon: placeholderIcon,
            }
        }
    },
    
    methods:{
    }
}
</script>

<style lang="css">

    .loading-placeholder{
        margin: auto;
        position: relative;
        height: auto;
        width: 100%;
        border-radius: 2px;
        background: rgb(90 90 90);
        overflow: hidden;
    }

    .loading-placeholder::after{
        transform: translateY(-50%);
        top: 50%;
        height: 100%;
        width: 50%;
        content: " ";
        position: absolute;
        animation: placeholder 2s ease-out infinite;
        background: linear-gradient( 90deg , rgb(90 90 90 / 0%) 0%, rgb(109 109 109) 50%, rgb(90 90 90 / 0%) 100%);
    }

    .loading-placeholder-large{
        min-height: 20px;
    }

    
    .loading-placeholder-medium{
        min-height: 16px;
    }

    .loading-placeholder-small{
        min-height: 10px;
        width: 18px !important;
    }

    @keyframes placeholder {
        0% {
        left: -25%;
        }
        50% {
        left: 75%;
        }
        100% {
        opacity: 0;
        /* left: -25%; */
        }
    }

</style>