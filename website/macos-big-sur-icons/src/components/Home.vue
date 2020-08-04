<template>
  <div>
    
    <!-- Header -->
    <div id="header" class="header">
      <p class="header-item-left coral-Body--S p-t-5">
        Made by <a href="https://eliasruiz.com" target="_blank" class="coral-Link">Elias</a>
      </p>
      
      <p class="header-item-right coral-Body--XL"> 
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" class="coral-Link"> 
          GitHub 
        </a>
      </p>

    </div>
    
    <!-- Hero -->
    <div id="hero" class="hero-wrapper">
      <h3 class="main-heading coral-Heading--XL coral-Heading--regular">
        <span class="f-w-100 f-s-24">macOS Big Sur</span>
        <br>
        Replacements Icons
      </h3>

      <div class="p-t-35 m-auto">
        <button is="coral-button" variant="quite" style="min-width:168px">
          <p> GitHub </p>
        </button>

        <a class="p-l-10" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip">
          <button is="coral-button" variant="primary" style="min-width:168px">
            <p> Download all </p>
          </button>
        </a>
      </div>

    </div>

    <!-- Icon Secion -->
    <section class="content-wrapper">
      <!-- Search bar -->
      <div class="main-search-wrapper">
        <div class="search-bg"></div>
        <div class="m-auto main-search" style="max-width:300px;">
          <div class="shadow main-border-radius">
            <input v-model="searchString" type="text"  class="_coral-Search-input _coral-Textfield" name="name" aria-label="text input">
            <svg class="icon" id="spectrum-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>

      </div>
  
      <div class="icon-list-area p-t-50 p-b-50">
        <a v-for="icon in filteredList" :key="icon.name" :href="icon.url" class="card-wrapper shadow">
        <!-- <a v-for="icon in iconList" :key="icon.name" :href="icon.url" class="card-wrapper shadow"> -->
          <div class="card-img-wrapper">
            <img loading="lazy" class="w-full" :src="icon.img" alt="">
          </div>
          <div>
            <h3>
             {{ icon.name }}
            </h3>
          </div>
        </a>
      </div>

    </section>

    <!-- Footer -->
    <section>
      <footer class="p-b-20">
        Made with ❤️ by <a href="https://eliasruiz.com" target="_blank" class="coral-Link">Elias</a> 
      </footer>
    </section>
  </div>
</template>

<script>
// import {Coral} from '@adobe/coral-spectrum'


export default {
  name: 'Home',

  components: {
    // Coral
  },

  data(){
    return{
      iconList:[],
      searchString: "",
      iconsToShow: []
    }
  },

  created: function(){
    this.getIconsArray()
  },

  methods:{
    getIconsArray(){
      var list = []
      let parent = this
      fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icns.txt')
        .then(response => response.text())
        .then((data) => {
          list = data.split(", ")

          for(let icon in list){
            let id = list[icon]
            let iconName = id.replace("_", " ")
            let itemObj = {
              name: iconName,
              id: id,
              url:
                    "https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/"+id+".icns",
              img: 
                    "https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/"+id+".png"
            }
            parent.iconList.push(itemObj)
            // console.log(itemObj)
          }
          // csv.forEach(item=>{console.log(item)})
          })
    }
  },

  computed:{
    filteredList: function () {

      var iconList = this.iconList;
      var searchString = this.searchString;

      if(!searchString){
        return iconList;
      }
      
      searchString = searchString.trim().toLowerCase();

      iconList = iconList.filter(function(item){
        if(item.name.toLowerCase().indexOf(searchString) !== -1){
          return item;
        }
      })

      return iconList;
    }

  },

  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url(app.css);
@import url(snack-helper.min.css);
</style>
