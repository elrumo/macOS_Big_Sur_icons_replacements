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

    userIcons: [],

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
      // console.log("func: ", iconData.func);
      if (Array.isArray(iconData.data)) {
        store[iconData.arr] = iconData.data
      } else{
        // console.log("data is object: ", iconData.data);
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

    pushUserIcons(store, userIcons){
      store.userIcons = userIcons;
    },

    pushAppCategories(store, data){
      store[data.state].push(data.storeObj);
    }

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

    pushDataToArr(store, iconData){
      store.commit('pushDataToArr', iconData)
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

    async fetchUserIcons(store){
      let query = new Parse.Query("Icons2");
      query.equalTo("user", Parse.User.current())
      query.limit(10)
      let totalQuery = await query.count()
      console.log(totalQuery);
      const results = await query.find()

      let userIcons = []

      results.forEach((result)=>{
        userIcons.push(result)
      })
      
      console.log(userIcons);
      store.commit('pushUserIcons',  userIcons);
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
      return store.userIcons.filter(icon => !icon.get('approved'))
    },

    approvedIcons(store){
      return store.userIcons.filter(icon => icon.get('approved'))
    },

    getUserIcons(store){
      console.log(store.userIcons);
      return store.userIcons
    },

    // const getAppCategories = (store) => (stateToGet) => {
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