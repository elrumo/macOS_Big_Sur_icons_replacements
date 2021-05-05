<template>
  <coral-dialog v-if="!getUser.isAuth" id="loginDialog">

    <!-- <coral-dialog-header>
      Join macOSicons.com
    </coral-dialog-header> -->
    
    <coral-dialog-content>
      
        <div class="signin-dialog-content">
          
          <div>
            <img style="width: 48px" :src="imgs.macOSiconsLogo" alt="">

            <div v-if="userInfo.step != 3">
              <h3 class="coral-Heading--M m-t-10">
                Create an account
              </h3>
              <p class="coral-Body--M" style="font-weight: lighter">
                If you've submitted an icon before, sign up with the same email address you used then.
              </p>
            </div>

            <div v-if="userInfo.step == 3">
              <h3 class="coral-Heading--M m-t-10">
                Almost there!
              </h3>
              <p class="coral-Body--M p-t-20" style="font-weight: lighter">
                Please click on the link we've sent to your email to verify your account and then rerfresh this page.
              </p>
            </div>

          </div>

          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-popup">
              <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</coral-progress>
            </div>
          </div>

          <form v-if="userInfo.step != 3" class="coral-FormGroup m-0 p-l-5 text-left" style="width: calc(100% - 5px)">
          
            <!-- Email -->
            <div class="coral-FormGroup-item">
              <label id="loginEmailLabel-1" class="coral-FieldLabel">
                Email
              </label>
              <input
                id="loginEmail-1"
                is="coral-textfield"
                labelledby="loginEmailLabel-1"
                class="coral-Form-field"
                type="email"
                v-on:keyup="getTextFieldValue($event, 'email', true)"
                v-on:change="getTextFieldValue($event, 'email', true)"
              >
                <!-- v-on:change="getTextFieldValue($event, 'email')" -->
            </div>
            
            <!-- Username -->
            <div v-if="userInfo.step == 2" class="coral-FormGroup-item">
              <label id="loginUsernameLabel-1" class="coral-FieldLabel">
                Username
              </label>
              <input
                id="loginUsername-1"
                is="coral-textfield"
                labelledby="loginUsernameLabel-1"
                class="coral-Form-field"
                type="text"
                v-on:keyup="getTextFieldValue($event, 'username', false)"
              >
                <!-- v-on:change="getTextFieldValue($event, 'email')" -->
            </div>
            
            <!-- Password -->
            <div v-if="userInfo.step == 2" class="coral-FormGroup-item">
              <label id="loginPassLabel-1" class="coral-FieldLabel">
                Password
              </label>
              <input
                id="loginPass-1"
                is="coral-textfield"
                labelledby="loginPassLabel-1"
                class="coral-Form-field"
                type="password"
                v-on:keyup="getTextFieldValue($event, 'password', false)"
              >
                <!-- v-on:change="getTextFieldValue($event, 'email')" -->
            </div>

          </form>        
          
          <!-- Sign in with Apple & terms and conditions -->
          <div v-if="userInfo.step == 1">
            <!-- Or -->
            <!-- <div style="
                display: grid;
                grid-template-columns: auto 22px auto;
                gap: 10px;
              "
            >
              <hr class="coral-Divider--S m-t-15 m-b-15">
              <span style="margin: auto"> or </span>
              <hr class="coral-Divider--S m-t-15 m-b-15">
            </div> -->
            
            <!-- <div @click="appleLogin" class="apple-signin-banner">
              <img :src="coralIcons.apple" alt="">
              <p> Continue with Apple </p>
            </div> -->

            <!-- Terms & Conditions -->
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

        </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" v-if="userInfo.step == 1" variant="quiet" @click="closeDialog('loginDialog')">Cancel</button>
      <button is="coral-button" v-if="userInfo.step == 2" @click="toStep(1)" variant="quiet">Back</button>

      <button is="coral-button" v-if="isValid && userInfo.step == 1" @click="checkOldAccount(2)" variant="">Continue</button>
      <button is="coral-button" v-if="isNotEmpty && userInfo.step == 2" @click="signUp(3)" variant="">Finish sign Up</button>
      <button is="coral-button" v-if="!isNotEmpty && userInfo.step == 2" disabled="">Finish sign Up</button>
      <button is="coral-button" v-if="!isValid" disabled="">Continue</button>
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
      isLoading: false,

      userInfo:{
        isValid: false,
        step: 1,

        email: "",
        username: "",
        password: "",
        emailVerified: false,
        newAccount: true,
      }
    }
  },
  
  methods:{
    ...mapActions(['showToast', 'setUser']),
    
    toStep(step){
      this.userInfo.step = step
    },

    async appleLogin(){
      let parent = this;

      const userToLogin = new Parse.User();
      
      console.log("decodedIdToken: ", decodedIdToken);
     
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

    closeDialog(id){
      document.getElementById(id).hide()
    },

    setUserFunc(user){
      let parent = this
      parent.setUser(user)
    },

    setYourName(e){
      console.log(e.target.value);
      this.yourName = e.target.value
    },

    getTextFieldValue(e, field, isEmail){
        let parent = this
        let fieldValue = e.target.value
        var isValid = e.target.checkValidity()

        // Checks if email has a '.'
        if (!fieldValue.includes(".") && isEmail) {
          isValid = false
        }

        parent.userInfo[field] = fieldValue
        parent.userInfo.isValid = isValid
      },

    toArray(obj){
      return Object.keys(obj)
    },

    checkOldAccount(step){
      // const User = Parse.Object.extend("User");
      // let user = new User();
      let parent = this;
      let email = parent.userInfo.email;
      let queryUsers = new Parse.Query(Parse.User)
      queryUsers.equalTo("email", email);
      console.log(step);
      queryUsers.find().then((response)=>{
        console.log(response);
        if (response.length != 0) {
          console.log(response[0].get("emailVerified"));
          parent.userInfo.emailVerified = response[0].get("emailVerified")
          parent.userInfo.newAccount = false
        } else {
          parent.userInfo.newAccount = true
        }
          parent.userInfo.step = step
      }).catch((error) => {
        console.log("Error: ", error);
      })


    },

    async signUp(step){
      let parent = this;
      const user = new Parse.User();
      let roleQuery = new Parse.Query(Parse.Role);
      let roleIsUser = await roleQuery.get("NedBDJozKh")
      
      user.set({
        username: parent.userInfo.username,
        password: parent.userInfo.password,
        email: parent.userInfo.email,
        Role: roleIsUser
      });
      
      user.signUp().then((saved) =>{
        console.log(saved);
        parent.userInfo.step = 3
      })


    },

  },

  computed:{
    ...mapGetters(['getUser']),

    isNotEmpty(){
      let parent = this
      let toArray = parent.toArray
      let userInfo = parent.userInfo

      let isValid = []
      
      toArray(userInfo).forEach((field)=>{
          if (userInfo[field] == "" && field != "emailVerified") {
            console.log(field);
            isValid.push(true)
          }
          if (userInfo.password.length < 5) {
            console.log(userInfo.password);
            isValid.push(true)
          }
      })

      console.log(isValid);

      if (isValid.length == 0) {
        return true
      } else {
        return isValid.some((el) => { return el == false })
      }

    },

    isValid(){
      let parent = this
      let toArray = parent.toArray
      let userInfo = parent.userInfo

      return userInfo.isValid
    }

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
    
    // AppleID.auth.init({
    //   clientId : process.env.VUE_APP_APPLE_CLIENTID,
    //   scope : 'email',
    //   redirectURI : process.env.VUE_APP_APPLE_REDIRECT,
    //   state : process.env.VUE_APP_APPLE_STATE,
    //   usePopup : true //or false defaults to false
    // });

  }


}
</script>

<style>

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease-out;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>