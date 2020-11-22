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
import * as firebase from "firebase";
const storage = firebase.storage();
const db = firebase.firestore();

export default {
    name:"deleteDialog",

    props:{
        icon: {},
    },

    methods:{
        deleteIcon(icon){
            let parent = this
            console.log(icon);
            
            let fileRefIcns = storage.ref().child("icons_approved/"+icon.icnsFileName)
            
            fileRefIcns.delete().then(function() {
                    console.log(icon.appName, " deleted successfully.");
                })
            .catch((error)=>{
                console.log("Uh-oh, an error occurred with: ", icon.appName, " with ID: ", icon.id);
                console.log(error);
            })

            // Delete object from Firestore
            db.collection("submissions").doc(icon.objectID).delete().then(function() {
                console.log("Document successfully deleted!");
                parent.$store.dispatch('deleteItem', icon)
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        },
    }
    
}
</script>

<style>

</style>