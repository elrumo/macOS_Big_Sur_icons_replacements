<template>
  <coral-dialog v-on:submit.prevent="nextStep" v-if="!getUser.isAuth" id="loginDialog">

    <coral-dialog-content class="dialog-content">

      <coral-dialog id="resetPasswordDialog">
          <coral-dialog-header>Reset your password</coral-dialog-header>
          
          <coral-dialog-content style="max-width:412px">  
              You will receive an email to reset your password. 
              <br>
              <br>
              Make sure to check your spam folder if you don't receive it within the next few minutes.
          </coral-dialog-content>

          <coral-dialog-footer>
              <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
              <button is="coral-button" @click="resetPassword" variant="default" coral-close="">Reset password</button>
          </coral-dialog-footer>
      </coral-dialog>

        <div class="signin-dialog-content">
          
          <div>
            <img style="width: 48px" :src="imgs.macOSiconsLogo" alt="">

            <div v-if="userInfo.step != 3">
              <h3 class="coral-Heading--M m-t-8">
                Sign up or sign in
              </h3>
              <p class="coral-Body--M" style="font-weight: lighter">
                With an account you'll be able to submit new icons, view their approval status and more.
              </p>
            </div>

            <div v-if="userInfo.step == 3">
              <h3 class="coral-Heading--M m-t-8">
                Almost there!
              </h3>
              <p class="coral-Body--M p-t-24" style="font-weight: lighter">
                Please click on the link we've sent to your email to verify your account and then refresh this page.
              </p>
            </div>

          </div>

          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-popup">
              <coral-progress indeterminate>Loading</coral-progress>
            </div>
          </div>

          <form v-if="userInfo.step != 3" class="coral-FormGroup m-0 p-l-4 text-left" style="width: calc(100% - 5px)">
            <!-- <coral-alert
              style="padding: 10px; margin-top: 15px"
              v-if="userInfo.step == 1"
            >
              <coral-alert-header>Important</coral-alert-header>
              <coral-alert-content>If you've submitted an icon before, use the same email address you used then.</coral-alert-content>
            </coral-alert> -->
            
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
                  You've previously submitted an icon with this email address, you'll need to verify it to set a password.
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
                <coral-alert-content>Please use a different username and try again</coral-alert-content>
              </coral-alert>
            
            </div>

            <!-- Name to show -->
            <div v-if="userInfo.step == 2 && userInfo.newAccount" class="coral-FormGroup-item">
              <label id="nameToShowLabel-1" class="coral-FieldLabel">
                Name To Show (optional)
              </label>
              <input
                id="nameToShow-1"
                is="coral-textfield"
                labelledby="nameToShowLabel-1"
                class="coral-Form-field"
                type="text"
                name="nameToShow"
                v-on:keyup="getTextFieldValue($event, 'nameToShow', false)"
                v-on:change="getTextFieldValue($event, 'nameToShow', false)"
              >
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
                autofocus
                autocomplete="current-password"
                v-on:keyup="getTextFieldValue($event, 'password', false)"
              >
              <div v-if="!userInfo.problems.passNotSecure">
                <p class="coral-Body--XS opacity-60 f-w-400 p-t-8">
                  <span style="color: #E97273" v-if="!validatePassword && userInfo.password.length > 2">
                    Important:
                  </span>
                  Password must contain a number, a capital letter and be 6 or more characters long.
                </p>
                <p v-if="userInfo.step == 2 && userInfo.hasLoggedIn" class="coral-Body--XS opacity-60 f-w-400 p-t-8">
                  Problems signing in? <a @click="resetPassword" class="coral-link pointer">Reset password</a> 
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
              <hr class="coral-Divider--S m-t-16 m-b-16">
              <span style="margin: auto"> or </span>
              <hr class="coral-Divider--S m-t-16 m-b-16">
            </div> -->
            
            <!-- <div @click="appleLogin" class="apple-signin-banner">
              <img :src="coralIcons.apple" alt="">
              <p> Continue with Apple </p>
            </div> -->

            <!-- Terms & Conditions -->
            <p class="coral-Body--XS p-l-4 p-t-4 p-r-4 m-0 opacity-60">
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

      <button id="continue-btn" is="coral-button"
        v-if="isValid && userInfo.step == 1"
        @click="checkOldAccount(2)" variant="">
        Continue
      </button>
      
      <!-- Sign in -->
      <div v-if="userInfo.step == 2 && !userInfo.newAccount && userInfo.hasLoggedIn">
        <button id="continue-btn" is="coral-button"
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
          <button id="continue-btn" is="coral-button"
            v-if="isNotEmpty"
            @click="resetPassword" variant=""
          >
            Verify account
          </button>
          
          <button id="continue-btn" is="coral-button"
            v-if="!isNotEmpty"
            disabled=""
          >
            Verify account
          </button>
        </div>
        <button
          is="coral-button"
          v-else
          id="continue-btn"
          disabled=""
        >
          Resend in <span style="width: 18px; padding: 0px 5px 0px 2px;"> {{ timeLeftForResend }} </span> seconds
          {{waitSeconds}}
        </button>

      </div>
      
      <!-- Sign up -->
      <div v-if="userInfo.step == 2 && userInfo.newAccount">
        <button id="continue-btn" is="coral-button" 
          v-if="isSignUpValid"
          @click="signUp(3)">
          Finish sign Up
        </button>
        
        <button id="continue-btn" is="coral-button"
          v-if="!isSignUpValid"
          disabled="">
          Finish sign Up
        </button>
      </div>
     
      <!-- <button id="continue-btn" is="coral-button"
        v-if="!isValid" disabled="">
        Continue
      </button> -->

    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Parse from 'parse/dist/parse.min.js';
// import jwt_decode from 'jwt-decode';


import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import appleIcon from "../assets/icons/Apple.svg"
import deleteIcon from "../assets/icons/delete.svg"

import logoLowRes from "../assets/Resources/logo_lowres.png"

export default {
  name:"LoginDialog",
  
  props:{
  },
  
  data(){
    return{
      coralIcons:{
        apple: appleIcon,
        delete: deleteIcon,
        addIcon: addCoralIcon,
        newItem: newItemCoralIcon,
        edit: editCoralIcon,
        loading: placeholderCoralIcon,
      },
      imgs:{
        macOSiconsLogo: logoLowRes
      },
      email: "",
      yourName: "",
      isLoading: false,
      isReset: false,
      
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
        nameToShow: "",
        password: "",
        hasLoggedIn: false,
        newAccount: true,
      }
    }
  },
  
  methods:{
    ...mapActions(['showToast', 'setUser', 'handleParseError']),
    
    toStep(step){
      this.userInfo.step = step
    },

    nextStep(){
      let next = document.getElementById("continue-btn")
      next.click();
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
        let target = e.target
        let fieldValue = e.target.value
        var isValid = e.target.checkValidity()

        if (field == 'username') {
          fieldValue = fieldValue.replaceAll(" ", '_')
          e.target.value = fieldValue.toLowerCase()
        }
        
        if (field == 'email') {
          isValid = this.validateEmail(fieldValue);
        }

        if(e.keyCode == 13){
          parent.nextStep()
        }
        
        parent.userInfo[field] = fieldValue
        parent.userInfo.isValid = isValid
        
        if (target.type == "password") {
          let passIsValid = !parent.validatePassword
          if(passIsValid) parent.userInfo.problems.passNotSecure = false;
        }
      },

    toArray(obj){
      return Object.keys(obj)
    },

    async checkOldAccount(step){
      let parent = this;
      parent.isLoading = true
      let email = parent.userInfo.email;
      let queryUsers = new Parse.Query(Parse.User)
      queryUsers.equalTo("email", email);

      let findUsers = await queryUsers.find()

      queryUsers.find().then((response)=>{

        if (response.length != 0) {
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
        userExists = true
      } else {
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

      console.log(this.userInfo.nameToShow.length == 0 ? this.userInfo.username : this.userInfo.nameToShow);

      if (userExists) {
        console.log(userExists);
        parent.userInfo.problems.usernameExists = true
      }else{
        console.log(userExists);
        parent.userInfo.problems.usernameExists = false
      }

      user.set({
        username: this.userInfo.username,
        nameToShow: this.userInfo.nameToShow.length == 0 ? this.userInfo.username : this.userInfo.nameToShow,
        password: this.userInfo.password,
        email: this.userInfo.email,
        Role: roleIsUser
      });
      
      user.signUp().then((newUser) =>{
        this.setUser(newUser)
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
      
      if (!password) {
        password = document.getElementById("loginPass-1").value
        parent.userInfo.password = password
      }

      Parse.User.logIn(email, password).then((user) =>{
        console.log("user: ", user);
        parent.setUser(user)
        parent.isLoading = false
      }).catch((e) => {
        console.log("error logging in, report this to @elrumo: ", e.code);
        parent.isLoading = false
        
        switch (e.code) {
          case 101:
            parent.showToast({
              id: "toastMessage",
              message: "Invalid password, try again",
              variant: "error"
            }) 
            break;
          
          case 201:
            parent.showToast({
              id: "toastMessage",
              message: "Password cannot be empty",
              variant: "error"
            }) 
            break;

          default:
            break;
        }

      })

    },

    async resetPassword(){
      let parent = this;
      let email = parent.userInfo.email

      if (parent.isReset) {
        parent.isLoading = true;
        parent.isReset = false; 

        Parse.User.requestPasswordReset(email).then(()=>{
          parent.showToast({
            id: "toastMessage",
              message: "Check your email",
              variant: "success"
            })
        })  

        Parse.Cloud.run("firstTimeUser", {email: email}).then((result)=>{
          parent.userInfo.passwordResetSent = true
          parent.emailSentAt = new Date().getTime()// Set time the email was sent at
          parent.isLoading = false;

        }).catch((error) => {
          console.log("firstTimeUser error: ", error);
        })
      } else{
        document.getElementById("resetPasswordDialog").show()
        parent.isReset = true;
      }

    },

    allAreTrue(arr) {
      return arr.every(element => element === true);
    },

    validateEmail(email){
      if (!email) {
        email = this.userInfo.email;
      }
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return emailRegex.test(String(email).toLowerCase())
    },

  },

  computed:{
    ...mapGetters(['getUser']),
    
    isSignUpValid(){
      let isValid = [this.validatePassword, this.validateEmail(), this.validateUsername]
      console.log(this.validatePassword, this.validateEmail(), this.validateUsername);
      return this.allAreTrue(isValid)
    },

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

    validateUsername(){
      const username = this.userInfo.username
      console.log(this.userInfo.username);
      return username.length > 2
    },

    validatePassword(){
      let parent = this
      let userInfo = parent.userInfo
      var passwordRules = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
      return passwordRules.test(userInfo.password) && userInfo.password.length >= 6
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
      }).catch((error) => {
        this.handleParseError(error)
        // Parse.User.logout().then((data) => {
        //   console.log("Logged out: ", data);
        // }).catch(err => { 
        //   console.log("Error logging out after invalid user session: ", err)
        // })
      })

    }
  }

}
</script>

<style>
</style>