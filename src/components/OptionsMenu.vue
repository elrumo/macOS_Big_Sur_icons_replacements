<template>
  <coral-popover
      class="options-popover"
      id="profileNavPopover"
      placement="bottom"
      target="#profilePicNav"
  >
      <div class="_coral-Popover-tip"></div>
      <coral-popover-content>
          <div class="options-list" @click="closeMenu('profileNavPopover')">

              <ul @click="item.onClick.method(item.onClick.data)" v-for="item in optionsList" :key="item.name" class="options-item">
                  <IconUI :img="item.img" :alt="item.name"/>
                  <p>{{ item.name }}</p>
              </ul>

          </div>
      </coral-popover-content>
  </coral-popover>
</template>

<script>
import IconUI from "./IconUI.vue";

export default {
    name:"OptionsMenu",

    directives:{},

    components:{
      IconUI
    },
    
    data(){
        return{
        }
    },

    props:{
      optionsList: {},
    },

    methods:{
        closeMenu(id){
            document.getElementById(id).open = false
        }
    },

    computed:{}
}
</script>

<style>

</style>