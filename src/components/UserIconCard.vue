<template>
    <div v-if="!isHidden.isHidden">
        <div
            v-if="!isHidden.isHidden && !isLoading && typeof icon == 'object'"
            :label="printIconName('icon')"
            class="card-wrapper card-hover coral-card m-0"
        >
            <div class="m-auto width-100">
                <div
                    v-if="isSaveable"
                    :id="'saveIcon_'+icon.id"
                    @click="saveIcon()"
                    :class="{
                        'opacity-0': !isSaved,
                        'icon-heart': !isSaved,
                        'icon-heart-filled': isSaved,
                        'save-icon': true,
                    }"
                >
                </div>

                <!-- Icon image -->
                <div class="card-img-wrapper" style="max-width: 120px;">
                    <div @click="showIconDetails">
                        <img
                            :alt="icon.appName + ' icon'"
                            v-lazy="{
                                src: lazyOptions.src,
                                loading: lazyOptions.loading,
                                error: lazyOptions.loading,
                                lifecycle: lazyOptions.lifecycle
                            }" 
                        />
                    </div>

                </div>

                <!-- Icon meta -->
                <div label="Icon info" class="card-text-wrapper p-l-16 p-r-16">

                    <!-- App name -->
                    <h3 class="coral-font-color m-0">
                        {{icon.appName}}
                        <!-- {{icon.appName.replaceAll("_", " ")}} -->
                    </h3>
                    
                    <!-- Credit -->
                    <!-- <p class="coral-Body--XS opacity-70 m-b-4 p-t-4 ellipses-text-2"> -->
                    <div class="coral-Body--XS opacity-70 p-t-4 card-bottom-text-wrapper">
                        <router-link
                            class="coral-Link"
                            :to="'/u/'+icon.usersName"
                        >
                        {{icon.usersName}}
                        </router-link>
                        <span v-if="!hideDate" class="coral-Body--XS m-0">
                            on
                            {{ getDate(icon.timeStamp) }}
                        </span>
                    </div>
                    
                    <div v-if="isOwner" class="p-t-8 p-b-4">
                        <button @click="showDialog('editIconDialog')" is="coral-button" variant="outline">Edit</button>
                    </div>

                </div>

            </div>
            
            <!-- Download Counter -->
            <div v-if="!hideDownloads" label="Download Counter" class="download-counter-wrapper opacity-70">
                <p v-if="icon.downloads > 1" class="coral-Body--XS m-0 d-inline">
                    {{icon.downloads}}
                </p>

                <p v-else class="coral-Body--XS m-0 d-inline">
                    0
                </p>

                <img height="10px" :src="coralIcons.download" alt="Download counter">
            </div>
        </div>
        
        <div
            v-else-if="!isHidden.isHidden"
            class="loading"
        >
             <UserIconCardLoading/>
        </div>
    </div>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { reactive } from 'vue'
import Parse from 'parse/dist/parse.min.js';;

var Icons = Parse.Object.extend("Icons2");

import downloadIcon from "../assets/icons/Download.svg"
import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import heartIcon from "../assets/icons/Category_Icons/Heart.svg"
import deleteIcon from "../assets/icons/delete.svg"

import UserIconCardLoading from './UserIconCardLoading.vue';

export default {
    name: "UserIconCard",
    
    props:{
        icon:{},
        isAdmin: false,
        isOwner: false,
        isSaveable: {
            type: Boolean,
            default: true
        },
        hideDate: {
            type: Boolean,
            default: false
        },
        hideDownloads:{
            type: Boolean,
            default: false
        },
        isMacOs: Boolean,
        isLoading: Boolean,
    },

    components: {
        UserIconCardLoading,
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

    setup(context) {

        function iconUrl(){
            const icon = context.icon;
            try {
                
                if (!icon.lowResPngUrl) {
                    return icon.highResPngUrl
                } else{
                    return icon.lowResPngUrl
                }
            } catch (error) {
                console.log("error fetching icon url: ", error);
            }
        }

        let isHidden = reactive({
            isHidden: context.icon.isHidden
        });

        const lazyOptions = reactive({
            src: iconUrl(),
            loading: placeholderCoralIcon,
            // src: context.iconUrl(context.icon),
            lifecycle: {
                loading: (el) => {
                    // console.log('image loading', el)
                },
                loaded: (el) => {
                    // console.log('image loaded', el)
                },
                error: (el) => {
                    isHidden.isHidden = true
                    return false
                },
            }
        })
        return {
            iconUrl,
            isHidden,
            lazyOptions,
        }
    },
    
    mounted(){
        let iconID = this.icon.id;
        let isSaved = this.getSavedIconsId.includes(iconID)
        this.isSaved = isSaved;
    },

    watch:{
        getSavedIconsId:{
            handler(val, oldVal) {
                let iconID = this.icon.id;
                let isSaved = this.getSavedIconsId.includes(iconID)
                this.isSaved = isSaved;
            }
        }
    },

    methods:{
        ...mapActions([
            'showEl',
            'setSelectedIcon',
            'addClickCount',
            'setData'
        ]),

        showIconDetails() {
            // Update URL with icon ID
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('icon', this.icon.id);
            window.history.pushState({}, '', newUrl);

            // Set selected icon and show modal
            this.setSelectedIcon(this.icon);
            this.$emit('showDetails', this.icon);
            this.showEl('iconDetailsDialog');
        },

        iconClick(icon){
            this.addClickCount(icon);
            this.setData({arr: 'selectedIcon', data: icon});
            this.setData({arr: 'refreshAd', data: true});
            this.showDialog('iconDialog');
        },

        showDialog(id){
            let parent = this
            parent.setSelectedIcon(parent.icon)
            parent.showEl(id)
        },

        printIconName(string){
            try {
                return this.icon.appName.replaceAll('_', ' ') + string
            } catch (error) {
                return this.icon.appName
            }
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

        async saveIcon(){
            let parent = this
            // console.log("Hii");
            // return
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
            
            // If isSaved is true, remove from database
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
            'getSavedIconsId',
        ]),

        iconDownloadUrl(){
            const icon = this.icon
            try {
                if (this.isMacOs) {
                    // console.log(icon);
                    return icon.icnsUrl
                } else{
                    return icon.iOSUrl
                }
            } catch (error) {
                // console.log("error fetching icon url: ", error);
            }
        },
    }
}
</script>

<style>

</style>
