<template>
    <coral-dialog
      id="iconDialog"
      style="text-align: left;"
    >
        <coral-dialog-header>
            {{ getSelectedIcon.appName }}
        </coral-dialog-header>

        <coral-dialog-content style="max-width: 650px">
            <!-- <p class="coral-Body--M" v-html="markItDown(getHomeDialog.content)">
            </p> -->
            <div v-if="getSelectedIcon.usersName">
                <img
                    :alt="getSelectedIcon.appName + ' icon'"
                    v-lazy="{
                        src: getSelectedIcon.lowResPngUrl,
                        loading: loadingIconImg,
                        error: loadingIconImg,
                    }" 
                />
                {{ getCategory(getSelectedIcon) }}
                {{ getSelectedIcon.usersName }}
                {{ getSelectedIcon.downloads }}
                {{ getDate(getSelectedIcon.timeStamp) }}
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

export default {
    name: "IconDialog",

    components:{
    },
    
    data(){
        return{
            loadingIconImg: placeholderCoralIcon,
        }
    },

    props:{
    },

    methods:{
        ...mapActions(),

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
    },

    unmounted () {
    },
}
</script>

<style>

</style>