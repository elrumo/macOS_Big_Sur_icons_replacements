<template>
  <div>
    
    <StickyBanner/>

    <!-- Intro section -->
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
              {{ getUserInfo.username }}
            </h3>
            
            <a v-if="getUserInfo.twitterHandle" target="_blank" :href="getUserInfo.twitterHandle" class="margin-auto relative">
              <IconUI class="absolute-center-vertical" width="18px" :img="resources.twitter" alt="Twitter Logo"/>
            </a>
            <div target="_blank" @click="copyUserUrl" class="margin-auto relative pointer">
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
          <div v-if="loading.user" class="loading-placeholder m-b-10"></div>
          <div v-if="loading.user" class="loading-placeholder m-b-10"></div>
          <p v-if="getUserInfo.bio" class="coral-Body--L m-b-5">
            {{ getUserInfo.bio }}
          </p>

          <a v-if="getUserInfo.credit" target="_blank" :href="getUserInfo.credit" class="margin-auto relative">
            <!-- <p class="coral-Body--XS"> -->
              <IconUI class="absolute-center-vertical" width="14px" :img="resources.link" alt="Credit link"/>
              <span class="p-l-20">
                {{ getUserInfo.credit.replace("https://", "") }}
              </span>
            <!-- </p> -->
          </a>

        </div>

      </div>
    </section>

    <!-- Icons section -->
    <section class="m-auto user-profile-icons">
      
      <!-- Tabs -->
      <coral-tablist>
        <coral-tab aria-label="All Icons" @click="changeIconStatus('all')">
          All
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ({{approvedIconsCount.approved + approvedIconsCount.notApproved}})
          </span>
        </coral-tab>
        
        <coral-tab aria-label="Approved Icons" selected="" @click="changeIconStatus('approved')">
          Approved
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ({{approvedIconsCount.approved}})
          </span>
        </coral-tab>
        
        <coral-tab aria-label="Waiting Icons" @click="changeIconStatus('notApproved')">
          Waiting
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ({{approvedIconsCount.notApproved}})
          </span>
        </coral-tab>
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

      <EditIconDialog
        v-if="objectLenght(getSelectedIcon)"
        :icon="getSelectedIcon"
      />
      
      <deleteDialog
        v-if="objectLenght(getSelectedIcon)"
        :icon="getSelectedIcon"
      />

      <div v-if="!loading.user && iconsCount == 0" class="waiting-wrapper">
        <p class="coral-Body--M">
          {{ errorMessage }}
        </p>
      </div>

      <UserIconGrid v-if="userIcons.length != 0" :userIcons="userIcons"/>
      
      <div
        class="icon-list-area p-t-40 p-b-50"
        v-else
      >
        <div style="z-index: 2; height: 100%; min-height: 210px" class="card-wrapper card-hover coral-card">
          <script
            @click="adClick({position: 'Icon Grid Top', type: 'Native'})"
            type="application/javascript"
            src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom"
            id="_carbonads_js2">
          </script>
        </div>
        <UserIconCardLoading v-for="num in placeholderCount" :key="num+Math.floor(Math.random() * 10000000 + 1)" :icon="iconsCount"/>
      </div>

      <button
        is="coral-button"
        v-if="userIcons.length < iconsCount && userIcons.length > 1 && isLoading"
        class="m-b-20"
        @click="fetchUserIcons(userInfo)"
      >
        Load more
      </button> 

    </section>

  </div>
</template>

<script>
// @ is an alias to /src
import IconUI from '@/components/IconUI.vue';
import UserIconGrid from '@/components/UserIconGrid.vue';
import UserIconCardLoading from '@/components/UserIconCardLoading.vue';
import EditIconDialog from "@/components/EditIconDialog.vue"
import deleteDialog from "@/components/deleteDialog.vue"
import StickyBanner from "@/components/StickyBanner.vue"

import Parse from 'parse'
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'UserProfile',
  
  components: {
      IconUI,
      UserIconGrid,
      UserIconCardLoading,
      EditIconDialog,
      deleteDialog,
      StickyBanner
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
      
      loading: {
       user: true,
       icons: true 
      },

      user:{
        isOwner: false,
      },
      
      totalIconsApproved: 0,
      userInfo: {},
      scrolledToBottom: true,

      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/placeholder-icon.png"),
      }
    }
  },

  methods: {
    ...mapActions([
      'fetchUserIcons',
      'fetchAppCategories',
      'emptyArr', 
      'showToast',
      'setDataToArr',
      'setData',
      'pushDataToArr',
      'adClick'
    ]),

    async copyUserUrl(){
      let parent = this;
      let toCopy = "https://macosicons.com/u/" + parent.$route.params.user
      
      await navigator.clipboard.writeText(toCopy);
      
      parent.showToast({
        id: "toastMessage",
        message: "User profile URL copied to your clipboard",
        variant: "success"
      })
    },

    objectLenght(object){
      if (object) {
        return Object.keys(object).length != 0
      } else{
        return false
      }
    },

    async queryUser(){
      let parent = this;
      let user = parent.user;
      var loading = parent.loading.user;
      
      const queryUser = new Parse.Query(Parse.User);
      let regular = new RegExp("\\b" + user.username + "\\b")
      queryUser.matches("username", regular, "i")
      let userInfo = await queryUser.find()

      userInfo = userInfo[0];
      parent.userInfo = userInfo;

      if (userInfo) {
        
        // Fetch user icons
        parent.fetchUserIcons(userInfo).then(()=>{
          // Wait to fetch icons then set "selectedIcon" to the first icon fetched back
          parent.setDataToArr({
            arr: "selectedIcon",
            data: parent.userIcons[0],
          })
        })

        let twitterHandle = userInfo.get("twitterHandle") // Check if twitterHandle is a URL or not
        if (twitterHandle) user.twitterHandle = twitterHandle 
        user.credit = userInfo.get("credit")
        user.username = userInfo.get("username")
        user.bio = userInfo.get("bio")
        user.id = userInfo.id

        parent.setData({state: 'user', data: user})
      

        if (Parse.User.current() && user.username == Parse.User.current().getUsername()) {
          user.isOwner = true
        }
        
        parent.loading.user = false
      } else{
        let isLoading = {
          arr: "loading",
          data: false
        }
        parent.setDataToArr(isLoading)
        parent.loading.user = false
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

    userData(){
      let parent = this
      console.log("parent.user: ", parent.$store.state.user);
      return parent.$store.state.user
    },
    
    scrolled() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

        if (bottomOfWindow && parent.scrolledToBottom && parent.userInfo.id) {
          // parent.scrolledToBottom = false
          // setTimeout(() => {
              parent.scrolledToBottom = true
          // }, 0);
          parent.fetchUserIcons(parent.userInfo)
        }
      }
    },

  },

  mounted: function(){
    let parent = this
    parent.user.username = parent.$route.params.user

    let isLoading = {
      arr: "loading",
      data: true
    }
    parent.setDataToArr(isLoading)

    parent.emptyArr();
    parent.queryUser();
    parent.scrolled();
  },

  computed:{
    ...mapGetters([
      'getUser',
      'allIcons',
      'notApproved',
      'approvedIcons',
      'getAppCategories',
      'approvedIconsCount',
      'isLoading',
      'getSelectedIcon',
      'getUserInfo'
    ]),

    iconsCount(){
      let parent = this;
      let iconsCount = parent.approvedIconsCount;
      let isLoading = parent.isLoading;
      let allIcons = iconsCount.approved + iconsCount.hacked + iconsCount.notApproved
      
      if (allIcons == 0 && isLoading) return 15

      switch (parent.iconsToShow) {
        case "all":
          return allIcons

        case "approved":
          return iconsCount.approved

        case "notApproved":
          return iconsCount.notApproved
    
        default:
          break;
      }
    },

    placeholderCount(){
      let parent = this
      if (parent.iconsCount > 15) {
        return 15
      } else{
        return parent.iconsCount
      }
    },

    userIcons(){
      let parent = this
      
      if (!parent.userInfo) {
        console.log("parent.userInfo");
        return 0
      } else{
        if (parent.allIcons.length == 0) {
          parent.errorMessage = "No icons to show"
        }

        switch (parent.iconsToShow) {
          case "all":
            parent.errorMessage = parent.user.username + " hasn't submitted any icons yet."
            return parent.allIcons

          case "approved":
            parent.errorMessage = parent.user.username + " doesn't have any approved icons yet."
            return parent.approvedIcons

          case "notApproved":
            parent.errorMessage = parent.user.username + " doesn't have any icons awaiting approval."
            return parent.notApproved
      
          default:
            break;
        }
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
    padding-top: 50px;
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
    /* min-height: calc(27px + 13px); */
    /* min-height: 107px; */
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
    /* height: 70% */
  }

  .loading-placeholder{
    margin: auto;
    position: relative;
    height: auto;
    width: 100%;
    min-width: 100px;
    min-height: 20px;
    border-radius: 2px;
    background: rgb(90 90 90);
    overflow: hidden;
  }

  .loading-placeholder::after{
    transform: translateY(-50%);
    top: 50%;
    height: 100%;
    width: 50%;
    content: " ";
    position: absolute;
    animation: placeholder 2s ease-out infinite;
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