<template>
  <div>
        <div @click="appleLogin" style="height: 40px; width: 100px; background: black;" ></div>

    <!-- <vue-apple-signin></vue-apple-signin> -->
    <!-- <vue-apple-signin
      style="cursor: pointer"
      color="black"
      :border="true"
      type="sign in"
    ></vue-apple-signin> -->

  </div>
</template>

<script>
import Parse from 'parse'
import jwt_decode from 'jwt-decode';

export default {
  name: 'About',
  
  components: {
  },

  data(){
    return {
    }
  },
  
  methods: {
    async appleLogin(){
      let parent = this;
      const response = await window.AppleID.auth.signIn();
      // console.log("response: ", response);
      const userToLogin = new Parse.User();

      const decodedIdToken = jwt_decode(response.authorization.id_token);
      console.log(decodedIdToken);
      
      let appleEmail = decodedIdToken.email
      let appleId = decodedIdToken.sub
      let token = response.authorization.id_token

      userToLogin.set('username', appleEmail);
      userToLogin.set('email', appleEmail)

      let authData = {
        id:  appleId,
        token: token
      }

      console.log(authData);

      await userToLogin.linkWith('apple', {
        authData: authData
        })
        .then(async (loggedInUser) =>{
        console.log(loggedInUser);
      }).catch((error) => {
        console.log(error);
      })
      
    }
  },

  mounted: async function(){
    let parent = this

    // let currentUser = await Parse.User.currentAsync();
    //  async function logIn(){
      // await user.linkWith('apple', {authData:parent.appleAuth}).then
    //    }
    //  logIn()

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
