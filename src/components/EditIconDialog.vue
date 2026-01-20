<template>
    <!-- :id="'editIconDialog_'+iconId" -->
  <coral-dialog
    id="editIconDialog"
    v-if="getUser.isAuth"
    focusOnShow="off"
  > 

    <coral-dialog-header>
      {{icon.appName}}
    </coral-dialog-header>

    <coral-dialog-content>
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate> Updating {{ icon.appName }} </coral-progress>
        </div>
      </div>

       <div class="card-img-wrapper fit-width">
          <img v-if="!imageData" style="max-width: 140px;" :alt="icon.appName +' icon'" :src="iconUrl(icon)">
          <img v-else style="max-width: 140px;" :alt="icon.appName +' icon'" :src="fileToShow.img">
      </div>
      
      <div class="edit-dialog-acton-btns">
        <!-- <button is="coral-button" variant="quiet" icon="edit">Upload new</button> -->
        <button
          @click="showEl('deleteDialog')"
          is="coral-button"
          variant="quiet"
          :icon="iconBrew('trashWithLines24')"
        >
          Delete
        </button>

        <coral-fileupload
          @change="selectIcon"
          name="file"
          accept="image/png"
        >
          <button
            is="coral-button"
            variant="quiet"
            coral-fileupload-select=""
            :icon="iconBrew('uploadToCloud24')"
          >
            Replace
          </button>
        </coral-fileupload>

        <button
          is="coral-button"
          variant="quiet"
          :icon="iconBrew('uploadToCloud24')"
          @click="openIcnsFileUpload"
        >
          <span v-if="!icnsFile">Upload .icns</span>
          <span v-else>Remove .icns</span>
        </button>
        <input
          type="file"
          id="icnsFileUpload"
          accept=".icns"
          class="hidden"
          @change="selectIcnsFile"
        >

      </div>

      <form class="coral-FormGroup m-0 p-l-4" style="width: calc(100% - 5px)">
        
        <!-- appName -->
        <div class="coral-FormGroup-item">
          <label :id="'appNameLabel'+icon.id" class="coral-FieldLabel">
            App name
          </label>
          <input
            is="coral-textfield"
            class="coral-Form-field"
            type="text"
            required=""
            :id="'appNameUpdateField'+icon.id"
            :labelledby="'appNameLabel'+icon.id"
            :value="newAppName"
            @input="updateAppName($event)"
          >
        </div>

        <!-- App category -->
        <div class="coral-FormGroup-item">
          <label :id="'categoryUpdateLabel'+icon.id" class="coral-FieldLabel">
            App category
          </label>
          <div class="dropdown-select-chevron">
            <select
              name="categoryUpdateField"
              :id="'categoryUpdateField'+icon.id"
              placeholder="Select category"
              class="dropdown-select"
              v-on:change="getValue($event, 'category')"
            >
              <option
                value=""
                disabled selected
              >
                Select category (required)
              </option>
              <option
                v-for="category in getAppCategories"
                :key="category.name+icon.id"
                :id="category.id+icon.id"
                :value="category.id"
                :selected="isSameCategory('category', category)"
              >

                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Type of icon -->
        <div class="coral-FormGroup-item">
          <label :id="'TypeUploadLabel'+icon.id" class="coral-FieldLabel">
            Type of icon
          </label>
          <div class="dropdown-select-chevron relative">
            <select
              name="TypeUploadField"
              :id="'TypeUploadField'+icon.id"
              placeholder="Select Type"
              class="dropdown-select"
              v-on:change="getValue($event, 'type')"
            >
              <option
                v-for="type in getIconType"
                :key="type.name+icon.id"
                :value="type.id"
                :selected="isSameCategory('type', type)"
              >
                <!-- :selected="selectedOption(type.id, icon.type)" -->
                <!-- :selected="icon.category.includes(category.id)" -->
                {{ type.name }}
              </option>
            </select>
          </div>
        </div>

      </form>

    </coral-dialog-content>
    
    
    <coral-dialog-footer>
      <button is="coral-button" variant="quiet" @click="resetDialog" coral-close="">Cancel</button>
      <button is="coral-button" v-if="!hasChanged" disabled="" coral-close="">Save</button>
      <button is="coral-button" v-if="hasChanged" @click="saveIconData">Save</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Parse from 'parse';

import UploadDialog from './UploadDialog.vue'

import iconBrew from '../api/iconBrew.js'
import logoLowRes from "../assets/Resources/logo_lowres.png"

export default {
  name:"EditIconDialog",
  
  props:{
    icon: {}
  },
  components:{
    UploadDialog
  },
  
  data(){
    return{
      imgs:{
        macOSiconsLogo: logoLowRes
      },
      isLoading: false,

      newAppName: "",
      
      isValidated: false,
      toUpdateTemplate: {
        category: "",
        appName: "",
        type: "",
        icon: false,
      },
      toUpdate: {},
      uploadDialog: false,
      fileToUpload: {},
      fileToShow: {
        img: "",
        name: ""
      },
      imageData: false,
      icnsFile: null
    }
  },
  
  watch:{
    icon:{
      handler() { // Reset all dialog state when 'icon' changes
        this.resetDialog();
      },
      deep: true,
      immediate: true
    }
  },
  
  methods:{
    ...mapActions([
      'showToast',
      'setUser',
      'showEl',
      'handleParseError'
    ]),

    iconBrew(iconName, filled){
      return iconBrew(iconName, filled)
    },
    
    resetDialog(){
      let parent  = this;
      
      parent.imageData = false;
      parent.fileToUpload = {},
      parent.fileToShow = {
        img: "",
        name: ""
      }
      parent.icnsFile = null;
      parent.newAppName = parent.icon ? parent.icon.appName : "";
      parent.toUpdate = Object.assign({}, parent.toUpdateTemplate);
    },

    async saveIconData(){
      let parent = this
      
      parent.isLoading = true
      var Icons = Parse.Object.extend("Icons2");
      let toUpdate = parent.toUpdate
      let iconQuery = new Parse.Query(Icons);
      let icon = await iconQuery.get(parent.icon.id)
      
      for(let key in toUpdate){
        if (toUpdate[key] != "") {
          let newValue =  toUpdate[key]
          
          switch (key) {
            case "appName":
              parent.icon[key] = newValue
              icon.set(key, newValue)
              break;
            case "category":
              let categoryQuery = new Parse.Query(Parse.Object.extend("Categories"))
              let categoryParse = await categoryQuery.get(newValue)
              parent.icon[key] = categoryParse
              icon.set(key, categoryParse)
              break;
            case "type":
              let typeQuery = new Parse.Query(Parse.Object.extend("IconType"))
              let typeParse = await typeQuery.get(newValue)
              
              parent.icon[key] = typeParse
              icon.set(key, typeParse)
              break;
          
            default:
              break;
          }          
        }
        // ParseUser.set(key, toUpdate[key])
      }
      if(parent.imageData){
        icon = await parent.onUplaod(icon);
        parent.icon.highResPngUrl = icon.get('highResPngUrl')
        parent.icon.lowResPngUrl = icon.get('highResPngUrl')
      }

      // Handle .icns file upload separately
      if(parent.icnsFile) {
        let fileName = parent.icon.appName || 'icon';
        // Clean filename
        if (/^[A-Za-z][A-Za-z0-9]*$/.test(fileName)) {
          fileName = fileName
        } else {
          let d = new Date()
          fileName = d.getTime()
          fileName = fileName.toString()
        }
        
        let icnsFileName = fileName + '.icns';
        const parseIcnsFile = new Parse.File(icnsFileName, parent.icnsFile);
        let savedIcnsFile = await parseIcnsFile.save();
        icon.set("icnsFile", parseIcnsFile);
        icon.set("icnsUrl", savedIcnsFile._url);
      }
      
      icon.save().then((data) =>{
        parent.isLoading = false
        console.log("data: ", data);
        document.getElementById("editIconDialog").hide()
        
        // Reset edit dialog
        parent.resetDialog()
        parent.showToast({
          id: "toastMessage",
          message: parent.icon.appName+" updated.",
          variant: "success"
        })
      }).catch((error) => {
        this.handleParseError(error)
        parent.isLoading = false
        console.log(error);
        document.getElementById("editIconDialog").hide()
        parent.showToast({
          id: "toastMessage",
          message: "Something went wrong, please try again.",
          variant: "error"
        })
      })
    },
    iconUrl(icon){
        if (!icon.lowResPngUrl) {
            return icon.highResPngUrl
        } else{
            return icon.lowResPngUrl
        }
    },
    isSameCategory(field, category){
      let parent = this
      let icon = parent.icon[field]
      // let toUpdate = parent.toUpdate[field]      
      // if(toUpdate){
      //   console.log(field);
      // }
      try {
        return icon.id == category.id
      } catch (error) {
        return false
      }
    },
    selectedOption(option, value){
      if (option == value) {
        return true
      } else {
        return false
      }
    },
    updateAppName(e) {
      let parent = this
      let fieldValue = e.target.value
      parent.newAppName = fieldValue
      parent.toUpdate.appName = fieldValue
    },
    getValue(e, field){
      let parent = this
      let target = e.target
      let toUpdate = parent.toUpdate
      let fieldValue = target.value
      toUpdate[field] = fieldValue;
      if (field === 'appName') {
        parent.newAppName = fieldValue;
      }
    },
    setYourName(e){
      console.log(e.target.value);
      this.yourName = e.target.value
    },
    propExists(prop){
      let ParseUser = Parse.User.current()
      if (!ParseUser) {
        return
      } else {
        ParseUser = JSON.parse(JSON.stringify(ParseUser))
        return ParseUser[prop]
      }
    },
    validate(e, field){
      let parent = this
      try {
        let isInvalid = e.target.classList.contains("is-invalid")
        if (isInvalid) { parent.isValidated = false }
        else{ parent.isValidated = true }
      }catch(error){ }
      parent.getTextFieldValue(e, field)
    },
    getTextFieldValue(e, field){
      let parent = this
      let fieldValue
      
      if (e.target.nodeName == "CORAL-SWITCH") {
        fieldValue = e.target.checked
      } else{
        fieldValue = e.target.value
      }
      parent.hasChanged = true
      parent.toUpdate[field] = fieldValue
    },
    updateUserProp(){
      let parent = this
      let toUpdate = parent.toUpdate
      let ParseUser = Parse.User.current()
      for(let key in toUpdate){
        ParseUser.set(key, toUpdate[key])
      }
      ParseUser.save().then((data) =>{
        parent.showToast({
          id: "toastMessage",
          message: "Updated successfully",
          variant: "success"
        })
      }).catch((error) => {
        console.log(error);
      })
    },
    getUserData(prop){
      let parent = this
      let ParseUser = Parse.User.current()
      let userProps = JSON.parse(JSON.stringify(ParseUser))
      // console.log(prop, " :", userProps[prop]);
      return userProps[prop]
    },
    isValid(field){
      let parent = this
      try {
        let icon = parent.toUpdate[field]
        // console.log(field, ": ", icon);
        // Check if name starts or ends with a space, is empty ot less than one character
        if (
          icon != "" &&
          icon[icon.length-1] != " " &&
          icon[0] != " " &&
          icon.length > 1
        ){ return true } else{ return false }        
      } catch (error) {}
    },
    
    selectIcon(event) {
      // Get selected image
      let parent = this
      let files = event.target.uploadQueue
      
      // Go through all the files that have been selected
      let file = files[0].file
    
      let fileName = file.name.replace('.png', '')
      parent.fileToUpload = file
      // Create URL of file to dislay back the image
      const objectURL = window.URL.createObjectURL(file);
      let value = {
        img: objectURL,
        name: fileName
      }
      // parent.$set(parent.fileToShow, fileName, value)
      parent.fileToShow.img = objectURL
      parent.fileToShow.name = fileName
      parent.imageData = true
    },
    openIcnsFileUpload(){
      const uploadInput = document.getElementById('icnsFileUpload')
      if (this.icnsFile) {
        this.icnsFile = null
        uploadInput.value = '';
      } else {
        uploadInput.click();
      }
    },

    selectIcnsFile(event) {
      let file = event.target.files[0]
      if (file) {
        this.icnsFile = file
      }
    },

    async onUplaod(icon){
      let parent = this;
      let file = parent.fileToUpload;
      let fileName = file.name.replace('.png', '');
      let userName = parent.$store.state.user.username;
      if (/^[A-Za-z][A-Za-z0-9]*$/.test(fileName)) {
        fileName = fileName
      } else {
        let d = new Date()
        fileName = d.getTime()
        fileName = fileName.toString()
      }
      
      // If the username doesn't haven any invalid characters, then add to the file name
      if (/^[A-Za-z][A-Za-z0-9]*$/.test(userName)) {
        fileName = fileName + '_' + userName
      }
      const Icons = Parse.Object.extend("Icons2"); 
      const parseFile = new Parse.File(fileName, file); 
      
      let savedFile = await parseFile.save()
      await icon.set("highResPngUrl", savedFile._url);
      await icon.set("isReUpload", true);
      await icon.set("isReview", false);
      await icon.set("approved", false);
      await icon.set("highResPngFile", parseFile);

      // Handle .icns file upload if present
      if(parent.icnsFile) {
        let icnsFileName = fileName + '.icns';
        const parseIcnsFile = new Parse.File(icnsFileName, parent.icnsFile);
        let savedIcnsFile = await parseIcnsFile.save();
        await icon.set("icnsFile", parseIcnsFile);
        await icon.set("icnsUrl", savedIcnsFile._url);
      }

      return icon
      // console.log(parseFile);
    }
  },
  mounted: async function(){
    let parent = this; 
    const store = parent.$store; 
    // Copies the value of the object instead of assigning a reference
    // parent.toUpdate = Object.assign({}, parent.icon);
    parent.toUpdate = Object.assign({}, parent.toUpdateTemplate)
    
    // Initialize newAppName with icon's appName if available
    if (parent.icon && parent.icon.appName) {
      parent.newAppName = parent.icon.appName;
    }

    let isAuth = store.getters.getUser.isAuth
    if (!isAuth) {
      console.log("Not logged in");
    } else{
    }
  },
  computed:{
    ...mapGetters(['getUser', 'getAppCategories', 'getIconType']),

    hasChanged(){
      let parent = this
      let icon = parent.icon
      let toUpdate = parent.toUpdate
      let isValid = parent.isValid
      let imageData = parent.imageData
      let icnsFile = parent.icnsFile
    
      // Check if input is different from original
      try {
        if (
            icon && (
              (toUpdate.appName != icon.appName && isValid("appName")) ||
              (toUpdate.category != icon.category.id && isValid("category")) ||
              (toUpdate.type != icon.type.id && isValid("type")) ||
              (imageData) ||
              (icnsFile)
            )
        ){
          return true
        } else{
          return false
        }
      } catch (error) {
        this.handleParseError(error)
      }
    },
  }
}
</script>

<style>
.hidden {
  display: none;
}
</style>