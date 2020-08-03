<template>
  <div>
    
    <!-- Header -->
    <div id="header" class="header">
      <p class="header-item-left coral-Body--XS">Made by <a href="https://eliasruiz.com" target="_blank" class="coral-Link">Elias</a></p>
      <p class="header-item-right coral-Body--XL"> 
        <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements" target="_blank" class="coral-Link"> 
          GitHub 
        </a>
      </p>
    </div>
    
    <!-- Hero -->
    <div id="hero" class="p-b-50 m-b-20">
      <h3 class="main-heading coral-Heading--XL coral-Heading--regular p-t-50">
        <span class="f-w-100 f-s-24">macOS Big Sur</span>
        <br>
        Replacements Icons
      </h3>

      <div class="p-t-35">
        <button is="coral-button" variant="quite" style="min-width:168px">
          <p> GitHub </p>
        </button>

        <button is="coral-button" variant="primary" @click="getIconsArray" style="min-width:168px">
          <p> Download all </p>
        </button>
      </div>

    </div>
    
    <!-- Icon Secion -->
    <section class="content-wrapper">
    
      <form class="coral-Form coral-Form--vertical m-auto main-search" style="max-width:300px;">
        <coral-search class="w-full shadow" placeholder="Placeholder"></coral-search>
      </form>

      <div class="icon-list-area p-t-50 p-b-50">
      
        <a v-for="icon in iconList" :key="icon.name" :href="icon.url" class="card-wrapper shadow">
          <div class="card-img-wrapper">
            <img class="w-full" :src="icon.img" alt="">
          </div>
          <div>
            <h3>
             {{ icon.name }}
            </h3>
          </div>
        </a>
        
      </div>

    </section>

    <section>
      <footer class="p-b-20">
        Made with ❤️ by <a href="https://eliasruiz.com" target="_blank" class="coral-Link">Elias</a> 
      </footer>
    </section>
  </div>
</template>

<script>

export default {
  name: 'Home',

  components: {
  },

  data(){
    return{

      iconList:[]
      
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
            let iconName = list[icon]
            let itemObj = {
              name: iconName,
              url:
                    "https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/"+iconName+".icns",
              img: 
                    "https://github.com/elrumo/macOS-Big-Sur-icons-replacements/blob/master/icons/png/"+iconName+".png?raw=true)"
            }
            parent.iconList.push(itemObj)
            // console.log(itemObj)
          }
          // csv.forEach(item=>{console.log(item)})
          })
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
