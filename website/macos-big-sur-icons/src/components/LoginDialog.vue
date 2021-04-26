<template>
  <coral-dialog v-if="!getUser.isAuth" id="loginDialog">

    <!-- <coral-dialog-header>
      Join macOSicons.com
    </coral-dialog-header> -->
    
    <coral-dialog-content>
      
      <div class="signin-dialog-content">
        
        <img style="width: 48px" :src="imgs.macOSiconsLogo" alt="">

        <h3 class="coral-Heading--M m-t-10">
          Create an account
        </h3>
        <p class="coral-Body--M" style="font-weight: lighter">
          With an account you’ll be able to manage all your submissions and see their approval status.
        </p>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</coral-progress>
        </div>
      </div>

      <div @click="appleLogin" class="apple-signin-banner">
        <img :src="coralIcons.apple" alt="">
         <p> Continue with Apple </p>
      </div>
      
      <p class="coral-Body--XS p-l-5 p-t-5 p-r-5 m-0 opacity-60">
        By continuing, you agree with macOSicons's
        <a
          rel="noopener"
          class="coral-Link"
          href=""
          target="_blank"
        >
          Terms of Use
        </a>
        and
        <a
          rel="noopener"
          class="coral-Link"
          href=""
          target="_blank"
        >
          Privacy Policy.
        </a>
      </p>
      </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
    ...mapActions(['showToast', 'setUser']),
    
    async appleLogin(){
      let parent = this;

      const userToLogin = new Parse.User();
      
      console.log("decodedIdToken: ", decodedIdToken);
      const decodedIdToken = {
        "iss": "https://appleid.apple.com",
        "aud": "com.macOSicons.client",
        "exp": 1618835311,
        "iat": 1618748911,
        "sub": "001514.0685fcddf96a4871a7dcf841d95a7e54.2233",
        "c_hash": "Fzvm6llyF4nHw5eGGQI0TA",
        "email": "elrumo_97@hotmail.com",
        "email_verified": "true",
        "auth_time": 1618748911,
        "nonce_supported": true,
        "token": "eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1hY09TaWNvbnMuY2xpZW50IiwiZXhwIjoxNjE4ODM0NTk2LCJpYXQiOjE2MTg3NDgxOTYsInN1YiI6IjAwMTUxNC4wNjg1ZmNkZGY5NmE0ODcxYTdkY2Y4NDFkOTVhN2U1NC4yMjMzIiwiY19oYXNoIjoidl9PUWVSQ1pUWGNidGIzQWdoeFZTQSIsImVtYWlsIjoiZWxydW1vXzk3QGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjE4NzQ4MTk2LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.xBJfQ8vTedxmb9cQKlnwc5KL8wHADaP10dRJEzg3A5oGpPxJmS_g_NR8pXRKevO1-XqzEa6ORuF6rWDpgJ7w60mme7X-bat4BIjhWduTXmxrOG3l4eQ6fiMmdgOtPuMFgNBkmiXQd1jLOWx3LMVfJbBpWO8Q9cijrHJl019v9SjG6CWIQWxAgxDy0ACYAgKU1lS6TT0WKrKnb4BVuESrpDWPTBta0Ud4-DjjhvIskfz_RsYdDT4GnZHJebFnzxUSkekXUvLbgY4aYfwp4269GXVjZ4dlPHzSPeztI-szSfZlsNILde410JEzFgepXL0Zx2TWPSd4EIuRk5Bi87vYHA"
      }
      let appleEmail = decodedIdToken.email
      let appleId = decodedIdToken.sub
      let token = decodedIdToken.token
      // const response = await window.AppleID.auth.signIn();
      // const decodedIdToken = jwt_decode(response.authorization.id_token);
      // let appleEmail = decodedIdToken.email
      // let appleId = decodedIdToken.sub
      // let token = response.authorization.id_token

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
          userToLogin.set("email", authData.email)
          userToLogin.save()
        }).catch((error) => {
          console.log(error);
      })
    
    },

    setUserFunc(user){
      let parent = this
      parent.setUser(user)
    },

    setYourName(e){
      console.log(e.target.value);
      this.yourName = e.target.value
    },
  },

  computed:{
    ...mapGetters(['getUser']),

  },

  mounted: async function(){
    let parent = this; 
    const store = parent.$store; 
    
    let curerntUser = Parse.User.current()
    
    if (!curerntUser) {
    }else{
      const query = new Parse.Query(Parse.User);

      query.get(curerntUser.id).then((user)=>{
        parent.setUserFunc(user)
      }).catch((error) => {
        console.log("Cached user: ", error);
        parent.setUserFunc(curerntUser)
      })
    }

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