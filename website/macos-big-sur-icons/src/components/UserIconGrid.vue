<template>
  <div>

    <section class="icon-list-area p-t-48 p-b-40">

      <div class="card-wrapper card-hover coral-card">
        
        <div 
          @click="adClick({position: 'User Icon Grid', type: 'Native'})" 
          class="absolute card-grid-nativeAd"
          style="z-index: 2; height: 100%"
        >
          <div id="card-ad">
          </div>
        </div>

        <div 
          @click="adClick({position: 'User Icon Grid', type: 'Carbon'})"  
          class="absolute" 
          style="z-index: 1; height: 100%"
        >
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
        </div>

          <a
            class="card-no-ad relative"
            href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
            rel="noopener"
            target="_blank"
            style="width: 100%; left: 0;"
            @click="logDonation('support-message')"
          >
            <div class="support-page">
              <h3 class="coral-Heading--S m-0">
                Support this page
              </h3>
              <p class="coral-Body--S m-0">
                Please consider disabling your ad blocker or making a
                <a  
                  rel="noopener"
                  class="coral-Link"
                  target="_blank"
                  href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                >
                  donation 
                </a>
                to support this project.
              </p>
            </div>
          </a>

      </div>

      <UserIconCard 
        v-for="icon in userIcons"
        :key="icon.id"
        :icon="icon"
        :isAdmin="false"
        :isMacOs="true"
        :isOwner="isOwner"
      />
    </section>  

  </div>
</template>

<script>
import UserIconCard from './UserIconCard.vue';
import EditIconDialog from "./EditIconDialog.vue"
import deleteDialog from "./deleteDialog.vue"

import { mapGetters, mapActions } from 'vuex'
import Parse from 'parse'

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import deleteIcon from "../assets/delete.png"

export default {
    name:"UserIconGrid",

    props:{
      userIcons:'',
    },

    components:{
      UserIconCard,
      EditIconDialog,
      deleteDialog
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

      function getAd(){
        try {
          if (typeof _bsa !== 'undefined'  && _bsa) {
          _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
            {
              target: '#card-ad',
              template: `
                  <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link">
                  <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
                    <div class="bsa-icon" style="background-image: url(##logo##);"></div>
                  </div>
                  <div class="text-ad-wrapper">
                    <img style="background: ##backgroundColor##" src="##image##">
                    <div class="bsa-desc">##description##</div>
                  </div>
                  </a>
                `
              }
            )
            
          }
        } catch (error) {
        }
      }

      window.BSANativeCallback = (a) => {
        const total = a.ads.length;
        let el = document.getElementById('_carbonads_js').children[0]
      }
      getAd()


    },

    render (h) {
      return h('div', { class: 'carbon-ads', attrs: { id: 'native-carbon' }})
    },

    methods:{
      ...mapActions(['adClick']),

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
        'getSelectedIcon'
      ]),


    }
}
</script>

<style>

</style>