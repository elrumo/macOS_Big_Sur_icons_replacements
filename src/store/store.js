import { createStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js';
import router from '@/router/index.js'

import { marked } from 'marked';

import localResources from '@/api/resources.json';
import localPages from '@/api/pages.json';
import localPosts from '@/api/posts.json';
import icons from '@/api/icons.json';
import iconBrew from "@/api/iconBrew.js"
// import { getPages, getSinglePage } from '@/api/posts';

import {
    getTutorials,
    getLearningHome,
    getTutorialFromSlug,
    getArticleTemplate,
    getStrapiData,
    getResourceFromSlug,
    getDialogHome
  } from '@/api/strapi';

const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = import.meta.env.VITE_PARSE_URL

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = VITE_PARSE_URL
let IconsBase = Parse.Object.extend("Icons2");

export default createStore({

  state() {
    return{
      list: icons,
      dataToShow: [],
      similarIcons: [],
      isSimilarLoading: false,
      droppedFile: null,
      
      noMoreResults: false,
      iconListLen: 13_072,

      blogPosts: {},
      localPosts: localPosts,

      selectedIcon: {},

      resourcesData: localResources,
      singleResourceData: {},
      moreResources: {},
      resourcesTemplate: {},
      articleTemplate: {},

      homeDialog: {},

      supportMessage: 'Disabling your ad blocker or making a [donation](https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN) is the best way to support this project.',

      singleLearningResource: {},
      learningResources: [],
      learningHome: {
                      h3: "Tutorials",
                      description: "More tutorials on everything macOS icons coming soon. If you’d like to contribute or make suggestions, let us know on our [Discord](https://discord.gg/f4mTRyyTkT) channel or [Twitter](https://twitter.com/elrumo).",
                      isAd: false,
                      isCenter: true,
                    },
                    
      user: {
        bio: "",
        credit: "",
        id: "",
        twitterHandle: "",
        username: "",
      },
      userAttributes: {},
      savedIcons: [],
      savedIconCount: "",
      
      userData: Parse.User.current(),

      isAuth: false,

      loading: true,

      downloads:[],

      searchString: "",
      searchData: [],
      
      userIcons: {
        approved: [],
        notApproved: [],
        hacked: [],
        toSkip: {
          approved: 0,
          notApproved: 0
        },
        count: {
          approved: 0,
          notApproved: 0,
          hacked: 0
        }
      },
      
      selectedCategory: {
        name: "All",
        id: "All",
      },
      isLiquidGlassActive: false,
      totalCategory: 0,
      appCategories: [
        {"id":"qI4GKWNpum","name":"Browser Extensions","categoryObj":{"className":"Categories","_objCount":16,"id":"qI4GKWNpum"}},{"id":"m2v3VuzZEu","name":"Developer Tools","categoryObj":{"className":"Categories","_objCount":3,"id":"m2v3VuzZEu"}},{"id":"0BnPHRjdrQ","name":"Education","categoryObj":{"className":"Categories","_objCount":4,"id":"0BnPHRjdrQ"}},{"id":"gVBckgE4zl","name":"Entertainment","categoryObj":{"className":"Categories","_objCount":5,"id":"gVBckgE4zl"}},{"id":"rq2vNGoV92","name":"Finance","categoryObj":{"className":"Categories","_objCount":2,"id":"rq2vNGoV92"}},{"id":"6DiDa4yD4m","name":"Games","categoryObj":{"className":"Categories","_objCount":6,"id":"6DiDa4yD4m"}},{"id":"sQCYzXFttB","name":"Graphics & Design","categoryObj":{"className":"Categories","_objCount":7,"id":"sQCYzXFttB"}},{"id":"7SbNrtDxDh","name":"Health & Fitness","categoryObj":{"className":"Categories","_objCount":9,"id":"7SbNrtDxDh"}},{"id":"7KYFn5kd15","name":"Lifestyle","categoryObj":{"className":"Categories","_objCount":8,"id":"7KYFn5kd15"}},{"id":"GgZF9kgRR7","name":"Medical","categoryObj":{"className":"Categories","_objCount":10,"id":"GgZF9kgRR7"}},{"id":"BO0gbTCPUK","name":"Music","categoryObj":{"className":"Categories","_objCount":12,"id":"BO0gbTCPUK"}},{"id":"jQbEVy2jCI","name":"News","categoryObj":{"className":"Categories","_objCount":11,"id":"jQbEVy2jCI"}},{"id":"ghYlSc5rf4","name":"Photo & Video","categoryObj":{"className":"Categories","_objCount":13,"id":"ghYlSc5rf4"}},{"id":"joml1zA4lv","name":"Productivity","categoryObj":{"className":"Categories","_objCount":14,"id":"joml1zA4lv"}},{"id":"StBWAxgpbs","name":"Reference","categoryObj":{"className":"Categories","_objCount":15,"id":"StBWAxgpbs"}},{"id":"dtOc7xXCaR","name":"Social Networking","categoryObj":{"className":"Categories","_objCount":17,"id":"dtOc7xXCaR"}},{"id":"thUmE1CYrl","name":"Sports","categoryObj":{"className":"Categories","_objCount":18,"id":"thUmE1CYrl"}},{"id":"Fhs38OomHD","name":"Travel","categoryObj":{"className":"Categories","_objCount":19,"id":"Fhs38OomHD"}},{"id":"EzBFwmxpNd","name":"Utilities","categoryObj":{"className":"Categories","_objCount":21,"id":"EzBFwmxpNd"}},{"id":"SIMwpAEm4Z","name":"Weather","categoryObj":{"className":"Categories","_objCount":20,"id":"SIMwpAEm4Z"}}
      ],
      iconType: [],
      cache: {
        categories: null,
        iconTypes: null,
        userIcons: {},
        savedIcons: null,
      }
    }
  },

  mutations: {   
    pushIconData(store, iconData){
      store.list.push(iconData)
    },
      
    setDroppedFile(state, file) {
      state.droppedFile = file;
    },
    
    pushAllPages(){
      return localPages
    },

    pushDataToArr(store, iconData){
      
      let concatArray = iconData.concatArray

      if (concatArray) {
        store[iconData.arr] = store[iconData.arr].concat(iconData.data)
      } else if (Array.isArray(iconData.data) && !concatArray) {
        store[iconData.arr] = iconData.data
      } else{
        store[iconData.arr].push(iconData.data)
      }
    },
    
    setDataToArr(store, iconData){
      if (iconData.key) {
        let tempArr = {};
        // Duplicates object and adds it back to state so that Vuex sees that it has been updated.
        for(let key in store[iconData.arr]){
          tempArr[key] = store[iconData.arr][key];
        }
        tempArr[iconData.key] = iconData.data;
        store[iconData.arr] = tempArr;
      } else{
        store[iconData.arr] = iconData.data;
      }
    },
  
    pushBlogs(store, blogData){
      store.blogPosts = blogData;
    },

    // getSinglePageMutation(store, pageData){
    //   store.singleResourceData = pageData;
    // },

    setUser(store, user){
      store.user = user;
      store.userData = user;
    },

    pushUserData(store, userData){
      store.userData = userData;
    },

    setState(store, data){
      let state = data.state
      let payload = data.payload
      
      store[state] = payload;
    },

    pushUserIcons(store, data){
      let iconData = data.iconData
      let status = data.status
      store.userIcons[status].push(iconData);
    },

    pushAppCategories(store, data){
      store[data.state].push(data.storeObj);
    },

  },
  

  actions: {

    stateStateAction(store, payload){
      store.commit('setState', payload)
    },

    async queryCategory(store, categoryId) {
      const Categories = Parse.Object.extend("Categories");
      let categoryQuery = new Parse.Query(Categories);
      categoryQuery.get(categoryId.name);
      let categoryParse = await categoryQuery.find()
    
      if (categoryParse.length > 0) {
        return categoryParse[0]
      } else{
        return
      }
    },

    setAuth(store, isAuth){
      store.commit('setState', {state: 'isAuth', payload: isAuth})
    },

    async fetchResourceFromSlug(store, slug){
      let resource;
      
      try {
        resource = await getResourceFromSlug(slug)
        if(resource.error){
          console.log(slug);
          console.log(resource.error);
          // router.push('/resources')
        }else{
          store.commit('setDataToArr', {arr: 'singleResourceData', data: resource})
        }
      } catch (error) {
        console.log('error: ', error);
      }
    },

    async fetchHomeDialog(store){
      let dialogData = await getDialogHome();
      store.commit('setDataToArr', {arr: 'homeDialog', data: dialogData[0]})
    },

    async fetchResourcesHome(store){
      let resourcesData = await getStrapiData('resources');
      store.commit('setDataToArr', {arr: 'resourcesData', data: resourcesData})
    },
    
    async fetchArticleTemplate(store, data){
      let pageTemplate = await getArticleTemplate(data.slug)
      store.commit('setDataToArr', {arr: data.state, data: pageTemplate})
    },

    async getTutorialFromSlug(store, slug){
      let tutorial = await getTutorialFromSlug(slug)

      if(tutorial.error){
        router.push('/learn')
      }else{
        store.commit('setDataToArr', {arr: 'singleLearningResource', data: tutorial})
      }
    },

    async fetchLearningResources(store){
      let learningResources = store.getters.getLearningResources;
      if(Object.keys(learningResources).length) return; // If no resources is found, fetch them

      try {
        store.commit('setDataToArr', {arr: 'learningResources', data: await getTutorials()})
      } catch (error) {
        console.log("Error fetching learning resources: ", error);
      }
    },

    async fetchLearningHome(store){
      store.commit('setDataToArr', {arr: 'learningHome', data: await getLearningHome()})
    },

    async getSearchResults(store, options) {
      try {
        const searchQuery = options.search;
        const searchOptions = options.searchOptions;
        
        const primaryUrl = import.meta.env.VITE_BACKEND_URL + 'search';
        const backupUrl = import.meta.env.VITE_BACKEND_URL_ALT + 'search';

        const requestBody = JSON.stringify({
          query: searchQuery,
          searchOptions,
          apiKey: import.meta.env.VITE_PARSE_JAVASCRIPT_KEY,
        });

        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: requestBody
        };

        // Try primary URL with timeout
        const primaryPromise = Promise.race([
          fetch(primaryUrl, requestConfig),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          )
        ]);

        try {
          const response = await primaryPromise;
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (primaryError) {
          console.log('Primary URL failed, trying backup URL...');
          
          // Try backup URL
          const backupResponse = await fetch(backupUrl, requestConfig);
          
          if (!backupResponse.ok) {
            throw new Error(`HTTP error! status: ${backupResponse.status}`);
          }
          
          return await backupResponse.json();
        }

      } catch (error) {
        console.error('Error searching:', error);
        throw error;
      }
    },

    async algoliaSearch(store, payload){
      let search = payload.search || store.state.searchString;
      let category = payload.category != undefined ? payload.category : store.state.selectedCategory.name;
      let page = payload.page || 0;
      let concat = payload.concat || false;
      let similarSearch = payload.similarSearch || false;
      let setSelectedIcon = payload.setSelectedIcon || false;
      let iconId = payload.iconId || null;

      if(similarSearch) store.commit('setState', {state: "isSimilarLoading", payload: true});

      let algoliaSearch;
      let searchResults;

      try {
        let searchOptions = {
          filters: [
            category !== "All" && !store.state.isLiquidGlassActive ? `category = ${category}` : "",
            store.state.isLiquidGlassActive ? `isLiquidGlass = true` : "",
            iconId !== null ? `objectID = ${iconId}` :  ""
          ],
          hitsPerPage: 150,
          sort: ['timeStamp:desc']
        }

        let algoliaOptions = {
          hitsPerPage: 150,
          page,
          filters: "approved:true",
        }

        if ((store.state.selectedCategory.name != "All" || store.state.isLiquidGlassActive) && !similarSearch && !setSelectedIcon) {
          if (store.state.isLiquidGlassActive) {
            algoliaOptions.filters += ` AND isLiquidGlass:true`
          } else {
            algoliaOptions.filters += ` AND category:"`+category+`"`
          }

          const startTime = Date.now();
          const searchPromise = store.dispatch('getSearchResults', {search, searchOptions});
          
          const timeoutPromise = new Promise(resolve => {
            setTimeout(() => {
              if (Date.now() - startTime > 500) {
                store.commit('setDataToArr', {arr: "loading", data: true});
              }
              resolve();
            }, 500);
          });
          
          await Promise.race([timeoutPromise, searchPromise]);
          searchResults = await searchPromise;

          // searchResults = algoliaSearch;

          searchResults.hits = searchResults.hits.map(item => {
            return {
              ...item,
              id: item.objectID 
            }; 
          });

          console.log

          store.commit('pushDataToArr', {arr: "searchData", data: searchResults.hits})
        } else{ ;

          if (search.length != 0) {
            algoliaOptions.hitsPerPage = 25
            algoliaOptions.page = payload.page

            searchOptions.hitsPerPage = 25
            searchOptions.page = payload.page
          }


          const startTime = Date.now();
          let timeoutId;
          
          const timeoutPromise = new Promise(resolve => {
            timeoutId = setTimeout(() => {
              if (Date.now() - startTime > 300) {
                store.commit('setDataToArr', {arr: "loading", data: true});
              }
              resolve();
            }, 300);
          });

          const searchPromise = store.dispatch('getSearchResults', {search, searchOptions})
            .then(result => {
              store.commit('setDataToArr', {arr: "loading", data: false});
              clearTimeout(timeoutId); // Cancel timeout if search finishes first
              return result;
            });
          
          await Promise.race([timeoutPromise, searchPromise]);
          searchResults = await searchPromise;

          // algoliaSearch = await algoliaIndex.search(search, algoliaOptions)
          // searchResults = algoliaSearch;

          // Set the value of objectID to a new key named id
          searchResults.hits = searchResults.hits.map(item => {
            return {
              ...item,
              id: item.objectID 
            }; 
          });

          if(setSelectedIcon){
            store.commit('setDataToArr', {arr: "selectedIcon", data: searchResults.hits[0]})
            return searchResults.hits[0]
          }
          
          if(similarSearch){
            if (store.state.selectedIcon && store.state.selectedIcon.id) {
              searchResults.hits = searchResults.hits.filter(icon => icon.id !== store.state.selectedIcon.id);
            }
          }

          if (concat) {
            store.commit('pushDataToArr', {arr: "searchData", data: searchResults.hits, concatArray: true})
          } else{
            store.commit('pushDataToArr', {arr: similarSearch ? "similarIcons" : "searchData", data: searchResults.hits})
            store.commit('setDataToArr', {arr: "iconListLen", data: searchResults.totalDocuments})
          }
        }
      } catch (error) {
        console.log("Error on search: ", error); 
        throw error
      } finally{
        if(similarSearch) {
          store.commit('setState', {state: "loading", payload: false});
          store.commit('setState', {state: "isSimilarLoading", payload: false});
        }
      }
    },

    setData(store, data){
      if (data.key) {
        store.commit('setDataToArr', {arr: data.state, key: data.key, data: data.data})
      } else{
        store.commit('setDataToArr', {arr: data.state, data: data.data})
      }
    },
    
    async loadMoreIcons(store){
      let totalCategory = store.state.totalCategory
      let toSkip = store.state.dataToShow.length

      if (totalCategory == toSkip) return
      
      const query = new Parse.Query(IconsBase);
      let selectedCategory = store.state.selectedCategory
      let numToLoad = 30
      
      if (selectedCategory.name == 'downloads') {
        query.descending("downloads");
      } else if(selectedCategory.name == 'Saved'){
        return
      } else if(store.state.isLiquidGlassActive){
        query.descending("timeStamp");
        query.equalTo("isLiquidGlass", true);
      } else if(selectedCategory.name == 'All'){
      } else {
        let categoryParse = await store.dispatch('queryCategory', {name: selectedCategory.name});
        
        query.descending("timeStamp");
        query.equalTo("category", categoryParse);
      }

      query.exists("icnsFile");
      query.equalTo("approved", true);
      query.limit(numToLoad)
      query.skip(toSkip)


      const results = await query.find()
      let allIcons = []

      for(let result in results){
        let objData = results[result].attributes
        let iconData = {}

        for(let data in objData){
          iconData[data] = objData[data]
        }
        iconData.id = results[result].id;
        
        allIcons.push(iconData)
      }

      store.commit('pushDataToArr', {arr: "dataToShow", data: allIcons, concatArray: true})
    },

    scrollTo(){
      if(window.innerWidth >= 820){
        // window.scrollTo(0, 296)
        window.scrollTo(0, 370)
        
      } else{
        window.scrollTo(0, 300)
      }
    },

    setDroppedFile(state, file) {
      state.droppedFile = file
    },

    async fetchSavedIcons(store){
      if (!Parse.User.current()){
        return 
      }

      if (store.state.cache.savedIcons) {
        store.commit('setDataToArr', {arr: 'savedIcons', data: store.state.cache.savedIcons})
        store.commit('setDataToArr', {arr: 'savedIconCount', data: store.state.cache.savedIcons.length})
        return store.state.cache.savedIcons
      }

      let savedIconsQuery = Parse.User.current().relation("favIcons").query()
      
      try {
        let userSavedIconData = await savedIconsQuery.descending("createdAt").find()
        let savedIconCount = userSavedIconData.length;
        
        store.commit('setDataToArr', {arr: 'savedIconCount', data: savedIconCount})
        
        let iconsToShow = userSavedIconData.map(icon => {
          let newIcon = {
            ...icon.attributes,
            isSaved: true,
            id: icon.id
          }
          return newIcon
        })
        
        store.commit('setDataToArr', {arr: "savedIcons", data: iconsToShow })
        
        // Cache the results
        store.commit('setDataToArr', {arr: 'cache', key: 'savedIcons', data: iconsToShow})
        
        return iconsToShow
      } catch (error) {
        console.error("Error fetching saved icons:", error);
        store.dispatch('handleParseError', error);
        return []
      }
    },

    async setCategory(store, category){
      let newCategory = category.name
      let oldCategory = store.state.selectedCategory.name
      let sameCategory = newCategory == oldCategory;
      // let search = store.state.searchString

      store.dispatch('scrollTo')
      store.dispatch('fetchSavedIcons')
      store.commit('setDataToArr', {arr: 'selectedCategory', data: category, concatArray: false}) // set category
      store.commit('setDataToArr', {arr: 'isLiquidGlassActive', data: false, concatArray: false}) // reset liquid glass filter
      
      let savedIcons = store.state.savedIcons

      store.dispatch('algoliaSearch', {page: 0})

      // if (category.name == "All") return;

      if (category.name == "Saved" && !sameCategory) {
        // let savedIcons = store.state.savedIcons
        store.commit('setDataToArr', {arr: 'totalCategory', data: store.state.savedIconCount})
        store.commit('pushDataToArr', {arr: "dataToShow", data: savedIcons})
      }
      
      if (category.name != "All" && !sameCategory && category.name != "Saved") {
        store.commit('setDataToArr', {arr: 'dataToShow', data: [], concatArray: false})

        let toSkip = store.state.dataToShow.length // Checks how many icons with that category have already been fetched

        let approvedQuery = new Parse.Query(IconsBase);
        let numToLoad = 25

        if (category.name == "downloads") {
          approvedQuery.descending("downloads");
        } else if (category.id) {
          let categoryParse = await store.dispatch('queryCategory', {id: category.id});
          approvedQuery.descending("timeStamp");
          approvedQuery.equalTo("category", categoryParse);
        }else{
          console.log("Error: No category selected");
        }
        
        approvedQuery.exists("icnsFile");
        approvedQuery.equalTo("isHidden", false);
        approvedQuery.equalTo("approved", true);
        approvedQuery.limit(numToLoad)
        approvedQuery.skip(toSkip)

        let totalCategory = await approvedQuery.count()
        store.commit('setDataToArr', {arr: 'totalCategory', data: totalCategory})
        
        let results = await approvedQuery.find();        
        let allIcons = []

        for(let result in results){

          let iconItem = results[result]
          let objData = iconItem.attributes
          let iconData = {}
          iconData.id = iconItem.id
          
          for(let data in objData){
            iconData[data] = objData[data]
          }
          
          iconData.id = results[result].id
          allIcons.push(iconData)
        }

        store.commit('pushDataToArr', {arr: "dataToShow", data: allIcons})
      }

    },

    async setLiquidGlassFilter(store){
      store.dispatch('scrollTo')
      store.dispatch('fetchSavedIcons')
      store.commit('setDataToArr', {arr: 'selectedCategory', data: {name: 'All', id: 'All'}, concatArray: false})
      store.commit('setDataToArr', {arr: 'isLiquidGlassActive', data: true, concatArray: false})
      
      store.dispatch('algoliaSearch', {page: 0})
    },

    async fetchUserAttributes(store){
      let ParseUser = Parse.User.current()
      if (ParseUser) {
        let userProps = ParseUser.attributes
        store.commit('setDataToArr', {arr: 'userAttributes', data: userProps})
      }
    },


    async fetchUserIcons(store, userObj){
      const cacheKey = userObj.id;
      if (store.state.cache.userIcons[cacheKey]) {
        store.commit('setDataToArr', {arr: 'userIcons', data: store.state.cache.userIcons[cacheKey]})
        return true
      }

      let approvedQuery = new Parse.Query(IconsBase);
      let notApprovedQuery = new Parse.Query(IconsBase);
      let numToLoad = 15
      
      approvedQuery.limit(numToLoad)
      approvedQuery.equalTo("isHidden", false);
      approvedQuery.equalTo("user", userObj);
      approvedQuery.equalTo("approved", true);
      approvedQuery.exists("icnsFile");
      approvedQuery.skip(store.state.userIcons.toSkip.approved)
      approvedQuery.descending("createdAt");
      approvedQuery.select("appName", "approved", "category", "createdAt", "credit", "downloads", "highResPngUrl", "iOSUrl", "icnsUrl", "id", "isHidden", "isReview", "lowResPngUrl", "status", "timeStamp", "type", "usersName" );
      
      notApprovedQuery.equalTo("isHidden", false);
      notApprovedQuery.limit(numToLoad)
      notApprovedQuery.equalTo("user", userObj);
      notApprovedQuery.skip(store.state.userIcons.toSkip.notApproved)
      notApprovedQuery.equalTo("approved", false);
      notApprovedQuery.descending("createdAt");

      try {
        const [iconResults, notApproved, approvedCount, notApprovedCount] = await Promise.all([
          approvedQuery.find(),
          notApprovedQuery.find(),
          approvedQuery.count(),
          notApprovedQuery.count()
        ]);

        store.state.userIcons.toSkip.approved += numToLoad;
        store.state.userIcons.toSkip.notApproved += numToLoad;
        store.state.userIcons.count.approved = approvedCount;
        store.state.userIcons.count.notApproved = notApprovedCount;

        const processResults = (results, status) => {
          return results.map(result => {
            let icon = result.attributes;
            let iconData = {
              ...icon,
              id: result.id,
              category: icon.category || {id: ""}
            };
            return {status, ...iconData};
          });
        };

        const approvedIcons = processResults(iconResults, "approved");
        const notApprovedIcons = processResults(notApproved, "notApproved");

        const allIcons = [...approvedIcons, ...notApprovedIcons];
        store.commit('setDataToArr', {arr: 'userIcons', data: {
          approved: approvedIcons,
          notApproved: notApprovedIcons,
          count: store.state.userIcons.count,
          toSkip: store.state.userIcons.toSkip
        }});

        // Cache the results
        store.commit('setDataToArr', {
          arr: 'cache',
          key: 'userIcons',
          data: {[cacheKey]: store.state.userIcons}
        });

        store.commit('setDataToArr', {arr: "loading", data: false});
        return true;
      } catch (error) {
        console.error("Error fetching user icons:", error);
        store.dispatch('handleParseError', error);
        store.commit('setDataToArr', {arr: "loading", data: false});
        return false;
      }
    },

    showToast(store, dialogId){
      document.getElementById(dialogId.id).content.innerHTML = dialogId.message;
      document.getElementById(dialogId.id).variant = dialogId.variant;
      document.getElementById(dialogId.id).show();
    },
    
    async addClickCount(store, icon){
      if (store.state.downloads.indexOf(icon.id) == -1) {
        store.commit('setDataToArr', {arr: 'downloads', data: icon.id})
        var id
        if (icon.id) {
          id = icon.id
        } else{
          id = icon.objectID
        }
        icon = { appName: icon.appName, id: id }
        await Parse.Cloud.run("addClickCount", {icon: icon});
      } else{
        return "No download"
      }
    },

    getPageData(store){
      console.log(store.resourcesData);
    },

    setSelectedIcon(store, icon){
      store.commit('setDataToArr', {arr: 'selectedIcon', data: icon})
    },

    emptyArr(store){
      // store.state.userIcons = [];
      store.state.userIcons.approved = [];
      store.state.userIcons.notApproved = [];
      store.state.userIcons.hacked = [];
      store.state.userIcons.toSkip.approved = 0;
      store.state.userIcons.toSkip.notApproved = 0;
    },

    pushDataToArr(store, iconData){
      store.commit('pushDataToArr', iconData)
    },

    // Gets most up to date info for each icon
    async fetchIconUserInfo(store, data){
      
      let results = data.results
      var howManyRecords = data.howManyRecords

      async function setUserInfo(index, user, username){
        index = parseInt(index)+howManyRecords
        try {
          
          let newUser = user.get("user")
          await newUser.fetch()
          store.state.list[index].usersName = newUser.getUsername();
          // store.state.list[index].usersName = user.get("usersName");
          store.state.list[index].credit = user.get("credit");
        } catch (error) {
          console.log(error);
        }
      }
      
      for(let result in results){
        let user = results[result]

        if (user.get("user")) {
          if (result == 0) {
            setUserInfo(result, user, "username")
          }
          if (result != 0) {
            let previousItem = results[result-1]
            if (user.id != previousItem.get("user").id) {
              setUserInfo(result, user, "username")
            }
          }
        } else {
          setUserInfo(result, results[result], "usersName")
        }
      }

    },

    setDataToArr(store, iconData){
      store.commit('setDataToArr', iconData)
    },

    deleteItem(store, item){
      let allIcons = store.state.dataToShow.indexOf(item)
      let approved = store.state.userIcons.approved.indexOf(item)
      let notApproved = store.state.userIcons.notApproved.indexOf(item)

      if (allIcons != 1) {
        console.log("allIcons deleted");
        store.state.dataToShow.splice(allIcons, 1);
      }

      if (approved != 1) {
        console.log("approved deleted");
        store.state.userIcons.approved.splice(approved, 1);
        store.state.userIcons.count.approved -= 1
      }
      
      if (notApproved != 1) {
        console.log("notApproved deleted");
        store.state.userIcons.notApproved.splice(notApproved, 1);
        store.state.userIcons.count.notApproved -= 1
      }

    },

    pushBlogs(store, blogData){
      store.commit('pushBlogs', blogData)
    },

    // async getSinglePageAction(store, slug){
    //   return getSinglePage(slug)
    // },

    showEl(store, id){
      try {
        if(id.elId != undefined){
          const element = document.getElementById(id.elId);
          if (element && typeof element.show === 'function') {
            element.target = "#"+id.targetId;
            element.show();
          } else if (element) {
            element.style.display = 'block';
          } else {
            console.error(`Element with ID ${id.elId} not found`);
          }
        } else {
          const element = document.getElementById(id);
          if (element && typeof element.show === 'function') {
            element.show();
          } else if (element) {
            element.style.display = 'block';
          } else {
            console.error(`Element with ID ${id} not found`);
          }
        }
      } catch (error) {
        console.error('Error showing element:', error);
      }
    },

    setUser(store, user){
      let currentUser = Parse.User.current()
      if (currentUser) {
        store.commit('setUser', currentUser)
      }
    },

    logOut(store){
      Parse.User.logOut().then(() => {
        console.log("logged out");
        store.commit('setUser', null)  // this will now be null
        window.location.reload()
      });
    },

    changePath(store, path){
      if (path == "/user/" || path == "/u/") {
        path = path + Parse.User.current().getUsername()
      }
      
      try {
        router.push(path)
      } catch (error) {
      }
    },

    fetchUserData(store){
      let userProps = JSON.parse(JSON.stringify(Parse.User.current()))
      store.commit('pushUserData',  userProps)
    },

    adClick(store, data){
      let currentPathName = router.currentRoute.value.name
      window.plausible("adClick", {props: {
        path: currentPathName,
        position: data.position,
        type: data.type
      }})
    },

    async fetchAppCategories(store) {
      if (store.state.cache.categories) {
        store.commit('setDataToArr', {arr: 'appCategories', data: store.state.cache.categories})
        return
      }

      let Categories = Parse.Object.extend("Categories");
      let categories = new Parse.Query(Categories)

      try {
        const results = await categories.find()
        const categoriesData = results.map(item => ({
          id: item.id,
          name: item.get("CategoryName"),
          categoryObj: item,
        }))
        
        store.commit('setDataToArr', {arr: 'appCategories', data: categoriesData})
        store.commit('setDataToArr', {arr: 'cache', key: 'categories', data: categoriesData})
      } catch (error) {
        console.log("error: ", error);
        store.dispatch('handleParseError', error);
      }
    },

    async fetchIconType(store) {
      if (store.state.cache.iconTypes) {
        store.commit('setDataToArr', {arr: 'iconType', data: store.state.cache.iconTypes})
        return
      }

      let IconType = Parse.Object.extend("IconType");
      let iconType = new Parse.Query(IconType)
      
      try {
        const results = await iconType.find()
        const iconTypesData = results.map(item => ({
          id: item.id,
          name: item.get("type"),
          parseObj: item
        }))
        
        store.commit('setDataToArr', {arr: 'iconType', data: iconTypesData})
        store.commit('setDataToArr', {arr: 'cache', key: 'iconTypes', data: iconTypesData})
      } catch (error) {
        store.dispatch('handleParseError', error);
      }
    },
    
    handleParseError(store, err) {
      console.log("Parse error: ", err);
      switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
          console.log("Parse error: ", err.code);
          store.dispatch('logOut');
          break;
      }
    },

    async deleteUserAccount(store, password) {      
      if (!password) {
        return;
      }

      console.log('deleting account password: ', password)
      
      try {        
        // Call the secure Cloud Function
        let result = await Parse.Cloud.run("deleteUserAccount", {
          password: password,
          // confirmationCode: confirmationCode // if using confirmation codes
        });

        console.log('result: ', result)
        return
        
        // Close dialogs
        document.getElementById('deleteAccountDialog').hide();
        document.getElementById('accountDialog').hide();
        
        // Show success message
        this.showToast({
          id: "toastMessage",
          message: "Your account has been successfully deleted.",
          variant: "success"
        });
        
        // Log out the user
        this.logOut();
        
      } catch (error) {
        console.error('Error deleting account:', error);
        this.handleParseError(error);
        
        this.showToast({
          id: "toastMessage",
          message: error.message || "Failed to delete account. Please try again or contact support.",
          variant: "error"
        });
      }
    }

  }, 
   
  
  
  getters: {
    
    getSelectedIcon(store){
      return store.selectedIcon;
    },

    getSelectedCategory(store){
      return store.selectedCategory
    },

    getIsLiquidGlassActive(store){
      return store.isLiquidGlassActive
    },

    // Return icons based on criteria, like what category has been selected etc...
    selectedIcons(store){
      let selectedCategory = store.selectedCategory.name;
      let categoryId = store.selectedCategory.name;

      if (selectedCategory == 'downloads' && !store.searchString) {
        return store.dataToShow
      }

      if (selectedCategory == 'Saved' && !store.searchString) {
        return store.dataToShow
      }

      // Return icons data if the user has NOT searched for something and has clicked to view a category.
      if (selectedCategory == "All" && !store.searchString) {
        // return store.list
        return store.searchData
      } else if (selectedCategory != "All" && !store.searchString) {
        try {
          return store.dataToShow.filter(icon => icon.category.id == categoryId);
        } catch (error) {
          return store.dataToShow; 
        }
      }

      // Return icons data if the user has searched for something
      if (selectedCategory == "All" && store.searchString !="") {
        return store.searchData
      } else if (selectedCategory != "All" && store.searchString !="") {
        try {
          return store.searchData;
        } catch (error) {
          console.log("error: ", e)
          return store.searchData; 
        }
      }

    },

    getBlogPost(store, blogData){
      return store.blogPosts
    },

    notApproved(store){
      // return store.userIcons.filter(icon => !icon.approved)
      return store.userIcons.notApproved
    },

    approvedIcons(store){
      let approved =  [...store.userIcons.approved].sort((a, b) => (a.createdAt - b.createdAt) ? 1 : -1 );
      // return  approved
      return  approved
    },

    approvedIconsCount(store){
      return store.userIcons.count
    },

    allIcons(store){
      let allIcons = [].concat(store.userIcons.approved, store.userIcons.notApproved)
      return allIcons;
    },

    getAppCategories(state){
      let ordered = state.appCategories.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return ordered
    },

    getIconType(state){
      let ordered = state.iconType.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
        // return a.name.length - b.name.length;
      });
      return ordered
    },

    getUserInfo(store){
      return store.user
    },

    getUser(store){
      let parseUserObj = Parse.User.current()
      let userData = JSON.parse(JSON.stringify(store.userData))
      let isAuth = store.isAuth
      
      if (userData != null) {
        isAuth = true
        return { userData, parseUserObj, isAuth}
      } else{
        isAuth = false
        return { userData, parseUserObj, isAuth}
      }

    },

    isLoading(store){
      return store.loading
    },

    getSavedIcons(store){
      return store.savedIcons
    },

    getSavedIconsId(store){
      let savedIconsId = store.savedIcons.map(({id}) => id )
      return savedIconsId
    },

    getUserAttributes(store){
      return store.userAttributes
    },

    getLearningResources(store){
      return store.learningResources
    },

    getLearningHome(store){
      return store.learningHome
    },

    getSingleTutorial(store){
      return store.singleLearningResource
    },

    getArticleTemplate(store){
      return store.articleTemplate
    },
    
    getResourcesData(store){
      return store.resourcesData
    },
    
    getSingleResourceData(store){
      return store.singleResourceData
    },

    getResourcesHomeTemplate(store){
      return store.resourcesTemplate
    },

    getSupportMessage(store){
      return marked(store.supportMessage)
    },
    
    getHomeDialog(store){
      return store.homeDialog
    },

    noMoreResults(store){
      return store.noMoreResults
    },

    getIconListLen(store){
      return store.iconListLen
    },

    getDownloads(store){
      return store.downloads
    },

    getSimilarIcons(store){
      return store.similarIcons;
    },

    getIsSimilarLoading(store){
      return store.isSimilarLoading;
    },

  }

})
