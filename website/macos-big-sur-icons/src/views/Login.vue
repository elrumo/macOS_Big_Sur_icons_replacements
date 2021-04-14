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
      const response = await window.AppleID.auth.signIn();
      console.log("response: ", response);
    }
  },

  mounted: async function(){
    let parent = this

    // let currentUser = await Parse.User.currentAsync();
    // const user = new Parse.User();

    // user.linkWith('apple', {authData: parent.appleAuth}).then((authData) => {
    //   console.log(authData);
    // }).catch((error) => {
    //   console.log(error);
    // })
    //  async function logIn(){
      // await user.linkWith('apple', {authData:parent.appleAuth}).then
    //    }
    //  logIn()

     AppleID.auth.init({
        clientId : process.env.VUE_APP_APPLE_CLIENTID,
        scope : 'name email',
        redirectURI : process.env.VUE_APP_APPLE_REDIRECT,
        state : process.env.VUE_APP_APPLE_STATE,
        usePopup : true //or false defaults to false
    });

  }

}
</script>
