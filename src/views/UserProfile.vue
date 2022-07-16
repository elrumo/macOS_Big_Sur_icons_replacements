<template>
  <div>
    
    <!-- <StickyBanner/> -->

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
            <!-- <div class="profile-name-wrapper"> -->
              <h3 class="coral-Heading--L m-0">
                {{ getUserInfo.nameToShow }}
              </h3>
              <!-- <h4 class="coral-Heading--S m-0">
                {{ getUserInfo.username }}
              </h4> -->
            <!-- </div> -->
            
            <div class="profile-socials-wrapper">
              <a
                v-if="getUserInfo.twitterHandle"
                target="_blank"
                :href="getUserInfo.twitterHandle"
                class="margin-auto relative height-24px"
              >
                <coral-icon
                  size="M"
                  :icon="iconBrew('twitter24', true)"
                  alt="Twitter Logo"
                  title="Twitter">
                </coral-icon>
              </a>

              <div 
                target="_blank" 
                @click="copyUserUrl" 
                class="margin-auto relative pointer height-24px"
              >
                <coral-icon
                  size="M"
                  :icon="iconBrew('share24')"
                  alt="Twitter Logo"
                  title="Twitter">
                </coral-icon>
                <!-- <IconUI class="absolute-center-vertical" width="18px" :img="resources.share" alt="Twitter Logo"/> -->
              </div>
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
          <div v-if="loading.user" class="loading-placeholder m-b-8"></div>
          <div v-if="loading.user" class="loading-placeholder m-b-8"></div>

           <h4 class="coral-Heading--S m-0 opacity-70">
            {{ getUserInfo.username }}
          </h4>

          <p v-if="getUserInfo.bio" class="coral-Body--L m-b-4">
            {{ getUserInfo.bio }}
          </p>

          <a v-if="getUserInfo.credit" target="_blank" :href="getUserInfo.credit" class="margin-auto relative">
            <!-- <p class="coral-Body--XS"> -->
              <IconUI class="absolute-center-vertical" width="14px" :img="resources.link" alt="Credit link"/>
              <span>
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
      
      <UserIconGrid
        v-if="userIcons.length != 0"
        :userIcons="userIcons"
      />
      
      <div
        class="icon-list-area loading p-t-48 p-b-40"
        v-else
      >
        <UserIconCardLoading
          v-for="num in placeholderCount"
          :key="num+Math.floor(Math.random() * 10000000 + 1)"
        />

      </div>

      <button
        is="coral-button"
        v-if="userIcons.length < iconsCount && userIcons.length > 1 && isLoading"
        class="m-b-24"
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

import Parse from 'parse/dist/parse.min.js';
import { mapGetters, mapActions } from 'vuex'

import twitterIcon from "../assets/icons/twitter.svg"
import shareIcon from "../assets/icons/share.svg"
import LinkIcon from "../assets/icons/Link.svg"
import profilePicIcon from "../assets/Resources/accounts/profilePic.png"

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import deleteIcon from "../assets/icons/delete.svg"

import iconBrew from '../api/iconBrew.js'

export default {
  name: 'UserProfile',
  
  components: {
      IconUI,
      UserIconGrid,
      UserIconCardLoading,
      EditIconDialog,
      deleteDialog,
      StickyBanner,
  },

  data(){
    return {
      resources:{
        twitter: twitterIcon,
        share: shareIcon,
        link: LinkIcon,
        profilePic: profilePicIcon,
      },

      iconsToShow: "approved",

      errorMessage: "",
      
      loading: {
       user: true,
       icons: true 
      },

      user:{
        isOwner: false,
        isBanned: false,
      },
      
      totalIconsApproved: 0,
      userInfo: {},
      scrolledToBottom: true,

      coralIcons:{
        delete: deleteIcon,
        addIcon: addCoralIcon,
        newItem: newItemCoralIcon,
        edit: editCoralIcon,
        loading: placeholderCoralIcon,
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
      'adClick',
      'handleParseError'
    ]),

    iconBrew(iconName, filled){
      return iconBrew(iconName, filled)
    },

    async copyUserUrl(){
      let parent = this;
      let toCopy = "https://macosicons.com/#/u/" + parent.$route.params.user
      
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
      let user = this.user;
      let isBanned

      const queryUser = new Parse.Query(Parse.User);
      user.username = user.username.toLowerCase()
      user.username = user.username.replaceAll(' ', '_')

      try {
        queryUser.equalTo("username", user.username);
      } catch (error) {
        this.handleParseError(error)
      }
      let userInfo = await queryUser.find();

      userInfo = userInfo[0];
      this.userInfo = userInfo;

      try {
        isBanned = userInfo.attributes.isBanned;
      } catch (error) {
      }
      
      user.isBanned = isBanned;
      
      if (userInfo && !isBanned){

        // Fetch user icons
        this.fetchUserIcons(userInfo).then(()=>{
          // Wait to fetch icons then set "selectedIcon" to the first icon fetched back
          this.setDataToArr({
            arr: "selectedIcon",
            data: this.userIcons[0],
          })
        })

        let twitterHandle = userInfo.get("twitterHandle") // Check if twitterHandle is a URL or not
        if (twitterHandle) {
          user.twitterHandle = twitterHandle
          if (!twitterHandle.includes("twitter.com")) user.twitterHandle = "https://twitter.com/"+twitterHandle
        }
        
        user.credit = userInfo.get("credit")
        user.username = userInfo.get("username")
        user.bio = userInfo.get("bio")
        user.nameToShow = userInfo.get("nameToShow")
        user.id = userInfo.id

        this.setData({state: 'user', data: user})

        if (Parse.User.current() && user.username == Parse.User.current().getUsername()) {
          user.isOwner = true
        }
        
        this.loading.user = false
      } else{
        
        let isLoading = {
          arr: "loading",
          data: false
        }
        this.setDataToArr(isLoading)
        this.loading.user = false
        
        if (isBanned) {
          this.errorMessage =  this.user.username + " has been banned until further notice."
        } else{
          this.errorMessage = "This account doesn't exist"
        }
      }

    },

    showDialog(dialog) {
      let dialogEl = document.getElementById(dialog);
      dialogEl.show();
    },

    changeIconStatus(status) {
      this.iconsToShow = status
    },

    userData(){
      console.log("parent.user: ", this.$store.state.user);
      return this.$store.state.user
    },
    
    scrolled() {

      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000
        
        if(this.user.isBanned) return

        if (bottomOfWindow && this.scrolledToBottom && this.userInfo.id) {
          this.scrolledToBottom = true
          this.fetchUserIcons(this.userInfo)
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
      if (this.iconsCount > 25) {
        return 5
      } else{
        return this.iconsCount
      }
    },

    userIcons(){
      let parent = this
      
      if (!parent.userInfo) {
        return 0
      } else{
        if (parent.allIcons.length == 0) {
          parent.errorMessage = "No icons to show"
        }

        if (parent.user.isBanned) {
            parent.errorMessage = parent.user.username + " has been banned until further notice."
            return parent.notApproved
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


<style lang="scss">
  
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

    .profile-name-wrapper{
      display: flex;
      gap: 2px;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    & > div{
      display: flex;
      gap: 8px;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .loading-placeholder {
        height: 70%
    }
  }


  .profile-descrption-box .loading-placeholder {
    /* height: 70% */
  }

</style>