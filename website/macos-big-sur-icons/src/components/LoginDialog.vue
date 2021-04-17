<template>
  <coral-dialog id="loginDialog">

    <coral-dialog-header>
      Join macOSicons.com
    </coral-dialog-header>
    
    <coral-dialog-content>
      
      <div class="signin-dialog-content">
        
        <img style="width: 48px" :src="imgs.macOSiconsLogo" alt="">

        <h3 class="coral-Heading--M m-t-10">
          Create an account
        </h3>
        <p class="coral-Body--M" style="font-weight: lighter">
          With an account you’ll be able to manage all your submissions and see their approval status.
        </p>
      </div>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</coral-progress>
        </div>
      </div>

      <div @click="appleLogin" class="apple-signin-banner">
        <img :src="coralIcons.apple" alt="">
         <p> Continue with Apple </p>
      </div>

      <!-- CHECKBOX -->
      <!-- <section class="p-t-5">
        <div>
          <coral-checkbox id="isReupload">
            I'm re-uploading an icon that was previously on the site
          </coral-checkbox>
        </div>
      </section> -->

  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import Parse from 'parse'
import jwt_decode from 'jwt-decode';

Parse.initialize("macOSicons");
Parse.serverURL = 'https://media.macosicons.com/parse'

export default {
    name:"LoginDialog",
    
    props:{
    },
    
    data(){
      return{
        coralIcons:{
          addIcon: require("../assets/icons/add.svg"),
          delete: require("../assets/icons/delete.svg"),
          newItem: require("../assets/icons/newItem.svg"),
          apple: require("../assets/icons/Apple.svg"),
        },
        imgs:{
          macOSiconsLogo: require("../assets/Resources/logo_lowres.png")
        },
        email: "",
        yourName: "",
        isLoading: false
      }
    },
    
    methods:{
      ...mapActions(['showToast', 'errorToast', 'setUser']),
      
      async appleLogin(){
        let parent = this;

        const response = await window.AppleID.auth.signIn();
        console.log("response: ", response);
        const userToLogin = new Parse.User();

        const decodedIdToken = jwt_decode(response.authorization.id_token);
        console.log("decodedIdToken: ", decodedIdToken);
        
        let appleEmail = decodedIdToken.email
        let appleId = decodedIdToken.sub
        let token = response.authorization.id_token

        let authData = {
          id:  appleId,
          email:  appleEmail,
          token: token
        }

        await userToLogin.linkWith('apple', {
            authData: authData
          })
          .then(async (loggedInUser) =>{
            parent.setUser(JSON.parse(JSON.stringify(loggedInUser)))
          }).catch((error) => {
            console.log(error);
        })
      
    },

    setYourName(e){
      console.log(e.target.value);
      this.yourName = e.target.value
    },
  },

  mounted: function(){

    // TODO: Remove Key


    AppleID.auth.init({
      clientId : process.env.VUE_APP_APPLE_CLIENTID,
      scope : 'email',
      redirectURI : process.env.VUE_APP_APPLE_REDIRECT,
      state : process.env.VUE_APP_APPLE_STATE,
      usePopup : true //or false defaults to false
    });
    

    
  }
}
</script>

<style>
</style>