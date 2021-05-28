import Vue from 'vue'
import Vuex from 'vuex'
import Parse from 'parse'

Vue.use(Vuex)

import localPages from '@/api/pages.json';
import localPosts from '@/api/posts.json';
import icons from '@/api/icons.json';
import { getPages, getSinglePage } from '@/api/posts';


export default new Vuex.Store({

  state: {
    list: icons,
    dataToShow: [],
    
    blogPosts: {},
    localPosts: localPosts,

    resourcesData: getPages(10),
    singleResourceData: {},
    moreResources: getPages(10),

    user: {},
    userData: Parse.User.current(),

    loading: true,

    selectedIcon:{},
    
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

    appCategories: [],
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
      // console.log("iconData:", store[iconData.arr]);
      if (Array.isArray(iconData.data)) {
        store[iconData.arr] = iconData.data        
      } else{
        store[iconData.arr].push(iconData.data)
      }
    },
    
    setDataToArr(store, iconData){
      store[iconData.arr] = iconData.data
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
    showToast(store, dialogId){
      document.getElementById(dialogId.id).content.innerHTML = dialogId.message;
      document.getElementById(dialogId.id).variant = dialogId.variant;
      document.getElementById(dialogId.id).show();
    },
    
    getPageData(store){
      console.log(store.resourcesData);
      return "Hi"
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
      document.getElementById(id).show()
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

    adClick(store){
      let parent = this
      window.plausible("adClick", {props: {
        path: globalThis.router.currentRoute.name, 
      }})
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
        if (!icon.lowResPngFile) {
          dataToPush.iconData.lowResPngUrl = icon.highResPngUrl
        }

        // Set category if empty
        if (!icon.category) {
          dataToPush.iconData.category = {id: ""}
        }
        
        if (!result.get('type')) {
          console.log("icon.type: ", result.get('appName'));
        }

        // // Set type if empty
        // if (!icon.category) {
        //   dataToPush.iconData.category = {id: ""}
        // }

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

    async fetchAppCategories(store) {
      let Categories = Parse.Object.extend("Categories");
      let categories = new Parse.Query(Categories)

      categories.find().then((results)=>{
        for(let result in results){
          let item = results[result];
          
          let categoryObj = {
            id: item.id,
            name: item.get("CategoryName"),
            categoryObj: item
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
    }
  }

})