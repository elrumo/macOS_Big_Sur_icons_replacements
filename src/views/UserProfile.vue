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
                  :icon="iconBrewMethod('twitter24', true)"
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
                  :icon="iconBrewMethod('share24')"
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Parse from 'parse/dist/parse.min.js';

import IconUI from '@/components/IconUI.vue'
import UserIconGrid from '@/components/UserIconGrid.vue'
import UserIconCardLoading from '@/components/UserIconCardLoading.vue'
import EditIconDialog from "@/components/EditIconDialog.vue"
import deleteDialog from "@/components/deleteDialog.vue"
import IconDetailsModal from "@/components/IconDetailsModal.vue"

import twitterIcon from "../assets/icons/twitter.svg"
import shareIcon from "../assets/icons/share.svg"
import LinkIcon from "../assets/icons/Link.svg"
import profilePicIcon from "../assets/Resources/accounts/profilePic.png"

import iconBrew from '../api/iconBrew.js'

const store = useStore()
const route = useRoute()

// Reactive data
const resources = {
  twitter: twitterIcon,
  share: shareIcon,
  link: LinkIcon,
  profilePic: profilePicIcon,
}

const iconsToShow = ref("approved")
const errorMessage = ref("")

const loading = reactive({
  user: true,
  icons: true
})

const user = reactive({
  isOwner: false,
  isBanned: false,
})

const userInfo = ref({})
const scrolledToBottom = ref(true)

// Store getters
const allIcons = computed(() => store.getters.allIcons)
const notApproved = computed(() => store.getters.notApproved)
const approvedIcons = computed(() => store.getters.approvedIcons)
const approvedIconsCount = computed(() => store.getters.approvedIconsCount)
const isLoading = computed(() => store.getters.isLoading)
const getSelectedIcon = computed(() => store.getters.getSelectedIcon)

// Store actions
const fetchUserIcons = (userInfo) => store.dispatch('fetchUserIcons', userInfo)
const showToast = (payload) => store.dispatch('showToast', payload)
const emptyArr = () => store.dispatch('emptyArr')
const setDataToArr = (payload) => store.dispatch('setDataToArr', payload)
const setData = (payload) => store.dispatch('setData', payload)

// Methods - expose iconBrew to template
const iconBrewMethod = iconBrew

const copyUserUrl = async () => {
  const toCopy = "https://macosicons.com/#/u/" + route.params.user

  await navigator.clipboard.writeText(toCopy)

  showToast({
    id: "toastMessage",
    message: "User profile URL copied to your clipboard",
    variant: "success"
  })
}

const objectLenght = (object) => {
  if (object) {
    return Object.keys(object).length != 0
  } else {
    return false
  }
}

const queryUser = async () => {
  try {
    user.username = user.username.toLowerCase()

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}v1/users/getPublicUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username
      })
    })

    const result = await response.json()
    console.log("result: ", result)

    if (!result.success) {
      loading.user = false

      if (result.isBanned) {
        errorMessage.value = user.username + " has been banned until further notice."
      } else if (result.error === 'User not found') {
        errorMessage.value = "This account doesn't exist"
      } else {
        errorMessage.value = result.error || "An error occurred"
      }

      setDataToArr({
        arr: "loading",
        data: false
      })
      return
    }

    const userInfoData = result.user
    userInfo.value = userInfoData
    user.isBanned = false

    await fetchUserIcons(userInfoData).then(() => {
      setDataToArr({
        arr: "selectedIcon",
        data: userIcons.value[0],
      })
    })

    user.isOwner = Parse.User.current() && userInfoData.id == Parse.User.current().id

    Object.keys(userInfoData).forEach(key => {
      user[key] = userInfoData[key]
    })

    setData({ state: 'user', data: user })
    loading.user = false

  } catch (error) {
    console.log("error in queryUser: ", error)
    loading.user = false
    errorMessage.value = "An error occurred while fetching user information"
  }
}

const showDialog = (dialog) => {
  const dialogEl = document.getElementById(dialog)
  dialogEl.show()
}

const changeIconStatus = (status) => {
  iconsToShow.value = status
}

const userData = () => {
  console.log("parent.user: ", store.state.user)
  return store.state.user
}

const getUserProfilePic = () => {
  try {
    return user.profilePhoto ? user.profilePhoto.url() : resources.profilePic
  } catch (error) {
    return user.profilePhoto.url
  }
}

const scrolled = () => {
  window.onscroll = () => {
    const bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

    if (user.isBanned) return

    if (bottomOfWindow && scrolledToBottom.value && userInfo.value.id) {
      scrolledToBottom.value = true
      fetchUserIcons(userInfo.value)
    }
  }
}

// Computed properties
const iconsCount = computed(() => {
  const iconsCountData = approvedIconsCount.value
  const isLoadingData = isLoading.value
  const allIconsCount = iconsCountData.approved + iconsCountData.hacked + iconsCountData.notApproved

  if (allIconsCount == 0 && isLoadingData) return 15

  switch (iconsToShow.value) {
    case "all":
      return allIconsCount

    case "approved":
      return iconsCountData.approved

    case "notApproved":
      return iconsCountData.notApproved

    default:
      break
  }
})

const placeholderCount = computed(() => {
  if (iconsCount.value > 25) {
    return 5
  } else {
    return iconsCount.value
  }
})

const userIcons = computed(() => {
  if (!userInfo.value) {
    return 0
  } else {
    if (allIcons.value.length == 0) {
      errorMessage.value = "No icons to show"
    }

    if (user.isBanned) {
      errorMessage.value = user.username + " has been banned until further notice."
      return notApproved.value
    }

    switch (iconsToShow.value) {
      case "all":
        errorMessage.value = user.username + " hasn't submitted any icons yet."
        console.log("parent.allIcons: ", allIcons.value)
        return allIcons.value

      case "approved":
        errorMessage.value = user.username + " doesn't have any approved icons yet."
        return approvedIcons.value

      case "notApproved":
        errorMessage.value = user.username + " doesn't have any icons awaiting approval."
        return notApproved.value

      default:
        break
    }
  }
})

// Lifecycle hook
onMounted(() => {
  user.username = route.params.user

  setDataToArr({
    arr: "loading",
    data: true
  })

  emptyArr()
  queryUser()
  scrolled()
})
</script>


<style lang="scss">
</style>