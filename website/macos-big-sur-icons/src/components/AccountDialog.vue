<template>
  <coral-dialog id="accountDialog" v-if="getUser.isAuth" focusOnShow="off">
    

    <coral-dialog-header>
      Your Account
    </coral-dialog-header>
    
    <coral-dialog-content>
      
      <div v-if="isLoading.requestUserData" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate> Fetching your data</coral-progress>
        </div>
      </div>

      <coral-alert style="max-width: 360px; min-width: 260px !important;">
        <coral-alert-header>Info</coral-alert-header>
        <coral-alert-content>
          Your email can't be changed at the moment. A future update will fix this.
        </coral-alert-content>
      </coral-alert>
      
      <form class="coral-FormGroup m-0 p-l-5" style="width: calc(100% - 5px)">
       
        <div class="coral-FormGroup-item">
          <p v-if="propExists('authData')" class="coral-Body--XS"></p>
          <label id="username-label" class="coral-FieldLabel">Your username</label>
          <input
            id="username-settings"
            is="coral-textfield"
            labelledby="email-label"
            class="coral-Form-field"
            type="text"
            v-on:change="validate($event, 'username')"
            :value="getUser.userData.username"
          >
        </div>
        
        <div class="coral-FormGroup-item">
          <p class="coral-Body--XS"></p>
          <label id="user-bio-label" class="coral-FieldLabel">Bio</label>
          <textarea
            is="coral-textarea"
            aria-label="text input"
            id="user-bio-settings"
            labelledby="user-bio-label"
            style="height:75px"
            v-on:keyup="validate($event, 'bio')"
            :value="getUser.userData.bio"
          >{{getUser.userData.bio}}</textarea>
          
          <!-- Character Count -->
          <p class="coral-Detail coral-Detail--S opacity-80 m-b-0">
            <coral-charactercount
              target="#user-bio-settings"
              maxlength="160"
              class="p-r-0 coral-Detail--S opacity-80 m-b-0"
            ></coral-charactercount>
            / 160
          </p>
        </div>

        <div class="coral-FormGroup-item">
          <p v-if="propExists('authData')" class="coral-Body--XS"></p>
          <label id="email-label" class="coral-FieldLabel">Your email</label>
          <input
            id="user-email-settings"
            is="coral-textfield"
            labelledby="email-label"
            class="coral-Form-field"
            type="email"
            :value="getUser.userData.email"
            readonly
          >
        </div>

        <div class="coral-FormGroup-item">
          <p class="coral-Body--XS"></p>
          <label id="user-credit-label" class="coral-FieldLabel">This is how you'll be credited</label>
          <input
            id="user-credit-settings"
            is="coral-textfield"
            labelledby="user-credit-label"
            class="coral-Form-field"
            type="url"
            v-on:change="validate($event, 'credit')"
            :value="getUser.userData.credit"
          >
        </div>

        <div class="coral-FormGroup-item">
          <p class="coral-Body--XS"></p>
          <label id="user-twitter-label" class="coral-FieldLabel">Twitter Handle</label>
          
          <div class="twitter-handle-wrapper">
            <span>@</span>
            <input
              id="user-twitter-settings"
              is="coral-textfield"
              labelledby="user-twitter-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'twitterHandle')"
              :value="getUser.userData.twitterHandle"
            >
          </div>

        </div>

        <span class="p-t-10"></span>

        <div class="coral-FormGroup-item p-t-20">
          <coral-switch
            v-on:change="validate($event, 'isSubscribed')"
            :checked="getUserData('isSubscribed')"
          >
            Subscribe to newsletter
          </coral-switch>
        </div>

      </form>

        <p class="coral-Body--XS p-l-5 p-t-5 p-r-5 m-0 opacity-60">
            <!-- :href="'mailto:elias.ruiz.monserrat@gmail.com?subject=Request macOSicons data: '+getUserData('objectId')" -->
          <a
            @click="requestUserData"
            rel="noopener"
            class="coral-Link">
              Request
            </a> 
            all the data macOSicons has about me.
        </p>

        <p class="coral-Body--XS p-l-5 p-t-5 p-r-5 m-0 opacity-60">
          <a
            rel="noopener"
            :href="'mailto:elias.ruiz.monserrat@gmail.com?subject=Right to be forgotten: '+getUserData('objectId')"
            target="_blank"
            class="coral-Link">
              Exercise
            </a> 
            right to be forgotten and delete account.
        </p>

      <div v-if="isLoading.updatingUser" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>Saving changes...</coral-progress>
        </div>
      </div>

  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
      <button is="coral-button" v-if="!hasChanged || !isValidated" disabled="" coral-close="">Save</button>
      <button is="coral-button" v-if="hasChanged && isValidated" coral-close="" @click="updateUserProp" >Save</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Parse from 'parse'

export default {
    name:"AccountDialog",
    
    props:{
    },
    
    data(){
      return{
        imgs:{
          macOSiconsLogo: require("../assets/Resources/logo_lowres.png")
        },
        email: "",
        yourName: "",
        isLoading: {
          requestUserData: false,
          updatingUser: false
        },
        
        isValidated: false,
        hasChanged: false,
        toUpdate:{}
      }
    },
    
    methods:{
      ...mapActions(['showToast', 'setUser']),
  
      async requestUserData(){
        let parent = this;
        let user = Parse.User.current();
        await user.fetch()
        parent.isLoading.requestUserData = true;

        function downloadFile(fileUrl, fileName) {
          var a = document.createElement("a");
          a.href = fileUrl;
          a.setAttribute("download", fileName);
          a.setAttribute("id", "fileName");
          a.click();
          a.remove();
        }
        
        let fileURL

        if (user.get("userInfoFile")) {
          fileURL = user.get("userInfoFile").url();
          
          downloadFile(fileURL, user.get('username')+"_"+user.id+".json");
          parent.isLoading.requestUserData = false
          parent.showToast({
            id: "toastMessage",
            message: "Data downloaded successfully.",
            variant: "success"
          })
        } else {
          fileURL = await Parse.Cloud.run("requestUserData", {id: user.id})
          
          downloadFile(fileURL, user.get('username')+"_"+user.id+".json");
          parent.isLoading.requestUserData = false
          parent.showToast({
            id: "toastMessage",
            message: "Data downloaded successfully.",
            variant: "success"
          })
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

      getSwitchValue(e){
        let parent = this
        let switchValue = e.target.checked
        parent.hasChanged = true
        parent.toUpdate.isSubscribed = switchValue
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
        parent.isLoading.updatingUser = true;

        for(let key in toUpdate){
          ParseUser.set(key, toUpdate[key])
        }

        ParseUser.save().then((data) =>{
          parent.isLoading.updatingUser = false;
          parent.showToast({
            id: "toastMessage",
            message: "Updated settings successfully.",
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
        return userProps[prop]
      }

    },

  mounted: async function(){
    let parent = this; 
    // document.getElementById("accountDialog").show()
    const store = parent.$store; 

    let isAuth = store.getters.getUser.isAuth
    if (!isAuth) {
      console.log("Not logged in");
    } else{
    }
    // curerntUser.set("username", "Elias")
    // curerntUser.save().then((data)=>{
    // }).catch(e=>{
    //   console.log(e);
    // })
  },

  computed:{
    ...mapGetters(['getUser']),
  }
}
</script>

<style>
</style>