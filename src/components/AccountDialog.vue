<template>
  <div>
    <coral-dialog id="accountDialog" v-if="getUser.isAuth" focusOnShow="off">

    <coral-dialog-header>
      Settings
    </coral-dialog-header>
    
    <coral-dialog-content>
      
      <coral-dialog id="resetPasswordDialog" >
          <coral-dialog-header>Reset your password</coral-dialog-header>
          
          <coral-dialog-content style="max-width:412px">  
              You will receive an email to reset your password. 
              <br>
              <br>
              Make sure to check your spam folder if you don't receive it within the next few minutes.
              {{ isReset }}

              <coral-dialog-footer class="_coral-Dialog-footer m-0">
                <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
                <button is="coral-button" @click="resetPassword" variant="default" coral-close="">Reset password</button>
            </coral-dialog-footer>
          </coral-dialog-content>

          <!-- <coral-dialog-footer v-if="isReset">
              <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
              <button is="coral-button" @click="resetPassword" variant="default" coral-close="">Reset password</button>
          </coral-dialog-footer> -->
      </coral-dialog>

      <div v-if="isLoading.requestUserData" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate> Fetching your data</coral-progress>
        </div>
      </div>
      
      <form class="coral-FormGroup account-dialog-form m-0 p-l-4">
        
        <div>
          <h3 class="coral-Heading--S coral-Heading--light">
            Your Profile
          </h3>

          <div class="profile-img-edit-wrapper p-t-8 p-b-8">
            <img class="profile-img" :src="getUserProfilePic()" alt="">
            
            <coral-fileupload @change="uploadProfilePhoto" class="m-auto" accept="image/*">
              <button is="coral-button" variant="action" coral-fileupload-select="" @click="$event.preventDefault()">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
                  <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="fill" d="M14.643,4.7355a4.3935,4.3935,0,0,0-8.5095-1.521,3.861,3.861,0,0,0-3.8445,3.7A2.612,2.612,0,0,0,.5165,9.6865,2.673,2.673,0,0,0,3.205,12H5.75A.25.25,0,0,0,6,11.75v-.5A.25.25,0,0,0,5.75,11H3.2A1.668,1.668,0,0,1,1.5045,9.4795,1.607,1.607,0,0,1,3.02214,7.78786q.0434-.00235.08686-.00236h.1795v-.714a2.85951,2.85951,0,0,1,3.6-2.7595,3.3935,3.3935,0,1,1,6.634,1.35,2.6785,2.6785,0,1,1,.3,5.34H12.25a.25.25,0,0,0-.25.25v.5a.25.25,0,0,0,.25.25H13.7A3.7585,3.7585,0,0,0,17.4735,8.76,3.684,3.684,0,0,0,14.643,4.7355Z" />
                  <path class="fill" d="M6.75,9H8v7.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V9h1.25a.25.25,0,0,0,.25-.25.24453.24453,0,0,0-.0585-.1585L9.182,6.08a.25.25,0,0,0-.3534-.01061L8.818,6.08,6.5585,8.59A.24453.24453,0,0,0,6.5,8.75.25.25,0,0,0,6.75,9Z" />
                </svg>
              </button>
            </coral-fileupload>
          </div>

          
          <!-- Username -->
          <div class="coral-FormGroup-item">
            <p v-if="propExists('authData')" class="coral-Body--XS"></p>
            <label id="username-label" class="coral-FieldLabel">Your username</label>
            <input
              id="username-settings"
              is="coral-textfield"
              labelledby="username-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'username')"
              v-on:keyup="validate($event, 'username')"
              :value="getUser.userData.username"
            >
              <!-- :placeholder="getUser.userData.username" -->
          </div>

          <!-- nameToShow -->
          <div class="coral-FormGroup-item">
            <p v-if="propExists('authData')" class="coral-Body--XS"></p>
            <label id="nameToShow-label" class="coral-FieldLabel">Your name</label>
            <input
              id="nameToShow-settings"
              is="coral-textfield"
              labelledby="nameToShow-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'nameToShow')"
              v-on:keyup="validate($event, 'nameToShow')"
              :value="getUser.userData.nameToShow"
            >
          </div>
          
          <!-- User bio -->
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
              v-on:change="validate($event, 'bio')"
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

          <!-- Twitter -->
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
                v-on:keyup="validate($event, 'twitterHandle')"
                :value="getUser.userData.twitterHandle"
              >
            </div>

          </div>
        </div>

        
        <div>
          <h3 class="coral-Heading--S coral-Heading--light">Account settings</h3>

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
            <label id="password-label" class="coral-FieldLabel">
              Password
            </label>
            <input
              id="user-password-settings"
              is="coral-textfield"
              labelledby="email-label"
              class="coral-Form-field"
              type="password"
              value="*******"
              readonly
            >
            <p class="coral-Body--XS opacity-60 f-w-400 p-t-8">
              Problems signing in? <a @click="resetPassword" class="coral-link pointer">Reset password</a> 
            </p>
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
              v-on:keyup="validate($event, 'credit')"
              :value="getUser.userData.credit"
            >
          </div>

          <span class="p-t-8"></span>

          <div class="coral-FormGroup-item">
            <coral-switch
              v-on:change="validate($event, 'usaDateFormat')"
              :checked="getUserData('usaDateFormat')"
            >
              Use USA date format
            </coral-switch>
          </div>

          <div class="coral-FormGroup-item">
            <coral-switch
              v-on:change="validate($event, 'isSubscribed')"
              :checked="getUserData('isSubscribed')"
            >
              Subscribe to newsletter
            </coral-switch>
          </div>

          <p class="coral-Body--XS p-t-8 p-r-4 m-0 opacity-60">
            <a
              @click="requestUserData"
              rel="noopener"
              class="coral-Link">
                Request
              </a> 
              all the data macOSicons has about me.
          </p>

          <div class="coral-FormGroup-item delete-account-section">
            <h4 class="coral-Heading--XS coral-Heading--light">Danger Zone</h4>
            <p class="coral-Body--XS opacity-60 m-b-8">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <!-- <button is="coral-button" variant="action"  @click="$event.preventDefault()"> -->
            <button 
              is="coral-button" 
              variant="warning"
              @click="showDeleteAccountDialog"
            >
              Delete Account
            </button>
          </div>

        </div>

      </form>
        

      <div v-if="isLoading.updatingUser" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>Saving changes...</coral-progress>
        </div>
      </div>

  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
      <button is="coral-button" v-if="!hasChanged || !isValidated" disabled="" coral-close="">Save</button>
      <button is="coral-button" v-if="hasChanged && isValidated" @click="updateUserProp" >Save</button>
    </coral-dialog-footer>

    </coral-dialog>
    
    <!-- Delete Account Dialog -->
    <DeleteAccountDialog />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Parse from 'parse/dist/parse.min.js';

import logoLowRes from "../assets/Resources/logo_lowres.png"
import profilePic from "../assets/Resources/accounts/profilePic.png"
import DeleteAccountDialog from './DeleteAccountDialog.vue'

export default {
    name:"AccountDialog",
    
    components: {
      DeleteAccountDialog
    },
    
    props:{
    },
    
    data(){
      return{
        imgs:{
          macOSiconsLogo: logoLowRes,
        },
        email: "",
        yourName: "",
        isLoading: {
          requestUserData: false,
          updatingUser: false
        },
        
        isValidated: false,
        hasChanged: false,
        toUpdate:{},
        isReset: false,
        // isLoading: false
      }
    },
    
    methods:{
      ...mapActions([
        'showToast',
        'setUser',
        'setData',
        'fetchUserAttributes'
      ]),

      getUserProfilePic() {
        let userPic = Parse.User.current().get("profilePhoto")
        return userPic ? userPic.url() : profilePic
      },

      async uploadProfilePhoto(event){
        try {
          let parent = this;
          console.log("event.target.uploadQueue[0]: ", event.target.uploadQueue[0]);
          let file = event.target.uploadQueue[0].file;
          let parseFile = new Parse.File(file.name, file);
        
          await parseFile.save();
          let user = Parse.User.current();
          user.set('profilePhoto', parseFile);
          await user.save();

          parent.yourName = user.get('profilePhoto').url();
          console.log('Profile photo uploaded successfully.');
        } catch (error) {
          console.error('Error while uploading profile photo: ', error);
        }
      },

      async resetPassword(){
        let parent = this;

        let email = Parse.User.current().get("email");

        if (this.isReset) {
          // parent.isLoading = true;
          this.isReset = false; 

          Parse.User.requestPasswordReset(email).then(()=>{
            parent.showToast({
              id: "toastMessage",
                message: "Check your email",
                variant: "success"
              })
          })  

        } else{
          this.isReset = true;
          document.getElementById("resetPasswordDialog").show()
        }
      },

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
        try {
          let isInvalid = e.target.classList.contains("is-invalid")
          if (isInvalid || e.target.value.length == 0){
            this.isValidated = false
          }else{
            this.isValidated = true
          }

        }catch(error){ }
        this.getTextFieldValue(e, field)
      },

      getTextFieldValue(e, field){
        let parent = this
        let fieldValue
        
        if (field == 'username') {
          fieldValue = e.target.value
          if (fieldValue.length != 0) {
            fieldValue = fieldValue.replaceAll(" ", '_')
            e.target.value = fieldValue.toLowerCase()
          }
        }

        if (e.target.nodeName == "CORAL-SWITCH") {
          fieldValue = e.target.checked
        } else{
          fieldValue = e.target.value
        }
        parent.hasChanged = true
        parent.toUpdate[field] = fieldValue

        if(e.keyCode == 13 && this.isValidated && this.hasChanged){
          this.updateUserProp()
        }
      },

      updateUserProp(){
        let parent = this
        let toUpdate = parent.toUpdate
        let ParseUser = Parse.User.current()
        this.isLoading.updatingUser = true;

        for(let key in toUpdate){
          ParseUser.set(key, toUpdate[key])
          this.setData({state: 'user', key: key, data: toUpdate[key]})
        }

        ParseUser.save().then((data) =>{
          this.fetchUserAttributes()
          this.isLoading.updatingUser = false;
          document.getElementById("accountDialog").hide()
          this.showToast({
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
      },

      showDeleteAccountDialog() {
        const deleteDialog = document.getElementById('deleteAccountDialog');
        if (deleteDialog && typeof deleteDialog.show === 'function') {
          deleteDialog.show();
        }
      }

    },

  mounted: async function(){
    const store = this.$store; 
    let isAuth = store.getters.getUser.isAuth
    // let curerntUser = Parse.User.current();

    if (!isAuth) {
    } else{
    }
  },

  computed:{
    ...mapGetters(['getUser']),
  }
}
</script>

<style>
.delete-account-section {
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;
  margin-top: 24px;
}

.delete-account-section h4 {
  color: #d73a49;
  margin-bottom: 8px;
}
</style>