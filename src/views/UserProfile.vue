<template>
  <div>
    <IconDetailsModal 
      :icon="getSelectedIcon"
      @share="showToast({
        id: 'toastMessage',
        message: '✅ Link copied to clipboard',
        variant: 'success'
      })"
    /> 
     <!-- <StickyBanner/> -->

    <!-- Intro section -->
    <section class="profile-page-head-wrapper">
      <div class="profile-page-img-wrapper">
        <!-- {{ getUserProfilePic() }} -->
        <img class="profile-img" :src="getUserProfilePic()" alt="">
        <!-- <img class="profile-img" :src="user.profilePhoto ? user.profilePhoto.url() : resources.profilePic" alt=""> -->

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
                {{ user.nameToShow }}
              </h3>
              <!-- <h4 class="coral-Heading--S m-0">
                {{ getUserInfo.username }}
              </h4> -->
            <!-- </div> -->
            
            <div class="profile-socials-wrapper">
              <a
                v-if="user.twitterHandle"
                target="_blank"
                :href="user.twitterHandle"
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
            {{ user.username }}
          </h4>

          <p v-if="user.bio" class="coral-Body--L m-b-4">
            {{ user.bio }}
          </p>

          <a v-if="user.credit" target="_blank" :href="user.credit" class="margin-auto relative">
            <!-- <p class="coral-Body--XS"> -->
              <IconUI class="absolute-center-vertical" width="14px" :img="resources.link" alt="Credit link"/>
              <span>
                {{ user.credit.replace("https://", "") }}
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
import IconDetailsModal from "@/components/IconDetailsModal.vue"

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
      IconDetailsModal,
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
      'showToast',
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

    async queryUser() {
      try {
        let user = this.user;
        user.username = user.username.toLowerCase();

        // Call the new API endpoint instead of Parse query
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}v1/users/getPublicUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username
          })
        });

        const result = await response.json();
        console.log("result: ", result);
        if (!result.success) {
          // Handle errors
          this.loading.user = false;
          
          if (result.isBanned) {
            this.errorMessage = user.username + " has been banned until further notice.";
          } else if (result.error === 'User not found') {
            this.errorMessage = "This account doesn't exist";
          } else {
            this.errorMessage = result.error || "An error occurred";
          }
          
          let isLoading = {
            arr: "loading",
            data: false
          };
          this.setDataToArr(isLoading);
          return;
        }

        // Success - user found and not banned
        const userInfo = result.user;
        this.userInfo = userInfo;
        user.isBanned = false;

        // Fetch user icons
        this.fetchUserIcons(userInfo).then(() => {
          // Wait to fetch icons then set "selectedIcon" to the first icon fetched back
          this.setDataToArr({
            arr: "selectedIcon",
            data: this.userIcons[0],
          });
        });

        // Check if current user is the owner
        // Note: You'll need to adapt this based on how you handle authentication in your frontend
        // If you're still using Parse.User.current() for the current logged-in user, keep it
        // Otherwise, replace with your authentication method
        user.isOwner = Parse.User.current() && userInfo.id == Parse.User.current().id;

        // Copy all user attributes to the user object
        Object.keys(userInfo).forEach(key => {
          user[key] = userInfo[key];
        });

        this.setData({ state: 'user', data: user });
        this.loading.user = false;

      } catch (error) {
        console.log("error in queryUser: ", error);
        this.loading.user = false;
        this.errorMessage = "An error occurred while fetching user information";
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
    
    getUserProfilePic() {
      console.log("this.user: ", this.user);
      try {
        return this.user.profilePhoto ? this.user.profilePhoto.url() : this.resources.profilePic
      } catch (error) {
        return this.user.profilePhoto.url
      }
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
      'getUserInfo',
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
            console.log("parent.allIcons: ", parent.allIcons);
            return parent.allIcons

          case "approved":
            parent.errorMessage = parent.user.username + " doesn't have any approved icons yet."
            return parent.approvedIcons
            // return parent.approvedIcons

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
</style>