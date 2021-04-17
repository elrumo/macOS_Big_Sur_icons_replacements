<template>
  <div>
        <div @click="testAPI" style="height: 40px; width: 100px; background: black;" ></div>
        <!-- <div @click="twitterLogin" style="height: 40px; width: 100px; background: black;" ></div> -->
        <!-- <div @click="appleLogin" style="height: 40px; width: 100px; background: black;" ></div> -->

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
    
    async testAPI(){
      let obj = {
            "appName": "Luminar AI",
            "email": "antonbulzomi@icloud.com",
            "credit": "https://twitter.com/bulzomianton",
            "usersName": "Anton Bulzomi",
            "uploadedBy": "Anton Bulzomi",
            "fileName": "1618559771420",
            "highResPngFile": {
                "__type": "File",
                "name": "45ab46b8afc4f00814f6951152afb7a2_1618559771420.png",
                "url": "http://media.macosicons.com/parse/files/macOSicons/45ab46b8afc4f00814f6951152afb7a2_1618559771420.png"
            },
            "highResPngUrl": "https://media.macosicons.com/parse/files/macOSicons/45ab46b8afc4f00814f6951152afb7a2_1618559771420.png",
            "isReupload": false,
            "isAuthor": true,
            "timeStamp": 1618559783389,
            "approved": false,
            "createdAt": "2021-04-16T07:56:25.903Z",
            "updatedAt": "2021-04-16T07:56:27.879Z",
            "alogliaID": "EfXvT6mqvD",
            "id": "EfXvT6mqvD",
            "imgUrl": "https://media.macosicons.com/parse/files/macOSicons/45ab46b8afc4f00814f6951152afb7a2_1618559771420.png"
      }

      Parse.Cloud.run("testJob", obj).then((result)=>{
        console.log(result);
        parent.showToast({id:"iconApproved"})
      }).catch((e)=>{
        console.log(e);
        parent.showToast({id:"approveError"})
      });
    
      // console.log(JSON.stringify(obj));
      // console.log(JSON.parse(obj));
      // console.log(response);

    },

    async twitterLogin(){
    },

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

    // AppleID.auth.init({
    //   clientId : process.env.VUE_APP_APPLE_CLIENTID,
    //   scope : 'email',
    //   redirectURI : process.env.VUE_APP_APPLE_REDIRECT,
    //   state : process.env.VUE_APP_APPLE_STATE,
    //   usePopup : true //or false defaults to false
    // });

    AppleID.auth.init({
      clientId : 'com.macOSicons.client',
      scope : 'name email',
      redirectURI : 'https://macosicons.com/redirect',
      state : 'ZArDrecqhhR/ZMGzXa8XPqHWFJyfg8pV4gHiO/Pmv0Tz33YsYfDGheg2VC7KLwX+',
      usePopup : true //or false defaults to false
    });


  }

}
</script>
