import Vue from 'vue'
import Vuex from 'vuex'


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
    moreResources: getPages(10)
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
    }

  },
  
  actions: {
    showToast(store, dialogId){
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
  
    successMessage(data){
      let id = data.id
      let toast = document.getElementById("successMessage")

      toast.show();
    }


  },  


  getters: {
    getBlogPost(store, blogData){
      return store.blogPosts
    }
  }

})