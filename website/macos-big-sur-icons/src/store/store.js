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

    user: {}
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
    }

  },
  
  actions: {
    showToast(store, dialogId){
      document.getElementById(dialogId.id).content.innerHTML = dialogId.message;
      document.getElementById(dialogId.id).variants = dialogId.variant;
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
      console.log(item);
      console.log(store.state.dataToShow);
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
        store.commit('setUser', {})  // this will now be null
      });
    },

    changePath(store, path){
      globalThis.router.push(path)
    }

  },  


  getters: {
    getBlogPost(store, blogData){
      return store.blogPosts
    },

    getUser(store){
      let parseUserObj = Parse.User.current()
      // let parseUserObj = store.user
      console.log(Parse.User.current());
      let user = JSON.parse(JSON.stringify(parseUserObj))
      let isAuth = Object.keys(user).length != 0
      return { user, parseUserObj, isAuth}
    }
  }

})