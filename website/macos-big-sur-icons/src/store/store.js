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

    // userIcons: [],
    userIcons: {
      approved: [],
      notApproved: [],
      hacked: [],
      toSkip: 10
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
      console.log("func: ", iconData.func)
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

    emptyArr(store){
      // store.state.userIcons = [];
      store.state.userIcons.approved = [];
      store.state.userIcons.notApproved = [];
      store.state.userIcons.hacked = [];
      store.state.userIcons.toSkip = 0;
    },

    pushDataToArr(store, iconData){
      store.commit('pushDataToArr', iconData)
    },

    // Gets most up to date info for each icon
    async fetchIconUserInfo(store, data){
      
      let results = data.results
      var howManyRecords = data.howManyRecords
      console.log("data: ", data);
      
      function setUserInfo(index, user, username){
        index = parseInt(index)+howManyRecords
        store.state.list[index].usersName = user.get(username);
        store.state.list[index].credit = user.get("credit");
      }
      
      for(let result in results){
        let user = results[result].user

        if (user) {
          if (result == 0) {
            await user.fetch()
            setUserInfo(result, user, "username")
          }
          if (result != 0) {
            let previousItem = results[result-1]
            if (user.id != previousItem.get("user").id) {
              await user.fetch()
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
      // console.log(item);
      // console.log(store.state.dataToShow);
      let indexOf = store.state.dataToShow.indexOf(item)
      store.state.dataToShow.splice(indexOf, 1);
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
      try {
        globalThis.router.push(path)
      } catch (error) {
      }
    },

    fetchUserData(store){
      let userProps = JSON.parse(JSON.stringify(Parse.User.current()))
      store.commit('pushUserData',  userProps)
    },

    async fetchUserIcons(store, userObj){
      let IconsBase = Parse.Object.extend("Icons2");
      let iconQuery = new Parse.Query(IconsBase);
      
      iconQuery.equalTo("user", userObj);
      iconQuery.limit(50)
      iconQuery.skip(store.state.userIcons.toSkip)
      store.state.userIcons.toSkip += 50;

      let iconResults = await iconQuery.find();

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
        for(let data in icon){
          dataToPush.iconData[data] = icon[data]
        }
        store.commit('pushUserIcons',  dataToPush);
      }

      iconResults.forEach((result)=>{
        let objData = result.attributes

        // If icon has not been approved yet
        if (objData.highResPngFile && !objData.approved ) {
            returnIconData(result, "notApproved");
        }

        // If icon has been hacked (it doesn't have an icns file and has been approved)
        if (!objData.icnsFile && objData.approved ) {
            returnIconData(result, "hacked");
        }

        // If icon has icns file and been been approved
        if (objData.icnsFile && objData.approved ) {
          returnIconData(result, "approved");
        }

      })

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

    getBlogPost(store, blogData){
      return store.blogPosts
    },

    notApproved(store){
      // return store.userIcons.filter(icon => !icon.approved)
      return store.userIcons.notApproved
    },

    approvedIcons(store){
      return store.userIcons.approved
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

    }
  }

})