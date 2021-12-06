import Vue from 'vue'
import Vuex from 'vuex'
import Parse from 'parse'
import algoliasearch from 'algoliasearch'

import localPages from '@/api/pages.json';
import localPosts from '@/api/posts.json';
import icons from '@/api/icons.json';
import { getPages, getSinglePage } from '@/api/posts';

Vue.use(Vuex)

var IconsBase = Parse.Object.extend("Icons2");

let algolia = {
  // TODO: remove credentials
  appid: import.meta.env.VITE_ALGOLIA_APPID,
  apikey: import.meta.env.VITE_ALGOLIA_KEY
}

const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOSicons')

export default new Vuex.Store({

  state: {
    list: icons,
    dataToShow: [],
    
    blogPosts: {},
    localPosts: localPosts,

    resourcesData: getPages(10),
    singleResourceData: {},
    moreResources: getPages(10),

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

    loading: true,

    downloads:[],

    selectedIcon:{},
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
      id: "All",
    },
    totalCategory: 0,
    appCategories: [
      {"id":"qI4GKWNpum","name":"Browser Extensions","categoryObj":{"className":"Categories","_objCount":16,"id":"qI4GKWNpum"}},{"id":"m2v3VuzZEu","name":"Developer Tools","categoryObj":{"className":"Categories","_objCount":3,"id":"m2v3VuzZEu"}},{"id":"0BnPHRjdrQ","name":"Education","categoryObj":{"className":"Categories","_objCount":4,"id":"0BnPHRjdrQ"}},{"id":"gVBckgE4zl","name":"Entertainment","categoryObj":{"className":"Categories","_objCount":5,"id":"gVBckgE4zl"}},{"id":"rq2vNGoV92","name":"Finance","categoryObj":{"className":"Categories","_objCount":2,"id":"rq2vNGoV92"}},{"id":"6DiDa4yD4m","name":"Games","categoryObj":{"className":"Categories","_objCount":6,"id":"6DiDa4yD4m"}},{"id":"sQCYzXFttB","name":"Graphics & Design","categoryObj":{"className":"Categories","_objCount":7,"id":"sQCYzXFttB"}},{"id":"7SbNrtDxDh","name":"Health & Fitness","categoryObj":{"className":"Categories","_objCount":9,"id":"7SbNrtDxDh"}},{"id":"7KYFn5kd15","name":"Lifestyle","categoryObj":{"className":"Categories","_objCount":8,"id":"7KYFn5kd15"}},{"id":"GgZF9kgRR7","name":"Medical","categoryObj":{"className":"Categories","_objCount":10,"id":"GgZF9kgRR7"}},{"id":"BO0gbTCPUK","name":"Music","categoryObj":{"className":"Categories","_objCount":12,"id":"BO0gbTCPUK"}},{"id":"jQbEVy2jCI","name":"News","categoryObj":{"className":"Categories","_objCount":11,"id":"jQbEVy2jCI"}},{"id":"ghYlSc5rf4","name":"Photo & Video","categoryObj":{"className":"Categories","_objCount":13,"id":"ghYlSc5rf4"}},{"id":"joml1zA4lv","name":"Productivity","categoryObj":{"className":"Categories","_objCount":14,"id":"joml1zA4lv"}},{"id":"StBWAxgpbs","name":"Reference","categoryObj":{"className":"Categories","_objCount":15,"id":"StBWAxgpbs"}},{"id":"dtOc7xXCaR","name":"Social Networking","categoryObj":{"className":"Categories","_objCount":17,"id":"dtOc7xXCaR"}},{"id":"thUmE1CYrl","name":"Sports","categoryObj":{"className":"Categories","_objCount":18,"id":"thUmE1CYrl"}},{"id":"Fhs38OomHD","name":"Travel","categoryObj":{"className":"Categories","_objCount":19,"id":"Fhs38OomHD"}},{"id":"EzBFwmxpNd","name":"Utilities","categoryObj":{"className":"Categories","_objCount":21,"id":"EzBFwmxpNd"}},{"id":"SIMwpAEm4Z","name":"Weather","categoryObj":{"className":"Categories","_objCount":20,"id":"SIMwpAEm4Z"}}
    ],
    iconType: []
    // userData: JSON.parse(JSON.stringify(Parse.User.current()))
  },

  mutations: {   
    pushIconData(store, iconData){
      store.list.push(iconData)
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

    getSinglePageMutation(store, pageData){
      store.singleResourceData = pageData;
    },

    setUser(store, user){
      store.user = user;
      store.userData = user;
    },

    pushUserData(store, userData){
      store.userData = userData;
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

    algoliaSearch(store){
      let search = store.state.searchString
      let category = store.state.selectedCategory.id

      if (store.state.selectedCategory.id != "All") {
        index.search(search, {filters: `approved:true AND category:"`+category+`"`, hitsPerPage: 150 }).then(function(responses) {
          store.commit('pushDataToArr', {arr: "searchData", data: responses.hits})
        });

      } else{ 
        index.search(search, {filters: `approved:true`, hitsPerPage: 150 }).then(function(responses) {
          store.commit('pushDataToArr', {arr: "searchData", data: responses.hits})
        });
      }

    },

    setData(store, data){
      // console.log("data.state: ", data);
      // Set data, syntax: Array[objectKey] = data
      if (data.key) {
        store.commit('setDataToArr', {arr: data.state, key: data.key, data: data.data})
      } else{
        store.commit('setDataToArr', {arr: data.state, data: data.data})
      }
    },
    
    async loadMoreIcons(store){
      let totalCategory = store.state.totalCategory
      let toSkip = store.state.dataToShow.length

      if (totalCategory == toSkip) {
        return
      }

      const query = new Parse.Query(IconsBase);
      
      let selectedCategory = store.state.selectedCategory
      let numToLoad = 30

      if (selectedCategory.id == 'downloads') {
        query.descending("downloads");
      } else if(selectedCategory.id == 'Saved'){
        return
      } else {
        query.descending("timeStamp");
        query.equalTo("category", selectedCategory.categoryObj);
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
        window.scrollTo(0, 296)
        // window.scrollTo(0, 365)
        
      } else{
        window.scrollTo(0, 320)
      }
    },

    async setCategory(store, category){
      let newCategory = category.id
      let oldCategory = store.state.selectedCategory.id
      let sameCategory = newCategory == oldCategory;
      let search = store.state.searchString
      
      store.dispatch('scrollTo')

      // set category
      store.commit('setDataToArr', {arr: 'selectedCategory', data: category, concatArray: false})

      if (search.length > 0) {
        store.dispatch('algoliaSearch')
      }

      if (category.id == "Saved" && !sameCategory) {

        // let savedIconCount = await Parse.User.current().relation('favIcons').query().count();
        // store.commit('setDataToArr', {arr: 'totalCategory', data: savedIconCount})
        console.log(store.state.savedIconCount);
        store.commit('setDataToArr', {arr: 'totalCategory', data: store.state.savedIconCount})
        
        let savedIcons = store.state.savedIcons
        store.commit('pushDataToArr', {arr: "dataToShow", data: savedIcons})
      }

      if (category.id != "All" && !sameCategory && category.id != "Saved") {
        store.commit('setDataToArr', {arr: 'dataToShow', data: [], concatArray: false})

        let toSkip = store.state.dataToShow.length // Checks how many icons with that category have already been fetched

        let approvedQuery = new Parse.Query(IconsBase);
        let numToLoad = 25
        
        if (category.id == "downloads") {
          approvedQuery.descending("downloads");
        } else{
          approvedQuery.descending("timeStamp");
          approvedQuery.equalTo("category", category.categoryObj);
        }
        
        approvedQuery.exists("icnsFile");
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

          for(let data in objData){
            iconData[data] = objData[data]
          }
          
          iconData.id = results[result].id
          allIcons.push(iconData)
        }
        
        store.commit('pushDataToArr', {arr: "dataToShow", data: allIcons})
      }

    },

    async fetchUserAttributes(store){
      let ParseUser = Parse.User.current()
      if (ParseUser) {
        let userProps = ParseUser.attributes
        store.commit('setDataToArr', {arr: 'userAttributes', data: userProps})
      }
    },


    async fetchUserIcons(store, userObj){

      let IconsBase = Parse.Object.extend("Icons2");
      let approvedQuery = new Parse.Query(IconsBase);
      let notApprovedQuery = new Parse.Query(IconsBase);
      let numToLoad = 15

      // Approved Count
      /////////////////////////////////////////////
      let approvedIconsCount = new Parse.Query(IconsBase);
      approvedIconsCount.equalTo("user", userObj);
      approvedIconsCount.equalTo("approved", true);
      approvedIconsCount.exists("icnsFile");
      let totalApproved = await approvedIconsCount.count()
      store.state.userIcons.count.approved = totalApproved
      /////////////////////////////////////////////
      
      // Not Approved Count
      /////////////////////////////////////////////
      let notApprovedQueryCount = new Parse.Query(IconsBase);
      notApprovedQueryCount.equalTo("user", userObj);
      notApprovedQueryCount.equalTo("approved", false);
      notApprovedQueryCount.exists("highResPngFile");
      let totalNotApproved = await notApprovedQueryCount.count()
      store.state.userIcons.count.notApproved = totalNotApproved
      /////////////////////////////////////////////

      // Hacked Count
      /////////////////////////////////////////////
      let hackedCount = new Parse.Query(IconsBase);
      hackedCount.equalTo("user", userObj);
      hackedCount.equalTo("approved", true);
      hackedCount.doesNotExist("icnsFile");
      let hacked = await hackedCount.count()
      store.state.userIcons.count.hacked = hacked
      /////////////////////////////////////////////
      
      approvedQuery.limit(numToLoad)
      approvedQuery.equalTo("user", userObj);
      approvedQuery.equalTo("approved", true);
      approvedQuery.exists("icnsFile");
      approvedQuery.skip(store.state.userIcons.toSkip.approved)
      approvedQuery.descending("createdAt");
      store.state.userIcons.toSkip.approved += numToLoad;
      let iconResults = await approvedQuery.find();
      
      iconResults.forEach((result)=>{
        returnIconData(result, "approved");
      })
      
      notApprovedQuery.limit(numToLoad)
      notApprovedQuery.equalTo("user", userObj);
      notApprovedQuery.skip(store.state.userIcons.toSkip.notApproved)
      notApprovedQuery.descending("createdAt");
      notApprovedQuery.equalTo("approved", false);
      store.state.userIcons.toSkip.notApproved += numToLoad;
      let notApproved = await notApprovedQuery.find();

      notApproved.forEach((result)=>{
        returnIconData(result, "notApproved");
      })

      function returnIconData(result, status){
        let icon = result.attributes
        let dataToPush = {
            status: status,
            iconData: {}
        }

        // Set icon ID to icon properties
        dataToPush.iconData.id = result.id
        
        // Pass high res png url if lor res png is not present
        // if (!icon.lowResPngFile) {
        //   dataToPush.iconData.lowResPngUrl = icon.highResPngUrl
        // }

        // Set category if empty
        if (!icon.category) {
          dataToPush.iconData.category = {id: ""}
        }
        
        if (!result.get('type')) {
          console.log("icon.type: ", result.get('appName'));
        }

        for(let data in icon){
          dataToPush.iconData[data] = icon[data]
        }
        store.commit('pushUserIcons',  dataToPush);
      }

      let isLoading = {
        arr: "loading",
        data: false
      }
      store.commit('setDataToArr', isLoading)
      return true
    },

    showToast(store, dialogId){
      document.getElementById(dialogId.id).content.innerHTML = dialogId.message;
      document.getElementById(dialogId.id).variant = dialogId.variant;
      document.getElementById(dialogId.id).show();
    },
    
    async addClickCount(store, icon){
      
      console.log("store.state.downloads: ", store.state.downloads);
      console.log("icon: ", icon);
      if (store.state.downloads.indexOf(icon.id) == -1) {
        store.commit('setDataToArr', {arr: 'downloads', data: icon.id})
        // store.state.downloads.push(icon.id)
        console.log(store.state.downloads.indexOf(icon.id));
        var id
        console.log("icon.appName: ", icon.appName);
        if (icon.id) {
          id = icon.id
        } else{
          id = icon.objectID
        }
        icon = { appName: icon.appName, id: id }
        await Parse.Cloud.run("addClickCount", {icon: icon})
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

    async getSinglePageAction(store, slug){

      return getSinglePage(slug)
    },

    showEl(store, id){
      if(id.elId != undefined){
        document.getElementById(id.elId).target = "#"+id.targetId
        document.getElementById(id.elId).show()
      } else{
        document.getElementById(id).show()
      }
    },

    setUser(store, user){
      let curerntUser = Parse.User.current()
      if (curerntUser) {
        store.commit('setUser', curerntUser)
      }
    },

    logOut(store){
      Parse.User.logOut().then(() => {
        console.log("logged out");
        store.commit('setUser', null)  // this will now be null
      });
    },

    changePath(store, path){
      if (path == "/user/" || path == "/u/") {
        path = path + Parse.User.current().getUsername()
      }
      
      try {
        globalThis.router.push(path)
      } catch (error) {
      }
    },

    fetchUserData(store){
      let userProps = JSON.parse(JSON.stringify(Parse.User.current()))
      store.commit('pushUserData',  userProps)
    },

    adClick(store, data){
      window.plausible("adClick", {props: {
        path: globalThis.router.currentRoute.name,
        position: data.adPosition,
        type: data.adType
      }})
    },

    async fetchAppCategories(store) {
      let Categories = Parse.Object.extend("Categories");
      let categories = new Parse.Query(Categories)

      categories.find().then((results)=>{
        store.state.appCategories = []
        for(let result in results){
          let item = results[result];
          
          let categoryObj = {
            id: item.id,
            name: item.get("CategoryName"),
            categoryObj: item,
          }
          
          store.commit("pushAppCategories", {state: "appCategories", storeObj: categoryObj})
        }
      }).catch((error)=>{
        console.log("error: ", error);
      })
    },

    async fetchIconType(store) {
      let IconType = Parse.Object.extend("IconType");
      let iconType = new Parse.Query(IconType)

      iconType.find().then((results)=>{
        for(let result in results){
          let item = results[result];

          let typeObj = {
            id: item.id,
            name: item.get("type"),
            parseObj: item
          }

          store.commit("pushAppCategories", {state: "iconType", storeObj: typeObj})
        }
      }).catch((error)=>{
        console.log("error: ", error);
      })
    }

  },  
  
  
  getters: {
    
    getSelectedCategory(store){
      return store.selectedCategory
    },

    // Return icons based on criteria, like what category has been selected etc...
    selectedIcons(store){
      let selectedCategory = store.selectedCategory.id;

      if (selectedCategory == 'downloads' && !store.searchString) {
        return store.dataToShow
      }

      if (selectedCategory == 'Saved' && !store.searchString) {
        return store.dataToShow
      }

      // Return icons data if the user has NOT serached for something and has clicked to view a category.
      if (selectedCategory == "All" && !store.searchString) {
        return store.list
      } else if (selectedCategory != "All" && !store.searchString) {
        try {
          return store.dataToShow.filter(icon => icon.category.id == selectedCategory);
        } catch (error) {
          return store.dataToShow; 
        }
      }

      // Return icons data if the user has serached for something
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

    getSelectedIcon(store){
      return store.selectedIcon
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
        // return a.name.length - b.name.length;
      });
      // console.log(ordered);
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
      let isAuth

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

    getUserAttributes(store){
      return store.userAttributes
    }


  }

})