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

            <!-- Repeat Password -->
            <div v-if="userInfo.step == 2 && userInfo.newAccount" class="coral-FormGroup-item">
              <label id="loginRepeatPassLabel-1" class="coral-FieldLabel">
                Repeat Password
              </label>
              <input
                id="loginRepeatPass-1"
                is="coral-textfield"
                labelledby="loginRepeatPassLabel-1"
                class="coral-Form-field"
                type="password"
                name="repeatPassword"
                autocomplete="new-password"
                v-on:keyup="getTextFieldValue($event, 'repeatPassword', false)"
                v-on:change="getTextFieldValue($event, 'repeatPassword', false)"
              >
              
              <coral-alert
                v-if="!validateRepeatPassword && userInfo.repeatPassword.length > 0"
                style="padding: 10px; margin-top: 15px"
                variant="warning"
              >
                <coral-alert-header>Passwords do not match</coral-alert-header>
                <coral-alert-content>
                  Please make sure both passwords are the same.
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
            
            <div>
              or
            </div>

            <div @click="appleLogin" class="apple-signin-banner">
              <img :src="coralIcons.apple">
              <p> Continue with Apple </p>
            </div>

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

      <button 
        id="continue-btn" 
        is="coral-button"
        v-if="userInfo.step == 1"
        :disabled="!isValid"
        @click="checkOldAccount(2)"
        variant=""
      >
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
       {{ userInfo.newAccount }}
       <br>
       {{ userInfo.step }}
      <!-- <div v-if="userInfo.step == 2 && !userInfo.newAccount && !userInfo.hasLoggedIn">
        
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

      </div> -->
      
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Parse from 'parse/dist/parse.min.js';

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import appleIcon from "../assets/icons/Apple.svg"
import deleteIcon from "../assets/icons/delete.svg"
import logoLowRes from "../assets/Resources/logo_lowres.png"

const store = useStore();

// Data
const coralIcons = {
  apple: appleIcon,
  delete: deleteIcon,
  addIcon: addCoralIcon,
  newItem: newItemCoralIcon,
  edit: editCoralIcon,
  loading: placeholderCoralIcon,
};

const imgs = {
  macOSiconsLogo: logoLowRes
};

const email = ref("");
const yourName = ref("");
const isLoading = ref(false);
const isReset = ref(false);
const showResend = ref(false);
const emailSentAt = ref('');
const timeLeftForResend = ref(20);

const userInfo = reactive({
  isValid: false,
  step: 1,
  problems: {
    usernameExists: false,
    passNotSecure: false
  },
  passwordResetSent: false,
  email: "",
  username: "",
  nameToShow: "",
  password: "",
  repeatPassword: "",
  hasLoggedIn: false,
  newAccount: true,
});

// Vuex Actions
const showToast = (payload) => store.dispatch('showToast', payload);
const setUser = (user) => store.dispatch('setUser', user);
const handleParseError = (error) => store.dispatch('handleParseError', error);

// Vuex Getters
const getUser = computed(() => store.getters.getUser);

// Methods
const toStep = (step) => {
  userInfo.step = step;
};

const appleLogin = async () => {
  AppleID.auth.init({
    clientId: 'com.macOSicons.client',
    scope: 'email name',
    redirectURI: 'https://macosicons.com/redirect',
    usePopup: true,
  });

  try {
    const data = await AppleID.auth.signIn();
    logIn(null, data);
  } catch (error) {
    console.error(error);
  }
};

const nextStep = () => {
  const next = document.getElementById("continue-btn");
  next.click();
};

const closeDialog = (id) => {
  document.getElementById(id).hide();
};

const setUserFunc = (user) => {
  setUser(user);
};

const setYourName = (e) => {
  yourName.value = e.target.value;
};

const getTextFieldValue = (e, field, isEmail) => {
  let fieldValue = e.target.value;
  let isValid = e.target.checkValidity();

  if (field === 'username') {
    fieldValue = fieldValue.replaceAll(" ", '_');
    fieldValue = fieldValue.replaceAll("/", '_');
    fieldValue = fieldValue.replaceAll("#", '_');
    e.target.value = fieldValue.toLowerCase();
  }

  if (field === 'email') {
    isValid = validateEmail(fieldValue);
  }

  if (e.keyCode === 13) {
    nextStep();
  }

  userInfo[field] = fieldValue;
  userInfo.isValid = isValid;

  if (field === "password") {
    const passIsValid = !validatePassword.value;
    if (passIsValid) userInfo.problems.passNotSecure = false;
  }
};

const toArray = (obj) => {
  return Object.keys(obj);
};

const checkOldAccount = async (step, skipStep = false) => {
  isLoading.value = true;
  const userEmail = userInfo.email;

  console.log("skipStep: ", skipStep);
  
  try {
    let findUserResponse = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/auth/doesAccountExist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail
      })
    });
    findUserResponse = await findUserResponse.json();
    let accountExists = findUserResponse.accountExists;
    console.log("accountExists: ", accountExists);
    
    if(skipStep) {
      console.log("skipStep accountExists: ", accountExists);
      return accountExists;
    }

    if (accountExists) {
      userInfo.hasLoggedIn = true;
      userInfo.newAccount = false;
    } else {
      // console.error(accountExists);
      userInfo.hasLoggedIn = false;
      userInfo.newAccount = true;
    }

    userInfo.step = step;
    isLoading.value = false;
    
  } catch (error) {
    console.error("Error: ", error);
    isLoading.value = false;
  }
};

const userExists = async (funcName) => {
  return await checkOldAccount(2, true);
  // console.log(`[userExists] ${funcName}`);
  // const queryUsername = new Parse.Query(Parse.User);
  // queryUsername.matches("username", userInfo.username, 'i');
  // const resultsUserame = await queryUsername.find();
  // return resultsUserame.length != 0;
};

const crateUser = async () => {
  try {
    let userRes = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/auth/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userInfo.email,
        username: userInfo.username,
        nameToShow: userInfo.nameToShow,
        password: userInfo.password
      })
    });
    userRes = await userRes.json();
    return userRes;
  } catch (error) {
    console.error("Error: ", error);
  }
}

const signUp = async (step) => {
  try {
    isLoading.value = true;
    const roleQuery = new Parse.Query(Parse.Role);
    const roleIsUser = await roleQuery.get("NedBDJozKh");
    const userExistsResult = await userExists("signUp");

    if (userExistsResult) {
      userInfo.problems.usernameExists = true;
    } else {
      userInfo.problems.usernameExists = false;
    }

    let user = await crateUser();
  
    console.log("user: ", user);
    user = await Parse.User.logIn(userInfo.username, userInfo.password);
    console.log("user2: ", user);

    setUser(user);
    userInfo.step = 3;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    if (error.code === 202) {
      showToast({
        id: "toastMessage",
        message: "Username already in use",
        variant: "error"
      });
    }

    if (error.code === 142) {
      userInfo.problems.passNotSecure = true;
      showToast({
        id: "toastMessage",
        message: "Password must be more secure, see above for details",
        variant: "error"
      });
    }
    console.error('Parse Error signing up:', error.code, ": ", error.message);
  }
};

const logIn = async (step, appleData) => {
  isLoading.value = true;

  if (appleData) {
    const { authorization, user } = appleData;

    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };

    const decoded = parseJwt(authorization.id_token);
    if (!decoded || !decoded.sub) {
      console.error("Invalid Apple ID token");
      isLoading.value = false;
      return;
    }
    const id = decoded.sub;

    try {
      const loggedInUser = await Parse.User.logInWith('apple', {
        authData: {
          id: id,
          token: authorization.id_token
        }
      });

      if (user) {
        if (user.name) {
          loggedInUser.set("nameToShow", user.name.firstName + " " + user.name.lastName);
        }
        if (user.email) {
          loggedInUser.set("email", user.email);
          loggedInUser.set("username", user.email);
        }
        await loggedInUser.save();
      }

      setUser(loggedInUser);
      isLoading.value = false;
    } catch (e) {
      console.error(e);
      isLoading.value = false;
      showToast({
        id: "toastMessage",
        message: "Error logging in with Apple",
        variant: "error"
      });
    }
    return;
  }

  const userEmail = userInfo.email;
  let password = userInfo.password;

  if (!password) {
    password = document.getElementById("loginPass-1").value;
    userInfo.password = password;
  }

  try {
    const user = await Parse.User.logIn(userEmail, password);
    setUser(user);
    isLoading.value = false;

    if (user.get("hasLoggedIn")) {
      userInfo.hasLoggedIn = true;
      userInfo.newAccount = false;
    } else {
      console.error(user.get("hasLoggedIn"));
      userInfo.hasLoggedIn = false;
      userInfo.newAccount = true;
    }

    userInfo.step = step;
    isLoading.value = false;
  } catch (e) {
    console.error("error logging in, report this to @elrumo: ", e);
    isLoading.value = false;

    switch (e.code) {
      case 101:
        showToast({
          id: "toastMessage",
          message: "Invalid password, try again",
          variant: "error"
        });
        break;

      case 201:
        showToast({
          id: "toastMessage",
          message: "Password cannot be empty",
          variant: "error"
        });
        break;

      default:
        break;
    }
  }
};

const resetPassword = async () => {
  const userEmail = userInfo.email;

  if (isReset.value) {
    isLoading.value = true;
    isReset.value = false;

    Parse.User.requestPasswordReset(userEmail).then(() => {
      showToast({
        id: "toastMessage",
        message: "Check your email",
        variant: "success"
      });
    });

    Parse.Cloud.run("firstTimeUser", { email: userEmail }).then((result) => {
      userInfo.passwordResetSent = true;
      emailSentAt.value = new Date().getTime();
      isLoading.value = false;
    }).catch((error) => {
      console.error("firstTimeUser error: ", error);
    });
  } else {
    document.getElementById("resetPasswordDialog").show();
    isReset.value = true;
  }
};

const allAreTrue = (arr) => {
  return arr.every(element => element === true);
};

const validateEmail = (emailVal) => {
  if (!emailVal) {
    emailVal = userInfo.email;
  }
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(emailVal).toLowerCase());
};

// Computed
const isSignUpValid = computed(() => {
  const isValid = [validatePassword.value, validateEmail(), validateUsername.value, validateRepeatPassword.value];
  return allAreTrue(isValid);
});

const waitSeconds = computed(() => {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const difference = now - emailSentAt.value;
    const wait = 20;
    const isDifference = showResend.value = difference >= wait * 1000;

    timeLeftForResend.value = timeLeftForResend.value - 1;

    if (isDifference) {
      showResend.value = true;
      timeLeftForResend.value = wait;
      userInfo.passwordResetSent = false;
      clearInterval(interval);
    }
  }, 1000);

  return showResend.value;
});

const validateUsername = computed(() => {
  return userInfo.username.length > 2;
});

const validatePassword = computed(() => {
  const passwordRules = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
  return passwordRules.test(userInfo.password) && userInfo.password.length >= 6;
});

const validateRepeatPassword = computed(() => {
  return userInfo.password === userInfo.repeatPassword && userInfo.repeatPassword.length > 0;
});

const isNotEmpty = computed(async () => {
  const isValid = [];

  const userExistsResult = await userExists("isNotEmpty");
  console.log("userExistsResult 1: ", userExistsResult);
  
  if (!userExistsResult) {
    console.log("userExistsResult 2: ", userExistsResult);
    isValid.push(validatePassword.value);
    userInfo.newAccount = true;
  }

  toArray(userInfo).forEach((field) => {
    if (userInfo[field] === "" && field !== "hasLoggedIn" && field !== "newAccount") {
      isValid.push(true);
    }
  });

  if (isValid.length === 0) {
    return true;
  } else {
    return isValid.some((el) => el === false);
  }
});

const isValid = computed(() => {
  return userInfo.isValid;
});

// Lifecycle
onMounted(async () => {
  const currentUser = Parse.User.current();

  if (currentUser) {  
    const query = new Parse.Query(Parse.User);

    try {
      let user = await query.get(currentUser.id);
      setUserFunc(user);
    } catch (error) {
      handleParseError(error);
    }
  }
});
</script>

<style>
</style>