<template>
    <div id="statusPill" class="new-pill" v-if="isNew(item)">
        <coral-status variant="info">New</coral-status>
    </div>
</template>

<script>

export default {
    name: "IsNew",
    
    props:{
        item:{},
    },

    methods:{
        isNew(item){
            let isFeatured = item.isFeatured ? true : false;
            let hours = 48 * 3600000
            let postDate = new Date(item.createdAt).valueOf() + hours
            let dateNow = new Date().valueOf()
            
            return isFeatured || dateNow < postDate;
        }
    },

}
</script>

<style lang="scss">
</style>