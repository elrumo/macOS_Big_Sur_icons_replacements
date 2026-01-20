<template>
  <div
    id="header"
    :class="{
      'scrolled-shadow': distanceFromTop && scrolled,
      'scrolled-header': scrolled,
      'nav-header': true,
      'bg-white dark:bg-gray-900': true
    }"
  >
    <OptionsMenu :optionsList="optionsList" />
    <Dialog />
    <SubmissionDialog ref="submissionDialogRef" />
    <LoginDialog ref="loginDialogRef" />
    <AccountDialog v-if="accountDialog" ref="accountDialogRef" />

    <div class="header-wrapper">
      <div class="header-logo-name">
        <router-link to="/">
          <h3 class="text-lg font-semibold m-0 text-left">
            macOSicons
          </h3>
        </router-link>

        <p class="header-item text-sm text-gray-600 dark:text-gray-400">
          By
          <a
            href="https://eliasruiz.com/"
            rel="noopener"
            target="_blank"
            class="underline"
          >
            Elias
          </a>
        </p>
      </div>

      <!-- Mobile -->
      <div class="desktop-hidden">
        <div class="burger-btn" @click="toggleOverlay">
          <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
        </div>

        <!-- Mobile Menu Slideover -->
        <USlideover v-model:open="isMobileMenu" side="right">
          <template #header>
            <h3 class="text-lg font-semibold">Menu</h3>
          </template>

          <div class="p-4 space-y-4">
            <!-- Account Profile -->
            <div v-if="getUser.isAuth" class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <img
                class="w-10 h-10 rounded-full cursor-pointer"
                :src="getProfilePic"
                alt=""
                @click="showProfilePopover"
              >
              <span class="font-medium">{{ getUser.userData?.username }}</span>
            </div>

            <!-- Back to all icons -->
            <div v-if="$route.name != 'Home'">
              <router-link to="/" @click="isMobileMenu = false">
                <UButton variant="ghost" block>Back to all Icons</UButton>
              </router-link>
            </div>

            <!-- Forum -->
            <a
              href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions"
              rel="noopener"
              target="_blank"
            >
              <UButton variant="ghost" block>Forum</UButton>
            </a>

            <!-- Resources -->
            <div class="flex items-center gap-2">
              <UBadge color="blue" size="xs" />
              <router-link to="/resources" @click="isMobileMenu = false">
                <UButton variant="ghost">Resources</UButton>
              </router-link>
            </div>

            <UDivider />

            <!-- Donate -->
            <a
              rel="noopener"
              target="_blank"
              href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
              @click="logDonation('header')"
            >
              <UButton color="primary" block>Donate</UButton>
            </a>

            <!-- Submit icons -->
            <div v-if="getUser.isAuth">
              <UButton variant="soft" block @click="openSubmissionDialog">Submit</UButton>
            </div>

            <!-- Social Links -->
            <div class="flex items-center justify-center gap-6 pt-4">
              <a href="https://twitter.com/elrumo" target="_blank" rel="noopener" class="text-xl">
                𝕏
              </a>
              <a href="https://discord.gg/f4mTRyyTkT" target="_blank" rel="noopener">
                <img :src="icons.discord" class="w-5 h-5" alt="Discord Logo">
              </a>
              <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" rel="noopener">
                <img :src="icons.github" class="w-5 h-5" alt="GitHub Logo">
              </a>
            </div>
          </div>
        </USlideover>
      </div>

      <!-- Desktop -->
      <div class="mobile-hidden">
        <div class="header-grid-btns">
          <!-- Social Links -->
          <div class="header-icon-wrapper flex items-center gap-4">
            <a href="https://twitter.com/elrumo" class="x-logo" target="_blank" rel="noopener">
              𝕏
            </a>
            <a href="https://www.threads.com/@elrumo" target="_blank" rel="noopener">
              <img style="height: 17px;" :src="icons.threads" class="header-item header-icon icon-light" alt="Threads Logo">
            </a>
            <a href="https://discord.gg/f4mTRyyTkT" target="_blank" rel="noopener">
              <img style="height: 17px;" :src="icons.discord" class="header-item header-icon" alt="Discord Logo">
            </a>
            <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" rel="noopener">
              <img :src="icons.github" class="header-item header-icon" alt="GitHub Logo">
            </a>
          </div>

          <!-- Back to all icons -->
          <div class="opacity-70" v-if="$route.name != 'Home'">
            <router-link to="/">
              <UButton variant="ghost">All Icons</UButton>
            </router-link>
          </div>

          <!-- API -->
          <div class="flex items-center gap-1">
            <UBadge color="blue" size="xs" />
            <a href="https://docs.macosicons.com/api-management" target="_blank">
              <UButton variant="ghost">API</UButton>
            </a>
          </div>

          <!-- Forum -->
          <div>
            <a
              href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/discussions"
              rel="noopener"
              target="_blank"
            >
              <UButton variant="ghost">Forum</UButton>
            </a>
          </div>

          <!-- Resources -->
          <div>
            <router-link to="/resources">
              <UButton variant="ghost">Free Resources</UButton>
            </router-link>
          </div>

          <!-- Account Profile -->
          <div v-if="getUser.isAuth" class="flex items-center gap-2">
            <UButton variant="ghost" @click="openSubmissionDialog">Submit</UButton>

            <UDropdownMenu :items="profileMenuItems">
              <img
                id="profilePicNav-desktop"
                class="w-8 h-8 rounded-full cursor-pointer"
                :src="getProfilePic"
                alt=""
              >
            </UDropdownMenu>
          </div>

          <!-- Submit icons (not logged in) -->
          <div v-if="!getUser.isAuth" class="pl-2">
            <UButton color="primary" @click="openLoginDialog">Submit icons</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Parse from 'parse';

import Dialog from './Dialog.vue'
import SubmissionDialog from './SubmissionDialog.vue'
import LoginDialog from './LoginDialog.vue'
import AccountDialog from './AccountDialog.vue'
import OptionsMenu from './OptionsMenu.vue'

import discord from "../assets/icons/Discord.svg"
import github from "../assets/icons/github.svg"
import threads from "../assets/icons/threads.svg"
import profilePicDefault from "../assets/Resources/accounts/profilePic.png"
import Settings from "../assets/icons/Settings.svg"
import User from "../assets/icons/User.svg"
import LogOut from "../assets/icons/LogOut.svg"

const props = defineProps({
  submitIconDialog: String,
  distanceFromTop: Boolean
})

const store = useStore()
const router = useRouter()

const darkMode = ref(false)
const isMobileMenu = ref(false)
const scrolled = ref(false)
const accountDialog = ref(true)
const loginDialog = ref(false)
const currentUser = ref(Parse.User.current())

const submissionDialogRef = ref(null)
const loginDialogRef = ref(null)
const accountDialogRef = ref(null)

const icons = {
  discord,
  github,
  threads,
  profilePic: profilePicDefault
}

// Computed
const getUser = computed(() => store.getters.getUser)

const getProfilePic = computed(() => {
  try {
    if (Parse.User.current()) {
      const photo = Parse.User.current().get("profilePhoto")
      return photo ? photo.url() : icons.profilePic
    }
  } catch (error) {
    return icons.profilePic
  }
  return icons.profilePic
})

const profileMenuItems = computed(() => [
  [{
    label: 'Account Settings',
    icon: 'i-heroicons-cog-6-tooth',
    onSelect: () => openAccountDialog()
  },
  {
    label: 'Profile',
    icon: 'i-heroicons-user',
    onSelect: () => goToProfile()
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: () => logOut()
  }]
])

const optionsList = computed(() => [
  {
    name: "Account Settings",
    img: Settings,
    onClick: {
      method: openAccountDialog,
      data: "accountDialog"
    }
  },
  {
    name: "Profile",
    img: User,
    onClick: {
      method: goToProfile,
      data: "/u/"
    }
  },
  {
    name: "Logout",
    img: LogOut,
    onClick: {
      method: logOut
    }
  }
])

// Methods
function showEl(payload) {
  store.dispatch('showEl', payload)
}

function logOut() {
  store.dispatch('logOut')
}

function changePath(path) {
  store.dispatch('changePath', path)
}

function handleParseError(error) {
  store.dispatch('handleParseError', error)
}

function openAccountDialog() {
  if (accountDialogRef.value) {
    accountDialogRef.value.open()
  }
}

function openLoginDialog() {
  if (loginDialogRef.value) {
    loginDialogRef.value.open()
  }
}

function openSubmissionDialog() {
  isMobileMenu.value = false
  if (submissionDialogRef.value) {
    submissionDialogRef.value.open()
  }
}

function goToProfile() {
  if (getUser.value.isAuth) {
    router.push('/u/' + getUser.value.userData.username)
  }
}

function showProfilePopover() {
  // Profile popover handled by dropdown menu on desktop
}

function toggleOverlay() {
  isMobileMenu.value = !isMobileMenu.value
}

function logDonation(location) {
  window.plausible?.("logDonation", { props: { location } })
}

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function toggleDarkMode() {
  const body = document.getElementById("body")
  const isDarkModeOn = darkMode.value

  if (!isDarkModeOn) {
    body?.classList.remove('coral--light')
    body?.classList.add('coral--dark')
    darkMode.value = true
  } else {
    body?.classList.remove('coral--dark')
    body?.classList.add('coral--light')
    darkMode.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Sets light/dark mode based on browser
  const useDark = window.matchMedia('(prefers-color-scheme: dark)')
  if (useDark.matches) {
    toggleDarkMode()
  }
  useDark.addListener(() => toggleDarkMode())
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-logo-name {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.header-grid-btns {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon-wrapper {
  display: flex;
  align-items: center;
}

.header-icon {
  height: 18px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.header-icon:hover {
  opacity: 1;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 0;
  transition: box-shadow 0.2s, background-color 0.2s;
}

.scrolled-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.burger-btn {
  cursor: pointer;
  padding: 0.5rem;
}

.x-logo {
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .mobile-hidden {
    display: none;
  }
}

@media (min-width: 769px) {
  .desktop-hidden {
    display: none;
  }
}
</style>
