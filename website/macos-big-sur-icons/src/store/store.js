import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

import localPosts from '@/api/posts.json';

export default new Vuex.Store({

  state: {
    list:[],
    dataToShow: [],
    blogPosts: {},
    localPosts: localPosts
  },

  mutations: {   
    pushIconData(store, iconData){
      store.list.push(iconData)
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
    }

  },
  
  actions: {
    showToast(store, dialogId){
      document.getElementById(dialogId.id).show();
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
    }

  },  


  getters: {
    getBlogPost(store, blogData){
      return store.blogPosts
    }
  }

})