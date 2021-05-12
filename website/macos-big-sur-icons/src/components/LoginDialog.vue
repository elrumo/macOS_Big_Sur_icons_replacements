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
                Sign up or sign in
              </h3>
              <p class="coral-Body--M" style="font-weight: lighter">
                With an account you'll be able to submit new icons, view their approval status and more.
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
              <coral-progress indeterminate>Loading</coral-progress>
            </div>
          </div>

          <form v-if="userInfo.step != 3" class="coral-FormGroup m-0 p-l-5 text-left" style="width: calc(100% - 5px)">
            <coral-alert
              style="padding: 10px; margin-top: 15px"
              v-if="userInfo.step == 1"
            >
              <coral-alert-header>Important</coral-alert-header>
              <coral-alert-content>If you've submitted an icon before, use the same email address you used then.</coral-alert-content>
            </coral-alert>
            
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
                name="email"
                autocomplete="email"
                v-on:keyup="getTextFieldValue($event, 'email', true)"
                v-on:change="getTextFieldValue($event, 'email', true)"
              >
              
              <coral-alert
                style="padding: 10px; margin-top: 15px"
                v-if="userInfo.step != 1 && !userInfo.hasLoggedIn && !userInfo.passwordResetSent && !userInfo.newAccount"
              >
                <coral-alert-header>Verify account</coral-alert-header>
                <coral-alert-content>
                  You've previously submited an icon with this email address, you'll need to verify it to set a password.
                </coral-alert-content>
              </coral-alert>

              <coral-alert
                style="padding: 10px; margin-top: 15px"
                v-if="userInfo.step != 1 && !userInfo.hasLoggedIn && userInfo.passwordResetSent"
                variant="success"
              >
                <coral-alert-header>Check your email</coral-alert-header>
                <coral-alert-content>
                  Click on the link we've just sent you to set a password and verify your email.
                </coral-alert-content>
              </coral-alert>

            </div>

            <!-- Username -->
            <div v-if="userInfo.step == 2 && userInfo.newAccount" class="coral-FormGroup-item">
              <label id="loginUsernameLabel-1" class="coral-FieldLabel">
                Username
              </label>
              <input
                id="loginUsername-1"
                is="coral-textfield"
                labelledby="loginUsernameLabel-1"
                class="coral-Form-field"
                type="text"
                name="username"
                autocomplete="username"
                v-on:keyup="getTextFieldValue($event, 'username', false)"
                v-on:change="getTextFieldValue($event, 'username', false)"
              >
              <coral-alert
                v-if="userInfo.problems.usernameExists"
                style="padding: 10px; margin-top: 15px"
                variant="warning"
              >
                <coral-alert-header>Username already in use</coral-alert-header>
                <coral-alert-content>Please, use a different username and try again</coral-alert-content>
              </coral-alert>
            
            </div>
            
            <!-- Password -->
            <div v-if="userInfo.step == 2 && (userInfo.newAccount || userInfo.hasLoggedIn)" class="coral-FormGroup-item">
              <label id="loginPassLabel-1" class="coral-FieldLabel">
                Password
              </label>
              <input
                id="loginPass-1"
                is="coral-textfield"
                labelledby="loginPassLabel-1"
                class="coral-Form-field"
                type="password"
                name="password"
                autocomplete="current-password"
                v-on:keyup="getTextFieldValue($event, 'password', false)"
              >
              <div v-if="!userInfo.problems.passNotSecure">
                <p class="coral-Body--XS opacity-60 f-w-400 p-t-10">
                  Password must contain a number, a capital letter and be more than 6 characters long.
                </p>
                <p v-if="userInfo.step == 2 && userInfo.hasLoggedIn" class="coral-Body--XS opacity-60 f-w-400 p-t-10">
                  Problems signing in? <a @click="resetPassword" class="coral-link">Reset password</a> 
                </p>
              </div>   

              <coral-alert
                v-if="userInfo.problems.passNotSecure"
                style="padding: 10px; margin-top: 15px"
                variant="warning"
              >
                <coral-alert-header>Password not secure enough</coral-alert-header>
                <coral-alert-content>
                  Password must contain a number, a capital letter and be more than 6 characters long.
                </coral-alert-content>
              </coral-alert>
              <!-- <coral-alert
                style="padding: 10px; margin-top: 15px"
              >
                <coral-alert-header>Password Requirements</coral-alert-header>
                <coral-alert-content>The password must.</coral-alert-content>
              </coral-alert> -->
            </div>

              <!-- v-if="userInfo.problems.usernameExists" -->
           
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
              <!-- <a
                rel="noopener"
                class="coral-Link"
                href="https://blog.macosicons.com/blog/p/e616d7d6-5462-44e4-a5a1-0b00e6ca41a1/"
                target="_blank"
              >
                Terms of Use
              </a>
              and -->
              <a
                rel="noopener"
                class="coral-Link"
                href="https://blog.macosicons.com/blog/p/e616d7d6-5462-44e4-a5a1-0b00e6ca41a1/"
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

      <button is="coral-button"
        v-if="isValid && userInfo.step == 1"
        @click="checkOldAccount(2)" variant="">
        Continue
      </button>
      
      <!-- Sign in -->
      <div v-if="userInfo.step == 2 && !userInfo.newAccount && userInfo.hasLoggedIn">
        <button is="coral-button"
          v-if="isNotEmpty"
          @click="logIn(3)" variant="">
          Log in
        </button>

        <button is="coral-button"
          v-if="!isNotEmpty"
          disabled="">
          Log in
        </button>
      </div>
      
      <!-- Verify Account -->
      <div v-if="userInfo.step == 2 && !userInfo.newAccount && !userInfo.hasLoggedIn">
        
        <div v-if="!userInfo.passwordResetSent">
          <button is="coral-button"
            v-if="isNotEmpty"
            @click="resetPassword" variant=""
          >
            Verify account
          </button>
          
          <button is="coral-button"
            v-if="!isNotEmpty"
            disabled=""
          >
            Verify account
          </button>
        </div>
        <button
          is="coral-button"
          v-else
          disabled=""
        >
          Resend in <span style="width: 18px; padding: 0px 5px 0px 2px;"> {{ timeLeftForResend }} </span> seconds
          {{waitSeconds}}
        </button>

      </div>
      
      <!-- Sign up -->
      <div v-if="userInfo.step == 2 && userInfo.newAccount">
        <button is="coral-button" 
          v-if="isNotEmpty"
          @click="signUp(3)">
          Finish sign Up
        </button>
        
        <button is="coral-button"
          v-if="!isNotEmpty"
          disabled="">
          Finish sign Up
        </button>
      </div>
     
      <button is="coral-button"
        v-if="!isValid" disabled="">
        Continue
      </button>

    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Parse from 'parse'
// import jwt_decode from 'jwt-decode';

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
      
      showResend: false,
      emailSentAt: '',
      timeLeftForResend: 20,

      userInfo:{
        isValid: false,
        step: 1,
        problems:{
          usernameExists: false,
          passNotSecure: false
        },

        passwordResetSent: false,
        email: "",
        username: "",
        password: "",
        hasLoggedIn: false,
        newAccount: true,
      }
    }
  },
  
  methods:{
    ...mapActions(['showToast', 'setUser']),
    
    toStep(step){
      this.userInfo.step = step
    },

    // async appleLogin(){
    //   let parent = this;

    //   const userToLogin = new Parse.User();
      
    //   console.log("decodedIdToken: ", decodedIdToken);
     
    //   let appleEmail = decodedIdToken.email
    //   let appleId = decodedIdToken.sub
    //   let token = decodedIdToken.token
      
    //   // const response = await window.AppleID.auth.signIn();
    //   // const decodedIdToken = jwt_decode(response.authorization.id_token);
    //   // let appleEmail = decodedIdToken.email
    //   // let appleId = decodedIdToken.sub
    //   // let token = response.authorization.id_token

    //   let authData = {
    //     id:  appleId,
    //     email:  appleEmail,
    //     token: token
    //   }
    //   await userToLogin.linkWith('apple', {
    //     authData: authData
    //     })
    //     .then(async (loggedInUser) =>{
    //       parent.setUser(JSON.parse(JSON.stringify(loggedInUser)))
    //       userToLogin.set("email", authData.email)
    //       userToLogin.save()
    //     }).catch((error) => {
    //       console.log(error);
    //   })
    
    // },

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
        let target = e.target
        let fieldValue = e.target.value
        var isValid = e.target.checkValidity()

        // Checks if email has a '.'
        if (!fieldValue.includes(".") && isEmail) {
          isValid = false
        }
        
        parent.userInfo[field] = fieldValue
        parent.userInfo.isValid = isValid

        if (target.type == "password") {
          let passIsValid = !parent.validatePassword
          console.log(passIsValid, ": ", parent.userInfo.password);
          if(passIsValid) parent.userInfo.problems.passNotSecure = false;
        }
      },

    toArray(obj){
      return Object.keys(obj)
    },

    checkOldAccount(step){
      let parent = this;
      parent.isLoading = true
      let email = parent.userInfo.email;
      let queryUsers = new Parse.Query(Parse.User)
      queryUsers.equalTo("email", email);
      console.log(step);
      
      queryUsers.find().then((response)=>{

        if (response.length != 0) {

          console.log(response[0].get("hasLoggedIn"));
          
          if (response[0].get("hasLoggedIn")) {
            parent.userInfo.hasLoggedIn = true
          } else{
            console.log(response[0].get("hasLoggedIn"));
            parent.userInfo.hasLoggedIn = false
          }

          parent.userInfo.newAccount = false
        } else {
          parent.userInfo.newAccount = true
        }
        parent.userInfo.step = step
        parent.isLoading = false

      }).catch((error) => {
        console.log("Error: ", error);
        parent.isLoading = false
      })

    },

    async userExists(){
      let parent = this;
      const queryUsername = new Parse.Query(Parse.User);
      queryUsername.matches("username", parent.userInfo.username, 'i')
      let resultsUserame = await queryUsername.find();
      var userExists
      
      if (resultsUserame.length !=0) {
        console.log("resultsUserame.length: ", resultsUserame.length);
        userExists = true
      } else {
        console.log("resultsUserame.length: ", resultsUserame.length);
        userExists = false
      }
      
      return userExists
    },

    async signUp(step){
      let parent = this;
      parent.isLoading = true
      const user = new Parse.User();
      let roleQuery = new Parse.Query(Parse.Role);
      let roleIsUser = await roleQuery.get("NedBDJozKh")
      let userExists = await parent.userExists()

      if (userExists) {
        console.log(userExists);
        parent.userInfo.problems.usernameExists = true
      }else{
        console.log(userExists);
        parent.userInfo.problems.usernameExists = false
      }

      user.set({
        username: parent.userInfo.username,
        password: parent.userInfo.password,
        email: parent.userInfo.email,
        Role: roleIsUser
      });
      
      user.signUp().then((saved) =>{
        console.log(saved);
        parent.userInfo.step = 3
        parent.isLoading = false
      }).catch((error)=>{
        parent.isLoading = false
        if (error.code == 202) {
          parent.showToast({
            id: "toastMessage",
            message: "Username already in use",
            variant: "error"
          })
        }

        if (error.code == 142) {
          parent.userInfo.problems.passNotSecure = true
          parent.showToast({
            id: "toastMessage",
            message: "Password must be more secure, see above for details",
            variant: "error"
          })
        }
        console.log(error.code, ": ", error.message);
      })
    },

    logIn(step){
      let parent = this;
      parent.isLoading = true

      let email = parent.userInfo.email
      let password = parent.userInfo.password
      
      Parse.User.logIn(email, password).then((user) =>{
        console.log("user: ", user);
        parent.setUser(user)
        console.log(parent.getUser);
        parent.isLoading = false
      }).catch((e) => {
        if (e.code == 101) {
          parent.isLoading = false
          parent.showToast({
            id: "toastMessage",
            message: "❌ Invalid password, try again",
            variant: "error"
          }) 
        }
      })

    },

    async resetPassword(){
      let parent = this;
      parent.isLoading = true;
      let email = parent.userInfo.email
      const user = await Parse.User.requestPasswordReset(email)
      user
      
      Parse.Cloud.run("firstTimeUser", {email: email}).then((result)=>{
        parent.userInfo.passwordResetSent = true
        parent.emailSentAt = new Date().getTime()// Set time the email was sent at
        parent.isLoading = false;
        
        parent.showToast({
          id: "toastMessage",
          message: "✅ Check your email",
          variant: "success"
        })

      }).catch((error) => {
        console.log("firstTimeUser error: ", error);
      })

    },

  },

  computed:{
    ...mapGetters(['getUser']),
    
    waitSeconds(){
      let parent = this
      var interval = setInterval(function(){
        let now = new Date().getTime();
        let difference = now - parent.emailSentAt
        let wait = 20
        let isDifference = parent.showResend = difference >= wait*1000

        parent.timeLeftForResend = parent.timeLeftForResend - 1

        if (isDifference) {
          parent.showResend = true;
          parent.timeLeftForResend = wait;
          parent.userInfo.passwordResetSent = false;
          clearInterval(interval);
        }
      }, 1000);

      interval
      return parent.showResend 
    },

    validatePassword(){
      let parent = this
      let userInfo = parent.userInfo
      var passwordRules = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
      console.log("Passes: ", passwordRules.test(userInfo.password));
      return !passwordRules.test(userInfo.password)
    },

    async isNotEmpty(){
      let parent = this
      let toArray = parent.toArray
      let userInfo = parent.userInfo

      let isValid = []
      
      // Do password strengh checks only if the user does not exist
      let userExists = await parent.userExists()
      if (!userExists) {
        isValid.push(parent.validatePassword)
      }
      
      toArray(userInfo).forEach((field)=>{
          if (userInfo[field] == "" && field != "hasLoggedIn" && field != "newAccount") {
            isValid.push(true)
          }
          console.log(field, ": ", userInfo[field]);
      })

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
        console.log(user);
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