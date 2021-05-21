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
              <IconUI class="absolute-center-vertical" width="18px" :img="resources.twitter" alt="Twitter Logo"/>
            </a>
            <div v-if="user.twitterHandle" target="_blank" @click="copyUserUrl" class="margin-auto relative pointer">
              <IconUI class="absolute-center-vertical" width="18px" :img="resources.share" alt="Twitter Logo"/>
            </div>
          </div>

          <div v-if="user.isOwner" class="profile-edit-btn mobile-hidden opacity-80">
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
          <p v-if="user.bio" class="coral-Body--L m-b-5">
            {{ user.bio }}
          </p>

          <a v-if="user.credit" target="_blank" :href="user.credit" class="margin-auto relative">
            <!-- <p class="coral-Body--XS"> -->
              <IconUI class="absolute-center-vertical" width="14px" :img="resources.link" alt="Twitter Logo"/>
              <span class="p-l-20">
                {{ user.credit.replace("https://", "") }}
              </span>
            <!-- </p> -->
          </a>

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
      <div v-if="!user.loading && userIcons.length == 0" class="waiting-wrapper">
        <p class="coral-Body--M">
          {{ errorMessage }}
          <!-- {{ user.username }} hasn't submitted any icons yet. -->
        </p>
      </div>

      <!-- Loading spinning circle -->
      <div v-if="user.loading" class="waiting-wrapper">
        <coral-wait size="L" indeterminate=""></coral-wait>
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
        link: require("../assets/icons/Link.svg"),
        profilePic: require("../assets/Resources/accounts/profilePic.png"),
      },

      iconsToShow: "approved",

      errorMessage: "",

      user:{
        loading: true,
        isOwner: false,
      },
      
      userInfo: {},
      scrolledToBottom: true,

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
    ...mapActions(["fetchUserIcons", "fetchAppCategories", "emptyArr", "showToast"]),

    async copyUserUrl(){
      let parent = this;
      let toCopy = "https://macosicons.com/user/" + parent.$route.params.user
      
      await navigator.clipboard.writeText(toCopy);
      
      parent.showToast({
        id: "toastMessage",
        message: "✅ User profile URL copied to your clipboard",
        variant: "success"
      })
    },

    async queryUser(){
      let parent = this
      let user = parent.user
      // user.username = this.$route.params.user // Set username same as the url user
      
      const queryUser = new Parse.Query(Parse.User);
      let regular = new RegExp("\\b" + user.username + "\\b")
      queryUser.matches("username", regular, "i")
      let userInfo = await queryUser.find()

      userInfo = userInfo[0];
      parent.userInfo = userInfo;
      if (userInfo) {
        
        parent.$store.dispatch('fetchUserIcons', userInfo)
        user.credit = userInfo.get("credit")
        user.username = userInfo.get("username")
        user.bio = userInfo.get("bio")
        user.loading = false
        
        if (Parse.User.current() && user.username == Parse.User.current().getUsername()) {
          user.isOwner = true
        }

        let twitterHandle = userInfo.get("twitterHandle") // Check if twitterHandle is a URL or not
        if (twitterHandle.includes("twitter.com")) {
          user.twitterHandle = twitterHandle
        } else{
          user.twitterHandle = "https://twitter.com/"+userInfo.get("twitterHandle")
        }

      } else{
        user.loading = false
        parent.errorMessage = "This account doesn’t exist"
      }
      

    },

    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    changeIconStatus(status) {
      let parent = this
      parent.iconsToShow = status
    },
    
    scrolled() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

        if (bottomOfWindow && parent.scrolledToBottom) {
          parent.scrolledToBottom = false
          setTimeout(() => {
              parent.scrolledToBottom = true
          }, 800);
          parent.$store.dispatch('fetchUserIcons', parent.userInfo)
        }
      }
    },

  },

  mounted: function(){
    let parent = this

    parent.user.username = parent.$route.params.user

    parent.emptyArr();
    parent.queryUser()

    parent.scrolled()
  },

  computed:{
    ...mapGetters(['getUser', 'allIcons', 'notApproved', 'approvedIcons', 'getAppCategories']),


    userIcons(){
      let parent = this
      
      if (parent.allIcons.length == 0) {
        parent.errorMessage = "No icons to show"
      }

      switch (parent.iconsToShow) {
        case "all":
          parent.errorMessage = parent.user.username + " hasn't submited any icons yet."
          return parent.allIcons

        case "approved":
          parent.errorMessage = parent.user.username + " doesn't have any approved icons yet."
          return parent.approvedIcons

        case "notApproved":
          parent.errorMessage = parent.user.username + " doesn't have any icons awaiting aproval."
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
    gap: 25px;
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