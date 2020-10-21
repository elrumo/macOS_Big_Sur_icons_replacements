<template>
  <div>
    
    <!-- Header -->
    <div id="header" class="header">
      <p class="header-item-left coral-Body--S p-t-5">
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements#credits" target="_blank" class="coral-Link">Credits</a>
      </p>
      
      <p class="coral-Body--S p-t-5 d-inline-block absolute transform-centre">
        Made by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
      </p>

      <img v-if="darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="moon-light.svg" alt="dark-mode-btn">
      <img v-if="!darkMode" @click="toggleDarkMode" class="header-item-right dark-mode-btn" src="sun-dark.svg" alt="light-mode-btn">

      <p class="header-item-right coral-Body--XL github-header" id="github-header" > 
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" class="coral-Link"> 
          GitHub 
        </a>
      </p>

    </div>
    
    <!-- Hero -->
    <div id="hero" class="hero-wrapper">
      <h3 class="main-heading coral-Heading--XL coral-Heading--regular">
        <span class="f-w-100 f-s-26">macOS Big Sur</span>
        <br>
        Replacement Icons
      </h3>

      <p class="coral-Body--L w-100 body-text p-t-20">
        Click on each icon to download it or on the button bellow to download all {{iconList.length}} icons. To contribute or suggest a new icon, click on the GitHub button.
      </p>
      
      <a class="coral-Link" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank">
        GitHub
      </a>

      <div class="m-auto m-t-30">
        <a class="" href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/releases/download/v1.0/icons.zip">
          <button  is="coral-button" variant="cta">
            <span>Download all</span>
          </button>
        </a>
      </div>

    </div>

    <!-- Icon Secion -->
    <section class="content-wrapper">

      <!-- Search bar -->
      <div class="main-search-wrapper coral-bg p-b-15">
        <div class="m-auto main-search" style="max-width:300px;">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'Search ' + iconList.length + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield" name="name" aria-label="text input">
            <svg class="icon fill-dark" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>

        <!-- <div class="filter-by-grid">
          <div class="filter-by-wrapper coral-card shadow">
              <coral-icon v-if="filterIsDate" class="h-full" icon="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/website/macos-big-sur-icons/src/assets/clock.svg" title="Add"></coral-icon>
              <coral-icon v-if="filterIsName" class="h-full" icon="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/website/macos-big-sur-icons/src/assets/namingOrder.svg" title="Add"></coral-icon>
          </div>
        </div> -->
      </div>
  
      <div class="icon-list-area p-t-50 p-b-50">
          <a v-for="icon in filteredList" :key="icon.name" class="card-wrapper shadow coral-card" :href="icon.url">
            <div class="card-img-wrapper">
              <img loading="lazy" v-lazy="icon.img" class="w-full" alt="">
            </div>
            <div>
              <h3 class="coral-font-color">
              {{ icon.name }}
              </h3>
            </div>
          </a>
      </div>


    </section>

    <!-- Footer -->
    <section>
      <footer class="p-b-20 coral-Body--S">
        Made with ❤️ by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
        <dir class="d-inline-block m-0 p-l-15 p-r-10">
          <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
        </dir>
        Full icon <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements#credits" target="_blank" class="coral-Link">credits</a>
      </footer>
    </section>
  </div>
</template>

<script>

export default {
  name: 'Home',

  components: {
    // Coral
  },

  data(){
    return{
      iconList:[],
      searchString: "",
      iconsToShow: [],
      darkMode: false,
      filterIsDate: false,
      filterIsName: true,
    }
  },

  mounted: function(){
    let parent = this
    this.getIconsArray()

    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      parent.toggleDarkMode()
    }

  },

  methods:{

    toggleDarkMode(){
      let parent = this
      let body = document.getElementById("body")
      let searchIcon = document.getElementById("coral-css-icon-Magnifier")
      
      body.classList.toggle('coral--light')
      body.classList.toggle('coral--dark')
      searchIcon.classList.toggle('fill-light')
      searchIcon.classList.toggle('fill-dark')
      parent.darkMode = !parent.darkMode
    },

    getIconsArray(){
      var list = []
      let parent = this
      fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icns.txt')
        .then(response => response.text())
        .then((data) => {
          list = data.split(",\n")

          for(let icon in list){
            let id = list[icon]
            let iconName = id.replace("_", " ")
            id = id.replace(",", "")
            
            // Validation check, only add icon name if id is not empty
            if(id != ""){
              // Remove all "_" from the names
              for(let i in iconName){
                i
                iconName = iconName.replace("_", " ")
                iconName = iconName.replace(",", "")
              }
              // iconName = iconName.replace("_", " ")
              let itemObj = {
                name: iconName,
                id: id,
                url:
                      "https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/"+id+".icns",
                img: 
                      "https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/"+id+".png"
              }
              parent.iconList.push(itemObj)
            }
          }
          if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            parent.darkMode = true
          }
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
          // console.log(item);
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

<style>
@import url(app.css);
@import url(snack-helper.min.css);
</style>
