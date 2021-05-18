<template>
  <div>

    <section class="profile-page-head-wrapper">
      <div class="profile-page-img-wrapper">
        <img class="profile-img" :src="resources.profilePic" alt="">

        <div class="profile-edit-btn desktop-hidden opacity-80">
            <button
              is="coral-button"
              variant="quiet"
              @click="showDialog('accountDialog')"
            >
              Edit Profile
            </button>
          </div>

      </div>
      
      <!-- User info -->
      <div class="profile-info-wrapper">
        <div class="profile-header-wrapper">
          
          <div class="profile-name-social">
            <h3 class="coral-Heading--L m-0">
              {{ user.username }}
            </h3>
            
            <a v-if="user.twitterHandle" target="_blank" :href="user.twitterHandle" class="margin-auto relative">
              <IconUI class="absolute-center-vertical" width="22px" :img="resources.twitter" alt="Twitter Logo"/>
            </a>
            <a v-if="user.twitterHandle" target="_blank" :href="user.twitterHandle" class="margin-auto relative">
              <IconUI class="absolute-center-vertical" width="22px" :img="resources.share" alt="Twitter Logo"/>
            </a>
          </div>

          <div class="profile-edit-btn mobile-hidden opacity-80">
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
          <div v-if="user.loading" class="loading-placeholder"></div>
          <p v-if="user.bio" class="coral-Body--L">
            {{ user.bio }}
            <!-- {{ user.userData.bio }} -->
            <!-- I design products by day at the British Heart Foundation and take photos of bands by night. Creator of macOSicons.com. -->
          </p>
        </div>

      </div>
    </section>
    
    <section class="m-auto user-profile-icons">
      <coral-tablist>
        <coral-tab aria-label="All Icons" @click="changeIconStatus('all')">All</coral-tab>
        <coral-tab aria-label="Approved Icons" selected="" @click="changeIconStatus('approved')">Approved</coral-tab>
        <coral-tab aria-label="Waiting Icons" @click="changeIconStatus('notApproved')">Waiting</coral-tab>
        
        <!-- <select
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
        </select> -->
      </coral-tablist>

      <UserIconGrid v-if="userIcons.length != 0" :userIcons="userIcons"/>
      <div v-else class="waiting-wrapper">
        <p class="coral-Body--M">
          {{ errorMessage }}
          <!-- {{ user.username }} hasn't submitted any icons yet. -->
        </p>
      </div>

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
      resources:{
        twitter: require("../assets/icons/twitter.svg"),
        share: require("../assets/icons/share.svg"),
        profilePic: require("../assets/Resources/accounts/profilePic.png"),
      },

      iconsToShow: "approved",

      errorMessage: "",

      user:{
        loading: true
      },

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
    ...mapActions(["fetchUserIcons", "fetchAppCategories", "emptyArr"]),

    async queryUser(){
      let parent = this
      let user = parent.user
      user.username = this.$route.params.user // Set username same as the url user

      const queryUser = new Parse.Query(Parse.User);
      queryUser.matches("username", user.username, "i")
      let userInfo = await queryUser.find()

      userInfo = userInfo[0]
      if (userInfo) {
          // parent.fetchUserIcons("userInfo")  
        parent.$store.dispatch('fetchUserIcons', userInfo)
        
        user.credit = userInfo.get("credit")
        user.bio = userInfo.get("bio")
        user.loading = false

        let twitterHandle = userInfo.get("twitterHandle") // Check if twitterHandle is a URL or not
        if (twitterHandle.includes("twitter.com")) {
          user.twitterHandle = twitterHandle
        } else{
          user.twitterHandle = "https://twitter.com/"+userInfo.get("twitterHandle")
        }

        console.log(userInfo);
      } else{
        user.loading = false
        parent.errorMessage = "This account doesn’t exist"
        console.log("This account doesn’t exist");
      }
      

    },

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
    let parent = this
    parent.$store.state.list = []
    console.log("parent.$store.state.list: ", parent.emptyArr());
    parent.user.username = parent.$route.params.user
    parent.queryUser()
    // Get all user iconsOrder
    // parent.fetchUserIcons()
    // parent.$store.dispatch('fetchUserIcons', {userInfo: "userInfo"})

    this.fetchAppCategories()

  },

  computed:{
    ...mapGetters(['getUser', 'getUserIcons', 'notApproved', 'approvedIcons', 'getAppCategories']),

    // userIcons(){
    //   return this.$store.getters.notApproved
    // }

    userIcons(){
      let parent = this

      if (parent.getUserIcons.length == 0) {
        parent.errorMessage = "No icons to show"
      }

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
    width: 80%;
    max-width: 480px;
    padding-top: 80px;
    padding-bottom: 20px;
    text-align: left;
  }

  @media(max-width:544px) {
    .profile-page-head-wrapper{
      grid-template-columns: auto;
      padding-top: 30px;
    }

  }
  
  .profile-page-img-wrapper{
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
  }

  .profile-img{
    width: 100%;
    height: auto;
    max-width: 60px;
  }
  
  .profile-descrption-box{
    min-height: calc(27px + 13px);
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
    display: flex;
    grid-template-columns: auto auto;
    width: fit-content;
    height: fit-content;
    min-height: 36px;
    gap: 35px;
    margin: auto auto auto 0;
  }
  
  .profile-name-social .loading-placeholder {
    height: 70%
  }

  .profile-descrption-box .loading-placeholder {
    height: 70%
  }

  .loading-placeholder{
    margin: auto;
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 100px;
    min-height: 20px;
    border-radius: 2px;
    background: rgb(90 90 90);
    overflow: hidden;
  }

  .loading-placeholder::after{
    height: 100%;
    width: 50%;
    content: " ";
    position: absolute;
    animation: placeholder 1.5s ease-out infinite;
    background: linear-gradient( 90deg , rgb(90 90 90 / 0%) 0%, rgb(109 109 109) 50%, rgb(90 90 90 / 0%) 100%);
  }

  @keyframes placeholder {
    0% {
      left: -25%;
    }
    50% {
      left: 75%;
    }
    100% {
      opacity: 0;
      /* left: -25%; */
    }
  }

</style>