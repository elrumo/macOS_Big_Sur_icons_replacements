<template>
    <div class="card-wrapper card-hover coral-card">
        
        <!-- Icon image -->
        <div class="card-img-wrapper" style="max-width: 120px;">        
            <img
                width="100px"
                height="100px"
                style="width: auto"
                class="placeholder-icon"
                alt="Placeholder icon"
                :src="coralIcons.placeholderIcon"
            >
        </div>

        <!-- Icon meta -->
        <div class="card-text-wrapper p-l-15 p-r-15 p-b-15">

            <!-- App name -->
            <h3
                class="
                    coral-font-color
                    m-t-0
                    m-b-10
                    loading-placeholder
                    p-0
                "
            >
            </h3>

            <!-- User's name -->
            <p class="coral-Body--XS opacity-60 m-b-10 loading-placeholder">
            </p>

        </div>

    </div>
</template>

<script>

export default {
    name: "UserIconCardLoading",
    
    props:{
        icon:{},
    },

    data: function(){
        return{
            coralIcons:{
                placeholderIcon: require("../assets/placeholder-icon.png"),
            }
        }
    },
    
    methods:{
    }
}
</script>

<style>

</style>