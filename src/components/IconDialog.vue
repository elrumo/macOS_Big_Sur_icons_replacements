<template>
    <coral-dialog
        :ref="'iconDialog'+getSelectedIcon.appName"
        id="iconDialog"
        style="text-align: left;"
    >
        <coral-dialog-header>
            {{ getSelectedIcon.appName }}
        </coral-dialog-header>

        <coral-dialog-content style="max-width: 650px">
            <!-- <p class="coral-Body--M" v-html="markItDown(getHomeDialog.content)">
            </p> -->
            <div class="icon-download-dialog" v-if="getSelectedIcon.usersName">
                <a :href="iconDownloadUrl(getSelectedIcon)">
                    {{ getSelectedIcon }}
                    <img
                        :alt="getSelectedIcon.appName + ' icon'"
                        v-lazy="{
                            src: getSelectedIcon.lowResPngUrl,
                            loading: loadingIconImg,
                            error: loadingIconImg,
                        }" 
                    />
                </a>

                <div class="icon-download-details">
                    <!-- <p> {{ getCategory(getSelectedIcon) }} </p>
                    · -->
                    <p> {{ getSelectedIcon.downloads }} downloads</p>
                    ·
                    <div>
                        <p>
                            By 
                            <router-link class="coral-Link" :to="'/u/' + getSelectedIcon.usersName">
                                {{ getSelectedIcon.usersName }}
                            </router-link>
                            on
                            {{ getDate(getSelectedIcon.timeStamp) }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="similarIcons.length > 0">
                <h3>Related icons</h3>
                
                <div class="similar-icons-wrapper">
                    <UserIconCard
                        v-for="icon in getSimilarIcons"
                        :key="icon.appName+icon.id+Math.floor(Math.random() * 10000000 + 1)"
                        :icon="icon"
                        :isAdmin="false"
                        :isMacOs="true"
                        :hideDownloads="false"
                        :hideDate="true"
                        :hideUser="false"
                        :isSaveable="false"
                    />
                </div>
            </div>
        </coral-dialog-content>

        <coral-dialog-footer>
            <button
                is="coral-button"
                variant="CTA"
                coral-close=""
            >
                Close
            </button>
        </coral-dialog-footer>
    </coral-dialog>
</template>

<script>
import { marked } from 'marked';
import { mapGetters, mapActions } from 'vuex'
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import UserIconCard from './UserIconCard.vue';

import Parse from 'parse/dist/parse.min.js'

// Parse classes will be initialized lazily
let Icons = null;
let Categories = null;
function getIconsClass() {
  if (!Icons && Parse.Object) Icons = Parse.Object.extend("Icons2");
  return Icons;
}
function getCategoriesClass() {
  if (!Categories && Parse.Object) Categories = Parse.Object.extend("Categories");
  return Categories;
}

import algoliasearch from 'algoliasearch'
const client = algoliasearch(import.meta.env.VITE_ALGOLIA_APPID, import.meta.env.VITE_ALGOLIA_KEY);
var algoliaIndex = client.initIndex('macOSicons')

export default {
    name: "IconDialog",

    components:{
        UserIconCard
    },
    
    data(){
        return{
            loadingIconImg: placeholderCoralIcon,
            similarIcons: []
        }
    },

    async mounted(){
    },

    props:{
        isMacOs: {
            type: Boolean,
            default: true
        }
    },

    watch: {
        getSelectedIcon: function (newVal, oldVal) {
            this.fetchSimilarIcons(newVal)
        }
    },

    methods:{
        // ...mapActions(),

        async fetchSimilarIcons(icon){
            try {
                let algoliaSearch = await algoliaIndex.search(icon.appName, { hitsPerPage: 4 })
                this.similarIcons = algoliaSearch.hits
                console.log(algoliaSearch.hits);
            } catch (error) {
                console.log(error);
            }
        },

        iconDownloadUrl(icon) {
            if (this.isMacOs) {
                return icon.icnsUrl
            } else {
                return icon.iOSUrl
            }
        },

        getCategory(icon){

            return this.getAppCategories.find(category => category.id === icon.category).name;
        },

        markItDown(content){
            try {
                return marked(content);
            } catch (error) {
                return content;
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

            date = day + "/" + month + "/" + year
            return date
        },

    },

    computed: {
        ...mapGetters([
            'getSelectedIcon',
            'getAppCategories'
        ]),

        getSimilarIcons(){
            return this.similarIcons.filter((icon) => {
                return icon.objectID !== this.getSelectedIcon.id
            })
        }
    },

    unmounted () {
    },
}
</script>

<style>

</style>