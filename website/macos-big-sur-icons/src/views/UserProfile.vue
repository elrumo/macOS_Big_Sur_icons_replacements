<template>
<div>

  <section class="profile-page-head-wrapper">
    <img class="profile-img-wrapper" :src="sources.profilePic" alt="">

    <div class="profile-info-wrapper">
      <div class="profile-header-wrapper">
        <div class="profile-name-social">
          <h3 class="coral-Heading--L m-0">
            {{ getUser.userData.username }}
          </h3>
          <a href="" class="margin-auto">
            <IconUI class="" width="22px" :img="sources.twitter" alt="Twitter Logo"/>
          </a>
        </div>
        <div class="profile-edit-btn opacity-80">
          <button
            is="coral-button"
            variant="quiet"
            @click="showDialog('accountDialog')"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div class="profile-descrption-box">
        <p class="coral-Body--L">
          {{ getUser.userData.bio }}
          <!-- I design products by day at the British Heart Foundation and take photos of bands by night. Creator of macOSicons.com. -->
        </p>
      </div>

    </div>
  </section>

  <!-- <hr width="90%" class="coral-Divider--S"> -->

  
  <section class="m-auto user-profile-icons">
    <coral-tablist>
      <coral-tab aria-label="All Icons" @click="changeIconStatus('all')">All</coral-tab>
      <coral-tab aria-label="Approved Icons" selected="" @click="changeIconStatus('approved')">Approved</coral-tab>
      <coral-tab aria-label="Waiting Icons" @click="changeIconStatus('notApproved')">Waiting</coral-tab>
      
      <select
        id="order-selector"
        class="dropdown-select right-align-tablist dropdown-select-quiet"
        v-on:change="validate($event, 'category')"
      >
        <option
          value="Recent Uploads"
          selected=""
        >
          Recent Uploads
        </option>

        <option
          value="Recent Uploads"
          selected=""
        >
          Popular Uploads
        </option>
      </select>
    </coral-tablist>

    <UserIconGrid :userIcons="userIcons"/>
  </section>    


  

</div>
</template>

<script>
// @ is an alias to /src
import IconUI from '@/components/IconUI.vue';
import UserIconGrid from '@/components/UserIconGrid.vue';
import Parse from 'parse'
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'UserProfile',
  
  components: {
      IconUI,
      UserIconGrid
  },

  data(){
    return {
      sources:{
        twitter: require("../assets/icons/twitter.svg"),
        profilePic: require("../assets/Resources/accounts/profilePic.png"),
      },

      iconsToShow: "approved",

      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/no-app-icon.png"),
      }
    }
  },

  methods: {
    ...mapActions(["fetchUserIcons", "fetchAppCategories"]),

    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    changeIconStatus(status) {
      let parent = this
      parent.iconsToShow = status
    }

  },

  mounted: function(){
    // Get all user iconsOrder
    this.fetchUserIcons()
    this.fetchAppCategories()
  },

  computed:{
    ...mapGetters(['getUser', 'getUserIcons', 'notApproved', 'approvedIcons', 'getAppCategories']),

    // userIcons(){
    //   return this.$store.getters.notApproved
    // }

    userIcons(){
      let parent = this

      switch (parent.iconsToShow) {
        case "all":
          return parent.getUserIcons

        case "approved":
          return parent.approvedIcons

        case "notApproved":
          return parent.notApproved
    
        default:
          break;
      }

    }

  }
}

</script>


<style>
  
  .user-icon-card{
    text-align: left;
  }

  .icon-card-wrapper{
    display: grid;
    grid-template-rows: 2px auto auto;
  }

  /* //////////////////////////////////////////////////////////////// */

  .user-profile-icons{
    max-width: 1150px;
    margin: auto;
    width: var(--page-width);
  }

  .right-align-tablist{
    margin-left: auto !important;
    max-width: 148px;
  }

  .profile-page-head-wrapper{
    display: grid;
    grid-template-columns: 64px auto;
    margin: auto;
    gap: 25px;
    max-width: 480px;
    padding-top: 80px;
    padding-bottom: 20px;
    text-align: left;
  }
  
  .profile-img-wrapper{
    width: 100%;
    height: auto;
  }

  .profile-header-wrapper{
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
  }

  .profile-info-wrapper{
    display: grid;
    gap: 10px;
    grid-template-columns: auto;
  }

  .profile-edit-btn{
    width: fit-content;
    height: fit-content;
    margin: auto 0 auto auto;
  }

  .profile-name-social{
    display: grid;
    grid-template-columns: auto auto;
    width: fit-content;
    height: fit-content;
    gap: 15px;
    margin: auto auto auto 0;
  }


</style>