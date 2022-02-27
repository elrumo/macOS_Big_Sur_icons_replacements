<template>
  <div class="icon-preview">
    
    <div class="icon-submission-img-size p-b-8">
      <img
        class="icon-submission-img"
        :src="icon.img"
        :alt="icon.name+' preview'"
        :id="icon.randId"
      >

      <coral-quickactions placement="center" target="_prev">
        <coral-quickactions-item
          type="button" 
          @click="removeFile($event, icon.randId)" 
          :id="icon.name" 
          :icon="coralIcons.deleteIcon"
        >
          Remove file
        </coral-quickactions-item>
      </coral-quickactions>

      <img
        class="icon-submission-img"
        :src="iconTemplate"
        :alt="icon.name+' preview'"
      >
    </div>

    <coral-tooltip id="tooltip" :target="'#a'+randomNumber" variant="info">
      Use this to check if the icon is the correct size.
      <br>
      <br>
      If it's smaller or bigger than the template, edit the icon and resize it to the correct size.
    </coral-tooltip>

    <button
      @click="checkSize(icon.randId)"
      class="w-full"
      :id="'a'+randomNumber"
      :icon="iconBrew('alertWithCircle')"
      iconposition="right"
      is="coral-button"
    >
      {{ isCheckingSize ? 'Stop' : 'Check size' }}
    </button>
  </div>
</template>

<script>

import deleteIcon from "../assets/icons/delete.svg"
import addCoralIcon from "../assets/icons/add.svg"
import iconTemplate from "../assets/icons/icon_template.png"
import iconBrew from "../api/iconBrew.js"

export default {
    name:"SubmissionDialog",
    props:{
      icon: Object,
      removeFile: Function,
    },

    data(){
      return{
        coralIcons:{
          addIcon: addCoralIcon,
          deleteIcon: deleteIcon,
        },
        randomNumber: Math.floor(Math.random() * 100000).toString(),
        isCheckingSize: false,
        iconTemplate: iconTemplate,
      }
    },

    methods:{

      iconBrew(icon){
        console.log(iconBrew[icon]);
        return iconBrew[icon];
      },

      checkSize(id){
        this.isCheckingSize = !this.isCheckingSize;
        document.getElementById(id).classList.toggle("check-size");
      },
    },

    mounted(){
      // randon number
    },

    computed:{
    }

}
</script>

<style>
</style>