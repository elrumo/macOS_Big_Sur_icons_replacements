<template>
  <div>
        <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div>

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

export default {
  name: 'About',
  
  components: {
  },

  mounted: function(){
     
     AppleID.auth.init({
        clientId : process.env.VUE_APP_APPLE_CLIENTID,
        scope : 'name email',
        redirectURI : process.env.VUE_APP_APPLE_REDIRECT,
        state : process.env.VUE_APP_APPLE_STATE,
        usePopup : true //or false defaults to false
    });
 

    const singInApple = async () => {
      const response = await window.AppleID.auth.signIn();
      console.log(response);
      return response;
    };

    singInApple()

  }
}
</script>
