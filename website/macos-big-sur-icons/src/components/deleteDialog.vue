<template>
    <!-- Delete confirmation -->
    <coral-dialog :id="'deleteDialog'">
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
import Vue from 'vue'


export default {
    name:"deleteDialog",

    props:{
        icon: {},
        Icons: "",
        Parse: ""
    },

    methods:{
        async deleteIcon(icon){
            let parent = this
            let Parse = parent.Parse
            
            console.log("icon: ", icon.objectID)
            console.log("appName: ", icon.appName);
            let query = new Parse.Query(parent.Icons)
            let docToDelete = await query.get(icon.objectID);

            docToDelete.destroy().then(() =>{
                parent.$store.dispatch('deleteItem', icon)
                // Vue.delete(parent.icons[icon.usersName].icons, icon.appName) // Delete object locally
            }).catch((e) =>{
                console.log("e: ", e);
            })
            
        },
    }
    
}
</script>

<style>

</style>