<template>
  <section class="icon-list-area p-t-48 p-b-40">

    <CarbonAd style="min-height: 200px" adId="homePage"/>

    <UserIconCard
      v-for="icon in userIcons"
      :key="icon.id"
      :icon="icon"
      :isAdmin="false"
      :isMacOs="true"
      :isOwner="isOwner"
    />
  </section>  
</template>

<script>
import UserIconCard from './UserIconCard.vue';
import EditIconDialog from "./EditIconDialog.vue"
import deleteDialog from "./deleteDialog.vue"
import NativeAd from "./NativeAd.vue";
import CarbonAd from "./CarbonAd.vue";

import { mapGetters, mapActions } from 'vuex'
import Parse from 'parse/dist/parse.min.js';

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import deleteIcon from "../assets/icons/delete.svg"

export default {
    name: "UserIconGrid",

    props:{
      userIcons:'',
    },

    components:{
      UserIconCard,
      EditIconDialog,
      deleteDialog,
      CarbonAd,
      NativeAd
    },
    
    data(){
        return{
          coralIcons:{
            delete: deleteIcon,
            addIcon: addCoralIcon,
            newItem: newItemCoralIcon,
            edit: editCoralIcon,
            loading: placeholderCoralIcon,
          },
          isAd: false,

          isOwner: false,
        }
    },
    
    mounted: function(){
      let parent = this
      let currentUser = Parse.User.current();
      let requestedUser = this.$route.params.user;

      if (currentUser) {
        let userMatches = currentUser.get("username") == requestedUser;
        parent.isOwner = userMatches
      }

      console.log(this.isIconSaved());

      // function getAd(){
      //   try {
      //     if (typeof _bsa !== 'undefined'  && _bsa) {
      //     _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
      //       {
      //         target: '#card-ad',
      //         template: `
      //             <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link">
      //             <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
      //               <div class="bsa-icon" style="background-image: url(##logo##);"></div>
      //             </div>
      //             <div class="text-ad-wrapper">
      //               <img style="background: ##backgroundColor##" src="##image##">
      //               <div class="bsa-desc">##description##</div>
      //             </div>
      //             </a>
      //           `
      //         }
      //       )
            
      //     }
      //   } catch (error) {
      //   }
      // }

      // window.BSANativeCallback = (a) => {
      //   const total = a.ads.length;
      //   let el = document.getElementById('_carbonads_js').children[0]
      // }
      // getAd()


    },

    render (h) {
      return h('div', { class: 'carbon-ads', attrs: { id: 'native-carbon' }})
    },

    methods:{
      ...mapActions(['adClick']),

      isIconSaved(){
        let savedIconsId = this.getSavedIcons.map(({id}) => id )
        console.log(savedIconsId);
        // this.isIconSaved = this.userIcons.filter(icon => icon.isSaved)
      },

      isSelected(selected, option){
        try {
          if (selected.name == option) {
            return true;
          } else {
            return false;
          } 
        } catch (error) {
          return true;
        }
      },

      validate(e, field){
        let parent = this
        try {
          let isInvalid = e.target.classList.contains("is-invalid")

          if (isInvalid) { parent.isValidated = false }
          else{ parent.isValidated = true }

        }catch(error){ }
        parent.getTextFieldValue(e, field)
      },

      getTextFieldValue(e, field){
        let parent = this
        let fieldValue = e.target.value
        console.log(field, ": ", fieldValue);
        // parent.toUpdate[field] = fieldValue
      },
    },

    computed:{
      ...mapGetters([
        'getUser', 
        'allIcons', 
        'notApproved', 
        'getAppCategories',
        'getSelectedIcon',
        'getSavedIcons'
      ]),


    }
}
</script>

<style>

</style>