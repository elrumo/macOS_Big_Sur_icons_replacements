<template>
  <div
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <!-- v-if="selectedIcon.id" -->
    <!-- @download="addClickCount" -->
    <IconDetailsModal 
      :icon="selectedIcon"
      @share="showToast({
        id: 'toastMessage',
        message: '✅ Link copied to clipboard',
        variant: 'success'
      })"
    />
    
    <canvas
      v-if="getHomeDialog.showParticles"
      id="confetti-canvas"
      style="position: fixed; left: 0px; top: 0px; z-index: 9999; pointer-events: none;"
    >
    </canvas>
    
    <deleteDialog :icon="!activeIcon"/>

    <div v-if="overflow"> {{ toggleOverflow() }} </div>

    <!-- <StickyBanner/> -->
    <SaveIconsDialogue v-if="!isAuth"/>

    <!-- v-if="Object.keys(getHomeDialog).length != 0 && getHomeDialog.ShowDialog" -->
    <coral-dialog
      v-if="($cookies.get('updatesIsRead') == 'false'|| $cookies.get('updatesIsRead') == null ) && Object.keys(getHomeDialog).length != 0 && getHomeDialog.ShowDialog"
      open
      id="newDialog"
      style="text-align: left;"
    >
      <coral-dialog-header>
        {{getHomeDialog.header}}
      </coral-dialog-header>

      <coral-dialog-content style="max-width: 650px">
        <img style="max-width: 100%" v-if="getHomeDialog.image" :src="getHomeDialog.image">
        <vue-markdown
          :source="getHomeDialog.content"
          class="coral-Body--M text-center"
        />
      </coral-dialog-content>

      <coral-dialog-footer>
        <button
          is="coral-button"
          variant="quiet"
          coral-close=""
          tabindex="-1"
        >
          Remind me again later
        </button>

        <button
          @click="setCookie('updatesIsRead', 'true')"
          is="coral-button"
          variant="CTA"
          coral-close=""
        >
          Ok, don't remind me again
        </button>
      </coral-dialog-footer>
    </coral-dialog>

    <!-- <IconDialog :isMacOs="isMacOs"/> -->

    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submissionDialog'"
      :iconListLen="getIconListLen"
      :parseObj="getParseObj"
      :iconsEmpty="true"
      :getHomeDialog="getHomeDialog"
    />

    
    <section style="min-height: calc(100vh - 120px);" class="">
      
      <!-- Search bar -->
      <div
        @click="isSearch = true"
        id="searchBar"
        class="main-search-wrapper coral-bg p-b-16"
        :class="{'scrolled-shadow': !distanceFromTop}"
      >

        <!-- Search box-->
        <div>
          <!-- @click="scrollTo" -->
          <div class="content-wrapper-regular search">
            <div class="m-auto main-search" style="max-width:300px;">
              <div class="shadow main-border-radius">
                <input 
                  v-model="searchString"
                  :placeholder="'Search ' + getIconListLen + ' icons'" 
                  type="text"  
                  id="searchBarInput"
                  class="_coral-Search-input _coral-Textfield searchBar" 
                  name="name" 
                  aria-label="text input"
                >

                <!-- Search icon -->
                <svg class="icon searchBar-left" id="coral-css-icon-Magnifier" viewBox="0 0 16 16">
                  <path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path>
                </svg>
                
                <!-- Cross icon -->
                <!-- <transition name="fade">
                  <div v-if="!searchString" class="searchBar-right mobile-hidden">
                    <div class="search-by-algolia-wrapper">
                      <p class="coral-Body--XS">
                        Search powered by
                      </p>
                      <a href="https://www.algolia.com/" target="_blank">
                        <img class="algolia-logo" :src="alogliaLogo" alt="">
                      </a>
                    </div>
                  </div>
                </transition> -->

                <transition name="fade">
                  <div v-if="searchString" class="searchBar-right">
                    
                    <transition name="fade">
                      <div v-if="isLoading" class="rotating-search">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#464646" d="M8 1.33a6.67 6.67 0 1 0 6.67 6.67A6.68 6.68 0 0 0 8 1.33zm0 12A5.33 5.33 0 1 1 13.33 8 5.34 5.34 0 0 1 8 13.33z" opacity=".4"/>
                          <path fill="#464646" d="M8 0a8 8 0 0 1 8 8h-1.33a6.67 6.67 0 0 0-6.67-6.67V0z">
                            <animateTransform 
                              attributeName="transform"
                              type="rotate"
                              from="0 8 8"
                              to="360 8 8"
                              dur="1s"
                              repeatCount="indefinite"/>
                          </path>
                        </svg>
                      </div>
                    </transition>

                    <div class="searchBar-right-wrapper">
                      <svg @click="clearSearch" class="icon p-t-24 p-b-24 p-r-8 p-l-8" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
                        <title>CrossLarge</title>
                        <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
                      </svg>

                      <div class="mobile-hidden" style="top: -26px;">
                        <button @click="copySearch" variant="quiet" is="coral-button">
                          Share search
                        </button>
                      </div>
                    </div>
                  </div>
                </transition>
                
                <hr class="coral-Divider--s coral-Divider--vertical searchBar-divider m-0">

                <div class="dropdown-select-chevron">
                  <select
                  id="selectOS"
                  class="dropdown-select searchbar-select"
                  v-on:change="changeOS"
                  >
                    <option value="macOS" selected="">
                      macOS
                    </option>
                    <option value="iOS">
                      iOS
                    </option>
                  </select>
                </div>

              </div>
            </div>
          </div>
        </div>

         <div v-if="isMobile" class="desktop-hidden categories-container">
          <!-- <div class="search-by-algolia-container">
            <div class="search-by-algolia-wrapper">
              <p class="coral-Body--XS">
                Search powered by
              </p>
              <a href="https://www.algolia.com/" target="_blank">
                <img class="algolia-logo" :src="alogliaLogo" alt="">
              </a>
            </div>
          </div> -->
          <div id="categoriesWrapper-mobile" class="categories-wrapper">
            <coral-buttongroup selectionmode="single">
                <button
                  is="coral-button"
                  selected="true"
                  value="All"
                  title="all"
                  @click="setCategory({name: 'All'})"
                  aria-label="category.name  "
                >
                  All icons
                </button>
                <button
                  v-for="category in getAppCategories"
                  :key="category.name+'_categoryHome'"
                  is="coral-button"
                  selected=""
                  @click="setCategory(category)"
                  :value="category.name"
                  :title="category.name"
                  :aria-label="category.name  "
                >
                  {{category.name}}
                </button>
            </coral-buttongroup>
          </div>
          <div @click="scrollEl('categoriesWrapper', 0, -300)" class="click-to-scroll scroll-left chevron" :src="coralIcons.chevron" alt=""/>
          <div @click="scrollEl('categoriesWrapper', 0, 300)" class="click-to-scroll scroll-right chevron" :src="coralIcons.chevron" alt=""/>
        </div>
      </div> 

      <!-- Loading error -->
      <div v-if="false" class="waiting-wrapper">
        
        <NativeAd
          :adPosition="'Loading error'"
          :template="2"
          adId="CWYD65Q7"
          zoneKey="CWYD65Q7"
          key="CWYD65Q7"
        />

        <h3 class="coral-Heading--M">
          The site is temporarily down for maintenance purposes.
          <br>
        </h3>
        <h3 class="coral-Heading--S coral-Heading--light">
          Check again in a few minutes or follow me on
            <a rel="noopener"
              class="coral-Link"
              href="https://twitter.com/elrumo"
              target="_blank"
            >
              Twitter
            </a>
          to stay up to date.
        </h3>
      </div>
      
      <!-- No Results -->
      <div
        v-if="
          search.length == 0
          && searchString.length > 0
          && (
            getSelectedCategory.name == 'All'
            || getSelectedCategory.name == 'downloads' // downloads = Popular
          )
        "
        class="waiting-wrapper"
      >
        <p class="coral-Body--S">
          No results for <b>{{ searchString }}</b>
        </p>
      </div>

      <!-- No Results for category-->
      <div
        v-if="
          search.length == 0
          && searchString.length > 0
          && getSelectedCategory.name != 'All'
          && getSelectedCategory.name != 'Saved'
          && getSelectedCategory.name != 'downloads' // downloads = Popular
        "
        class="waiting-wrapper"
      >
        <div v-if="
          getSelectedCategory.nameid != 'Saved'
          && searchString.length > 0
        ">
          <p class="coral-Body--S">
            No results for <b>{{ searchString }}</b> in {{ getSelectedCategory.name }}. Try a different category.
          </p>
        </div>
      </div>
      
      <!-- No results for saved icons -->
      <div
        v-if="
          getSelectedCategory.name == 'Saved' && search.length == 0
        "
        class="waiting-wrapper"
      >
       <div v-if="isUserLoggedIn">
          <div
            v-if="
              search.length == 0
              && searchString.length == 0
            "
          >
            <p class="coral-Body--S">
              You haven't saved any icons yet, give it a go!
            </p>
          </div>
          
          <div v-if="
          searchString.length != 0
          && search.length == 0
          "
          >
            <p class="coral-Body--S">
              We cound not find <b>{{ searchString }}</b> in your Saved icons.
            </p>
          </div>
        </div>

        <div v-else-if="
          getSelectedCategory.name == 'Saved'
          && !isUserLoggedIn
        ">
          <p class="coral-Body--S">
            To save icons, you need to
            <a class="cursor-pointer" @click="showDialog('loginDialog')">
              login
            </a> or
            <a class="cursor-pointer" @click="showDialog('loginDialog')">
              create
            </a> 
            an account first.
          </p>
        </div>
      </div>

      <!-- Main area -->
      <div class="main-content-wrapper content-wrapper-regular">
        
        <!-- Categories List -->
        <nav
          v-if="!isMobile"
          id="categoriesWrapper-desktop"
          class="mobile-hidden categories-sidenav coral-card" is="coral-sidenav"
        >

         <!-- Featured Icons -->
          <!-- <button
            is="coral-sidenav-item"
            :icon="icons.Star"
            selected
            value="Featured"
            title="Featured"
            @click="setCategory({name: 'downloads'})"
          >
            Featured
          </button> -->

          <!-- All Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.AllIcons"
            selected
            value="All"
            title="all"
            @click="setCategory({name: 'All'})"
          >
            All Icons
          </button>

          <button
            is="coral-sidenav-item"
            @click="setLiquidGlassFilter()"
            :value="'Liquid Glass'"
            :title="'Liquid Glass'"
            :aria-label="'Liquid Glass'"
            :icon="icons.AppIcon"
            class="status-right"
            :class="{ 'is-selected': getIsLiquidGlassActive }"
          >
            <coral-status variant="info" class="_coral-StatusLight--info _coral-StatusLight"></coral-status>
            Liquid Glass
          </button>
          
          <!-- Popular Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.Flame"
            value="Featured"
            title="Featured"
            @click="setCategory({name: 'downloads'})"
          >
            Popular
          </button>
          
          <!-- Saved Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.Heart"
            value="Saved"
            title="Saved"
            @click="setCategory({name: 'Saved'})"
          >
            Saved
          </button>

          <hr class="coral-Divider--S m-t-8 m-t-8">

          <button
            :icon="icons[category.name.replaceAll(' ', '_').replace('&_', '')]"
            v-for="category in getAppCategories"
            :key="category.name+'_categoryHome'"
            is="coral-sidenav-item"
            @click="setCategory(category)"
            :value="category.name"
            :title="category.name"
            :aria-label="category.name"
          >
            {{category.name}}
          </button>

          <div class="gradient-categories-navbar" />
        </nav>


        <!-- Icon grid-->
        <div>
          <div 
            id="iconList" 
            class="p-b-32 icon-list-area"
          >
          
            <NativeAd
              :template="2"
              class="grid-ad"
              adId="CWYD65Q7"
              zoneKey="CWYD65Q7"
              key="CWYD65Q7"
            />

              <!-- v-for="icon in search" -->
              <!-- <div
                v-for="icon in iconInSearch(25)"
                :key="icon"
              >
                {{ typeof icon }}
              </div> -->

            <UserIconCard
              v-for="icon in iconInSearch(25)"
              :isLoading="
                searchString.length == 0
                && search.length == 0
                && getSelectedCategory.name != 'Saved'
              "
              :key="icon.id != undefined ? icon.id+icon.appName+getSelectedCategory.name : icon+Math.floor(Math.random() * 10000000 + 1)"
              :icon="icon"
              :isAdmin="isAdmin"
              :isMacOs="isMacOs"
            />
              <!-- @showDetails="handleShowDetails" -->
          </div>


        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue'

import Hero from './Hero.vue';
import NativeAd from './NativeAd.vue';
import UserIconCard from './UserIconCard.vue';
import IconDetailsModal from './IconDetailsModal.vue';

import ConfettiGenerator from "confetti-js";

import VueMarkdown from 'vue-markdown-render'

import Parse from 'parse';;


// TODO: remove credentials
const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = import.meta.env.VITE_PARSE_URL

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY);
Parse.serverURL = VITE_PARSE_URL;

var Icons = Parse.Object.extend("Icons2");

const docLimit = 20

import deleteIcon from "../assets/icons/delete.svg"
import namingOrderIcon from "../assets/icons/namingOrder.svg"
import dateIcon from "../assets/icons/date.svg"
import placeholderIcon from "../assets/placeholder-icon.png"
import BrowserExtensionsIcon from "../assets/icons/Category_Icons/Browser_Extensions.svg"
import DeveloperToolsIcon from "../assets/icons/Category_Icons/Developer_Tools.svg"
import EducationIcon from "../assets/icons/Category_Icons/Education.svg"
import EntertainmentIcon from "../assets/icons/Category_Icons/Entertainment.svg"
import FinanceIcon from "../assets/icons/Category_Icons/Finance.svg"
import GamesIcon from "../assets/icons/Category_Icons/Games.svg"
import Graphics_DesignIcon from "../assets/icons/Category_Icons/Graphics_Design.svg"
import HealthFitnessIcon from "../assets/icons/Category_Icons/Health_Fitness.svg"
import LifestyleIcon from "../assets/icons/Category_Icons/Lifestyle.svg"
import MedicalIcon from "../assets/icons/Category_Icons/Medical.svg"
import MusicIcon from "../assets/icons/Category_Icons/Music.svg"
import NewsIcon from "../assets/icons/Category_Icons/News.svg"
import PhotoVideoIcon from "../assets/icons/Category_Icons/Photo_Video.svg"
import ProductivityIcon from "../assets/icons/Category_Icons/Productivity.svg"
import ReferenceIcon from "../assets/icons/Category_Icons/Reference.svg"
import SocialNetworkingIcon from "../assets/icons/Category_Icons/Social_Networking.svg"
import SportsIcon from "../assets/icons/Category_Icons/Sports.svg"
import TravelIcon from "../assets/icons/Category_Icons/Travel.svg"
import UtilitiesIcon from "../assets/icons/Category_Icons/Utilities.svg"
import WeatherIcon from "../assets/icons/Category_Icons/Weather.svg"
import AllIconsIcon from "../assets/icons/Category_Icons/All_Icons.svg"
import StarIcon from "../assets/icons/Category_Icons/Star.svg"
import HeartIcon from "../assets/icons/Category_Icons/Heart.svg"
import AppIcon from "../assets/icons/Category_Icons/AppIcon.svg"
import HeartIconFilled from "../assets/icons/Category_Icons/Heart_Filled.svg"
import FlameIcon from "../assets/icons/Category_Icons/Flame.svg"

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import ChevronDownCoralIcon from "../assets/icons/ChevronDown.svg"

import AlgoliaIcon from "../assets/algolia_logo.svg"

// Components
import deleteDialog from './deleteDialog.vue';
import SaveIconsDialogue from './SaveIconsDialogue.vue';

// Composables
const { cookies: $cookies } = useCookies();
const store = useStore();
const route = useRoute();
const router = useRouter();

// Meta info
useHead({
  bodyAttrs: {
    title: 'macOS app icon pack - 7000+ ready icons for Big Sur & iOS',
    description: "7000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.",
    titleTemplate: '%s | macOSicons',
    meta: [
      // Facebook
      {
        property: 'og:url',
        content: 'https://macosicons.com'
      },
      {
        property: 'og:title',
        content: 'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
      },
      {
        property: 'og:description',
        content: 'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
      },
      {
        property: 'og:image',
        content: 'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
      },

      // Twitter
      {
        property: 'twitter:url',
        content: 'https://macosicons.com'
      },
      {
        property: 'twitter:description',
        content: 'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
      },
      {
        property: 'twitter:title',
        content: 'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
      },
      {
        property: 'twitter:image',
        content: 'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
      },
    ]
  }
});

// Reactive state
const page = ref(0);
const searchString = ref("");
const list = ref([]);

const getTodayDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;
  return today;
};

const cookies = ref({
  updatesIsRead: $cookies?.get('updatesIsRead'),
});

const overflow = ref(true);
const windowWidth = ref(window.innerWidth);
const scrolledToBottom = ref(true);
const sortByName = ref(true);
const noIcons = ref(true);
const isAuth = ref(false);
const loadingError = ref(false);

const howManyRecords = ref(0);

const isMacOs = ref(true);

const distanceFromTop = ref(true);

const today = ref(getTodayDate());
const selectedIcon = ref({});

const activeIcon = ref({});

const debounceTimer = ref(null);
const filesToUpload = ref({});
const filesToShow = ref({});
const totalNumFiles = ref(0);
const imageData = ref(false);

const icons = ref({
  success: deleteIcon,
  namingOrder: namingOrderIcon,
  date: dateIcon,
  loading: placeholderIcon,
  iconsOrder: namingOrderIcon,
  Browser_Extensions: BrowserExtensionsIcon,
  Developer_Tools: DeveloperToolsIcon,
  Education: EducationIcon,
  Entertainment: EntertainmentIcon,
  Finance: FinanceIcon,
  Games: GamesIcon,
  Graphics_Design: Graphics_DesignIcon,
  Health_Fitness: HealthFitnessIcon,
  Lifestyle: LifestyleIcon,
  Medical: MedicalIcon,
  Music: MusicIcon,
  News: NewsIcon,
  Photo_Video: PhotoVideoIcon,
  Productivity: ProductivityIcon,
  Reference: ReferenceIcon,
  Social_Networking: SocialNetworkingIcon,
  Sports: SportsIcon,
  Travel: TravelIcon,
  Utilities: UtilitiesIcon,
  Weather: WeatherIcon,
  AllIcons: AllIconsIcon,
  Star: StarIcon,
  Heart: HeartIcon,
  AppIcon: AppIcon,
  HeartFilled: HeartIconFilled,
  Flame: FlameIcon,
});

const coralIcons = ref({
  delete: deleteIcon,
  addIcon: addCoralIcon,
  newItem: newItemCoralIcon,
  edit: editCoralIcon,
  loading: placeholderCoralIcon,
  chevron: ChevronDownCoralIcon,
});

// Computed properties from store
const getUser = computed(() => store.getters.getUser);
const getAppCategories = computed(() => store.getters.getAppCategories);
const selectedIcons = computed(() => store.getters.selectedIcons);
const getSelectedCategory = computed(() => store.getters.getSelectedCategory);
const getHomeDialog = computed(() => store.getters.getHomeDialog);
const getIconListLen = computed(() => store.getters.getIconListLen);
const isLoading = computed(() => store.getters.isLoading);
const getIsLiquidGlassActive = computed(() => store.getters.getIsLiquidGlassActive);

// Local computed properties
const isMobile = computed(() => windowWidth.value <= 820);

const isAdmin = computed(() => {
  if (getUser.value.isAuth) {
    if (getUser.value.userData.Role.objectId == "OoxWjSJuQi") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

const getParseObj = computed(() => Icons);

const search = computed(() => {
  if (selectedIcons.value.length == 0) {
    noIcons.value = true;
  } else {
    noIcons.value = false;
  }

  return selectedIcons.value;
});

const isUserLoggedIn = computed(() => {
  if (Parse.User.current()) return true;
  else return false;
});

// Methods
const showToast = (payload) => {
  store.dispatch('showToast', payload);
};

const setCategory = (category) => {
  store.dispatch('setCategory', category);
};

const setLiquidGlassFilter = () => {
  store.dispatch('setLiquidGlassFilter');
};

const iconInSearch = (num) => {
  let searchResults = search.value;
  let searchStringEmpty = searchString.value.length == 0;

  if (searchResults.length > 0) {
    return searchResults;
  } else if (!searchStringEmpty && searchResults.length == 0) {
    return 0;
  } {
    return num;
  }
};

const setCookie = (key, val) => {
  cookies.value[key] = val;
  $cookies?.set(key, val);
};

const handleScroll = () => {
  let searchBar = document.getElementById("searchBar");
  if (!searchBar) return;
  distanceFromTop.value = document.getElementById("searchBar").getBoundingClientRect().y > 65;
};

const setEventListenersOnStart = () => {
  window.addEventListener('scroll', handleScroll);

  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
};

const searchForPathQuery = () => {
  let routerName = route.name;
  let serachValue = router.currentRoute.value.params.search;
  if (routerName == "Search") {
    searchString.value = serachValue;
  }
};

const cmdK = () => {
  document.addEventListener('keydown', (event) => {
    let isCmdkPressed = event.getModifierState('Meta') && event.key.toLowerCase() == 'k';

    if (isCmdkPressed) {
      document.getElementById('searchBarInput').focus();
      document.getElementById('searchBarInput').click();
    }
  });
};

const scrollEl = (id, top, left) => {
  let scrollLeft = document.getElementById(id).scrollLeft;
  let scrollTop = document.getElementById(id).scrollTop;

  document.getElementById(id).scroll({
    top: scrollTop + top,
    left: scrollLeft + left,
    behavior: 'smooth'
  });
};

const toggleOverflow = () => {
  document.documentElement.style.overflow = '';
};

const copySearch = async () => {
  let toCopy = "https://macosicons.com/#/" + searchString.value;

  await navigator.clipboard.writeText(toCopy);

  store.dispatch('showToast', {
    id: "toastMessage",
    message: "✅ Link copied to your clipboard",
    variant: "success"
  });

  window.plausible("PageShared", {
    props: {
      sharedTerm: searchString.value,
      date: today.value,
    }
  });
};

const clearSearch = () => {
  searchString.value = "";
};

const changeOS = (e) => {
  if (e.target.value == "macOS") {
    isMacOs.value = true;
  } else {
    isMacOs.value = false;
  }
};

const loadMore = async () => {
  if (route.path != "/") {
    return;
  }

  if (store.state.selectedCategory.name != "All") {
    if (store.state.totalCategory == selectedIcons.value.length) {
      scrolledToBottom.value = true;
      return;
    } else {
      setTimeout(() => {
        store.dispatch('loadMoreIcons');
        scrolledToBottom.value = true;
      }, 800);
      return;
    }
  } else {
    if (store.state.totalCategory == selectedIcons.value.length) {
      scrolledToBottom.value = true;
      return;
    } else {
      setTimeout(() => {
        page.value = page.value + 1;
        store.dispatch('algoliaSearch', { page: page.value, concat: true });
        scrolledToBottom.value = true;
      }, 800);
      return;
    }
  }
};

const scroll = () => {
  window.onscroll = () => {
    let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000;
    
    if (bottomOfWindow && scrolledToBottom.value) {
      scrolledToBottom.value = false;
      loadMore();
    }
  };
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'image/png') {
    store.commit('setDroppedFile', file);
    showDialog('submissionDialog');
  }
};

const handleParseError = (err) => {
  console.log("Error getting icons, report this error to @elrumo: ", err);
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      window.location.reload();
      break;

    case 100:
      break;

    default:
      loadingError.value = "true";
      break;
  }
};

const showDialog = (dialogId) => {
  document.getElementById(dialogId).show();
};

// Watchers
watch(searchString, (val) => {
  page.value = 0;

  if (route.name != "Home" && route.name != "Search") return;

  if (val == '') {
    store.dispatch('setData', { state: "searchString", data: val });
    store.dispatch('algoliaSearch', { page: 0, concat: false });
    return;
  }

  store.dispatch('setData', { state: "searchString", data: val });

  if (debounceTimer.value) clearTimeout(debounceTimer.value);

  debounceTimer.value = setTimeout(() => {
    store.dispatch('algoliaSearch', { page: 0, concat: false });
  }, 200);
}, { deep: true });

watch(() => store.state.content, () => {
  nextTick(() => {
    // Content watcher - keeping for potential future use
  });
}, { deep: true });

// Lifecycle hooks
onMounted(async () => {
  if (store.state.droppedFile) {
    const file = store.state.droppedFile;
    const fileName = file.name.replace('.png', '');
    filesToUpload.value[fileName] = file;
    const objectURL = window.URL.createObjectURL(file);
    const value = {
      img: objectURL,
      name: fileName
    };
    filesToShow.value[fileName] = value;
    totalNumFiles.value = Object.keys(filesToShow.value).length;
    imageData.value = true;
    store.commit('setDroppedFile', null);
  }

  const urlParams = new URL(window.location.href.replace(/#/g, "%23")).searchParams;
  const iconParam = urlParams.get('icon');

  if (iconParam) showDialog('iconDetailsDialog');

  try {
    store.dispatch('algoliaSearch', { page: page.value, concat: false });
    scroll();
    store.dispatch('fetchSavedIcons');
  } catch (error) {
    handleParseError(error);
  }

  cmdK();
  searchForPathQuery();
  // setEventListenersOnStart();
  store.dispatch('fetchUserAttributes');

  await store.dispatch('fetchHomeDialog');
  
  if (getHomeDialog.value.showParticles) {
    let particlesImageUrl = 'https://api.macosicons.com' + getHomeDialog.value.particlesImage.data.attributes.url;
    try {
      var confettiSettings = {
        target: "confetti-canvas",
        max: " 20",
        size: " 1",
        animate: true,
        props: [{
          type: "svg",
          src: particlesImageUrl,
          size: 25,
        }],
        respawn: false,
        clock: "15",
        rotate: true,
        start_from_edge: true,
      };
      var confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    } catch (error) {
      console.log("No confetti: ", error);
    }
  }

  cookies.value.updatesIsRead = $cookies.get('updatesIsRead');
  isAuth.value = getUser.value.isAuth;
  let fullPath = route.fullPath;
  let currentUser = Parse.User.current();
  if (fullPath.includes("/?username=") && !currentUser) {
    store.dispatch('showEl', "loginDialog");
  }
});

onUnmounted(() => {
  // window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss">
  // @import url(coral.css);
  @import 'app.scss';
  @import 'snack-helper.min.css';
  @import 'carbon.scss';

  .paypal-wrapper{
    margin-top: 20px;
    margin-top: 20px;
    background: white;
    padding: 20px;
    border-radius: 7px;
  }


</style>
