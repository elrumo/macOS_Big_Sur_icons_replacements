<template>
    <!-- Delete confirmation -->
    <coral-dialog id="deleteDialog">
        <coral-dialog-header>Are you sure you want to delete {{icon.appName}}?</coral-dialog-header>
        
        <coral-dialog-content>  
            This action cannot be undone.
        </coral-dialog-content>

        <coral-dialog-footer>
            <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
            <button is="coral-button" variant="warning" coral-close="" @click="deleteIcon(icon)">Delete</button>
        </coral-dialog-footer>
    </coral-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import Parse from 'parse/dist/parse.min.js';

export default {
    name:"deleteDialog",

    props:{
        icon: {},
    },

    methods:{
        ...mapActions(['showToast', 'deleteItem', 'handleParseError']),

        async deleteIcon(icon){
            let parent = this
            var Icons = Parse.Object.extend("Icons2");
            let dialogId = document.getElementById('editIconDialog')

            console.log("iconId: ", icon.id)
            console.log("appName: ", icon.appName);
            let query = new Parse.Query(Icons)
            let docToDelete = await query.get(icon.id);

            docToDelete.destroy().then(() =>{
                parent.$store.dispatch('deleteItem', icon)
                dialogId.hide()
                parent.showToast({
                    id: "toastMessage",
                    message: icon.appName+" has been deleted.",
                    variant: "success"
                })
            }).catch((error) =>{
                this.handleParseError(error)
            })
            
        },
    }
    
}
</script>

<style>

</style>