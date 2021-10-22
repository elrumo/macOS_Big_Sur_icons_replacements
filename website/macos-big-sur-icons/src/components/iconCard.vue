<template>
    <div>
        <div class="card-wrapper coral-card">

            <div class="card-img-wrapper" style="max-width: 120px;">
                <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :data-src="icon.pngUrl">
                </div>
                
                <coral-quickactions placement="center" target="_prev">
                    <coral-quickactions-item type="button" @click="showDialog('deleteDialog', icon)" :id="icon.fileName" :icon="coralIcons.delete">Remove file</coral-quickactions-item>
                </coral-quickactions>
            </div>

            <div class="p-l-15 p-r-15 p-b-5 card-text-wrapper">
                <h3 class="coral-font-color">
                        <input class="editable-input" @change="editDoc(icon, $event, 'appName', false)" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                </h3>

                <p class="coral-Body--XS p-b-10 opacity-60">By <a class="coral-Link" :href="icon.credit" target="_blank">{{icon.usersName}}</a></p>
                
                <div class="p-t-10">
                    <button @click="approveIcon(icon)" is="coral-button">Approve</button>

                    <div class="filler-space"></div>

                    <a class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission'">
                    <button is="coral-button" variant="quiet">
                        Contact
                    </button>
                    </a>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// import Vue from 'vue';
// import * as firebase from "firebase";

// let firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_KEY,
//   messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_APP_ID,
//   measurementId: process.env.VUE_APP_MEASUREMENT_ID,
//   authDomain: "macos-icons.firebaseapp.com",
//   databaseURL: "https://macos-icons.firebaseio.com",
//   projectId: "macos-icons",
//   storageBucket: "macos-icons.appspot.com"
// };
// firebase.initializeApp(firebaseConfig);

// let db = firebase.firestore();
// let storage = firebase.storage();

export default {
    name: "IconCard",
    
    props:{
        icon:{},
    },

    data: function(){
        return{
            coralIcons:{
                addIcon: require("../assets/icons/add.svg"),
                delete: require("../assets/icons/delete.svg"),
                newItem: require("../assets/icons/newItem.svg"),
                edit: require("../assets/icons/edit.svg"),
                loading: require("../assets/loading.gif"),
            }
        }
    },
    
    methods:{

        prettifyName(name){
            for(let i in name){
                name = name.replace("_", " ")
            }
            return name
        },

        showDialog(dialogId){
            let parent = this
            document.getElementById(dialogId).show()
        },

        deleteIcon(icon){
            let parent = this
            console.log(icon);
    
            // let fileRef = storage.ref().child(icon.iconRef)
            
            // fileRef.delete().then(function() {
            // console.log(icon.appName, " deleted successfully.");
            // }).catch(function(error) {
            // console.log("Uh-oh, an error occurred with: ", icon.appName, " with ID: ", icon.id);
            // });

            // // Delete object from Firestore
            // db.collection("submissions").doc(icon.id).delete().then(function() {
            // console.log("Document successfully deleted!");
            

            // Vue.delete(parent.icons[icon.usersName].icons, icon.appName) // Delete object locally
            
            // if (Object.keys(parent.icons[icon.usersName].icons).length == 0 ) { // Delete user from UI if no icons are left
            //     Vue.delete(parent.icons, icon.usersName)
            // }
            
            // }).catch(function(error) {
            //     console.error("Error removing document: ", error);
            // });

        },

        editDoc(icon, e, field, isMultipleIcons){
            let newName = e.target.value

            console.log(icon);
            console.log(newName);

            // db.collection("submissions").doc(icon.id).update({
            //     [field]: newName
            // }).then(function() {
            //     console.log("Document successfully updated!");
            // }).catch(function(error) {
            //     // The document probably doesn't exist.
            //     console.error("Error updating document: ", error);
            // });
        },

    }
}
</script>

<style>

</style>