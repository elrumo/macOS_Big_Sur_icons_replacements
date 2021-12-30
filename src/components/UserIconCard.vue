<template>
    <div :label="icon.appName.replaceAll('_', ' ') + 'Icon'" class="card-wrapper card-hover coral-card m-0">
        
        <SaveIconsDialogue/>

        <div class="m-auto width-100">
            
            <div
                :id="'saveIcon_'+icon.id"
                @click="saveIcon()"
                :class="{
                    'opacity-0': !isSaved,
                    'icon-heart': !isSaved,
                    'icon-heart-filled': isSaved,
                    'save-icon': true,
                }"
            > </div>

            <!-- Icon image -->
            <div class="card-img-wrapper" style="max-width: 120px;">
                
                <!-- macOS icon download -->
                <a
                    v-if="true"
                    rel="noopener"
                    :href="iconDownloadUrl"
                    @click="addClickCount(icon)"
                    target="_blank"
                >

                    <v-lazy-image
                        :src-placeholder="coralIcons.loading"
                        :alt="icon.appName +' icon'"
                        :src="iconUrl(icon)"
                    />
                </a>

            </div>

            <!-- Icon meta -->
            <div label="Icon info" class="card-text-wrapper p-l-16 p-r-16">

                <!-- App name -->
                <h3 class="coral-font-color m-0">
                    {{icon.appName.replaceAll("_", " ")}}
                </h3>
                
                <!-- Credit -->
                <p class="coral-Body--XS opacity-70 m-b-4 p-t-4">
                    <router-link :to="'/u/'+icon.usersName" class="coral-Link">{{icon.usersName}}</router-link>
                    on
                    <span class="coral-Body--XS">
                        {{ getDate(icon.timeStamp) }}
                    </span>
                </p>
                
                <!-- <div v-if="isOwner" class="p-t-8 p-b-4">
                    <button @click="showDialog('editIconDialog')" is="coral-button" variant="outline">Edit</button>
                </div> -->

            </div>

        </div>
        
        <!-- Download Counter -->
        <div label="Download Counter" class="download-counter-wrapper opacity-70">
            <p v-if="icon.downloads > 1" class="coral-Body--XS m-0 d-inline">
                {{icon.downloads}}
            </p>

            <p v-else class="coral-Body--XS m-0 d-inline">
                0
            </p>

            <img height="10px" :src="coralIcons.download" alt="Download counter">
        </div>
    </div>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Parse from 'parse/dist/parse.min.js';;

import deleteDialog from './deleteDialog.vue';
import SaveIconsDialogue from './SaveIconsDialogue.vue';
import EditIconDialog from "./EditIconDialog.vue"
import VLazyImage from "v-lazy-image";

var Icons = Parse.Object.extend("Icons2");

import downloadIcon from "../assets/icons/Download.svg"
import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import heartIcon from "../assets/icons/Category_Icons/Heart.svg"
import deleteIcon from "../assets/icons/delete.svg"

export default {
    name: "UserIconCard",
    
    props:{
        icon:{},
        isAdmin: false,
        isOwner: false,
        isMacOs: Boolean,
    },

    components: {
        EditIconDialog,
        deleteDialog,
        SaveIconsDialogue,
        VLazyImage
    },

    data(){
        return{
            coralIcons:{
                download: downloadIcon,
                delete: deleteIcon,
                addIcon: addCoralIcon,
                newItem: newItemCoralIcon,
                edit: editCoralIcon,
                loading: placeholderCoralIcon,
            },
            icons:{
                Heart: heartIcon
            },
            dialog:{
                editIcon: false,
                deleteIcon: false
            },
            isSaved: false
        }
    },
    
    mounted(){
        console.log(this.icon.isSaved);
        this.isSaved = this.icon.isSaved;
    },

    methods:{
        ...mapActions(['showEl', 'setSelectedIcon', 'addClickCount']),

        prettifyName(name){
            console.log("name: ", name);
            name = name.replaceAll("_", " ")
            return name
        },

        iconUrl(icon){
            if (!icon.lowResPngUrl) {
                return icon.highResPngUrl
            } else{
                return icon.lowResPngUrl
            }
        },

        showDialog(id){
            let parent = this
            parent.setSelectedIcon(parent.icon)
            parent.showEl(id)
        },
        
        getDate(timeStamp){
            let newDate = new Date(timeStamp)
            let date
            
            let day = newDate.getUTCDate()
                if (day < 10) {
                day = "0"+day
                }
            let month = newDate.getUTCMonth() + 1
                if (month < 10) {
                month = "0"+month
                }
            let year = newDate.getFullYear()

            if(this.getUserAttributes.usaDateFormat){
                 date = month + "/" + day + "/" + year
                return date
            }

            date = day + "/" + month + "/" + year
            return date
        },

        async editDoc(icon, e, field){
            let newName = e.target.value
            
            let id
            if (icon.algoliaID == undefined) {
                id = icon.id
            } else {
                id = icon.algoliaID
            }

            console.log(icon);
            console.log(id);

            const IconsBase = Parse.Object.extend("Icons2");
            const query = new Parse.Query(IconsBase);
            const docToEdit = await query.get(id)

            docToEdit.set({ [field]: newName }) // Save icnsToStore obj with .icns file and its url to Parse server
            docToEdit.save().then(() =>{
                console.log(field, "updated.");
            }).catch((e) =>{
                document.getElementById("error").show()
            })
        },

        async saveIcon(){
            let parent = this
            
            if(!Parse.User.current()){
                this.showDialog('SaveIconsDialogue')
                return
            }

            let icon = parent.icon
            var Icons = Parse.Object.extend("Icons2");
            let iconQuery = new Parse.Query(Icons);
            console.log(icon);
            icon = await iconQuery.get(icon.id)
            let userRelation = Parse.User.current().relation("favIcons")
            
            // If isSaved is true, remove from databse
            if (parent.isSaved) {
                userRelation.remove(icon)
            } else{
                userRelation.add(icon)
            }

            Parse.User.current().save().then((data) =>{
                parent.isSaved = !parent.isSaved
                console.log("SAVED!!!");
            }).catch((e) =>{
                console.log("ERROR: ", e);
            })
        },

    },

    computed:{
        ...mapGetters([
            'getUserAttributes',
        ]),

        iconDownloadUrl(){
            let icon = this.icon
            if (this.isMacOs) {
                return icon.icnsUrl
            } else{
                return icon.iOSUrl
            }
        },
    }
}
</script>

<style>

</style>