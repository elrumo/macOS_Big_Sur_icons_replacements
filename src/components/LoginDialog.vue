<template>
  <UModal v-model:open="isOpen" v-if="!getUser.isAuth" :ui="{ width: 'max-w-md' }">
    <!-- Reset Password Nested Modal -->
    <UModal v-model:open="showResetPassword" :ui="{ width: 'max-w-sm' }">
      <template #header>
        <h3 class="text-lg font-semibold">Reset your password</h3>
      </template>
      <div class="p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          You will receive an email to reset your password.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Make sure to check your spam folder if you don't receive it within the next few minutes.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showResetPassword = false">Cancel</UButton>
          <UButton @click="resetPassword">Reset password</UButton>
        </div>
      </template>
    </UModal>

    <div class="p-6">
      <div class="text-center mb-6">
        <img class="w-12 mx-auto" :src="imgs.macOSiconsLogo" alt="macOSicons">

        <div v-if="userInfo.step !== 3">
          <h3 class="text-xl font-semibold mt-4">Sign up or sign in</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            With an account you'll be able to submit new icons, view their approval status and more.
          </p>
        </div>

        <div v-if="userInfo.step === 3">
          <h3 class="text-xl font-semibold mt-4">Almost there!</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-6">
            Please click on the link we've sent to your email to verify your account and then refresh this page.
          </p>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <UProgress animation="carousel" class="mb-2" />
          <p class="text-sm">Loading</p>
        </div>
      </div>

      <!-- Form -->
      <form v-if="userInfo.step !== 3" class="space-y-4" @submit.prevent="nextStep">
        <!-- Email -->
        <UFormField label="Email">
          <UInput
            v-model="userInfo.email"
            type="email"
            name="email"
            autocomplete="email"
            @keyup.enter="nextStep"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="userInfo.step !== 1 && !userInfo.hasLoggedIn && userInfo.passwordResetSent"
          color="green"
          variant="soft"
          title="Check your email"
          description="Click on the link we've just sent you to set a password and verify your email."
          class="mt-3"
        />

        <!-- Username (for new accounts) -->
        <UFormField v-if="userInfo.step === 2 && userInfo.newAccount" label="Username">
          <UInput
            v-model="userInfo.username"
            type="text"
            name="username"
            autocomplete="username"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="userInfo.problems.usernameExists"
          color="yellow"
          variant="soft"
          title="Username already in use"
          description="Please use a different username and try again"
        />

        <!-- Name to show (for new accounts) -->
        <UFormField v-if="userInfo.step === 2 && userInfo.newAccount" label="Name To Show (optional)">
          <UInput
            v-model="userInfo.nameToShow"
            type="text"
            name="nameToShow"
            class="w-full"
          />
        </UFormField>

        <!-- Password -->
        <UFormField v-if="userInfo.step === 2 && (userInfo.newAccount || userInfo.hasLoggedIn)" label="Password">
          <UInput
            v-model="userInfo.password"
            type="password"
            name="password"
            autocomplete="current-password"
            class="w-full"
          />
          <template #hint v-if="!userInfo.problems.passNotSecure">
            <p class="text-xs text-gray-500 mt-1">
              <span v-if="!validatePassword && userInfo.password.length > 2" class="text-red-500">
                Important:
              </span>
              Password must contain a number, a capital letter and be 6 or more characters long.
            </p>
            <p v-if="userInfo.step === 2 && userInfo.hasLoggedIn" class="text-xs text-gray-500 mt-1">
              Problems signing in?
              <a @click="resetPassword" class="text-primary cursor-pointer">Reset password</a>
            </p>
          </template>
        </UFormField>

        <UAlert
          v-if="userInfo.problems.passNotSecure"
          color="yellow"
          variant="soft"
          title="Password not secure enough"
          description="Password must contain a number, a capital letter and be more than 6 characters long."
        />

        <!-- Repeat Password (for new accounts) -->
        <UFormField v-if="userInfo.step === 2 && userInfo.newAccount" label="Repeat Password">
          <UInput
            v-model="userInfo.repeatPassword"
            type="password"
            name="repeatPassword"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="!validateRepeatPassword && userInfo.repeatPassword.length > 0"
          color="yellow"
          variant="soft"
          title="Passwords do not match"
          description="Please make sure both passwords are the same."
        />
      </form>

      <!-- Sign in with Apple & Terms -->
      <div v-if="userInfo.step === 1" class="mt-6">
        <div class="text-center text-sm text-gray-500 mb-4">or</div>

        <div @click="appleLogin" class="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <img :src="coralIcons.apple" class="w-5 h-5">
          <p class="text-sm font-medium">Continue with Apple</p>
        </div>

        <p class="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree with macOSicons's
          <a
            rel="noopener"
            class="text-primary"
            href="https://blog.macosicons.com/blog/p/e616d7d6-5462-44e4-a5a1-0b00e6ca41a1/"
            target="_blank"
          >
            Privacy Policy.
          </a>
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton v-if="userInfo.step === 1" variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton v-if="userInfo.step === 2" variant="ghost" @click="toStep(1)">Back</UButton>

        <UButton
          v-if="userInfo.step === 1"
          :disabled="!isValid"
          @click="checkOldAccount(2)"
        >
          Continue
        </UButton>

        <!-- Sign in -->
        <template v-if="userInfo.step === 2 && !userInfo.newAccount && userInfo.hasLoggedIn">
          <UButton v-if="isNotEmpty" @click="logIn(3)">Log in</UButton>
          <UButton v-else disabled>Log in</UButton>
        </template>

        <!-- Sign up -->
        <template v-if="userInfo.step === 2 && userInfo.newAccount">
          <UButton v-if="isSignUpValid" @click="signUp(3)">Finish sign Up</UButton>
          <UButton v-else disabled>Finish sign Up</UButton>
        </template>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js'

import appleIcon from "../assets/icons/Apple.svg"
import logoLowRes from "../assets/Resources/logo_lowres.png"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const isOpen = ref(false)
const showResetPassword = ref(false)

const coralIcons = {
  apple: appleIcon,
}

const imgs = {
  macOSiconsLogo: logoLowRes
}

const isLoading = ref(false)
const isReset = ref(false)

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
})

// Computed
const getUser = computed(() => store.getters.getUser)

const validatePassword = computed(() => {
  const passwordRules = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")
  return passwordRules.test(userInfo.password) && userInfo.password.length >= 6
})

const validateRepeatPassword = computed(() => {
  return userInfo.password === userInfo.repeatPassword && userInfo.repeatPassword.length > 0
})

const validateUsername = computed(() => {
  return userInfo.username.length > 2
})

const isValid = computed(() => {
  return validateEmail(userInfo.email)
})

const isSignUpValid = computed(() => {
  return validatePassword.value && validateEmail() && validateUsername.value && validateRepeatPassword.value
})

const isNotEmpty = computed(() => {
  return userInfo.password.length > 0
})

// Watch
watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Methods
const open = () => {
  isOpen.value = true
}

defineExpose({ open })

function showToast(payload) {
  store.dispatch('showToast', payload)
}

function setUser(user) {
  store.dispatch('setUser', user)
}

function handleParseError(error) {
  store.dispatch('handleParseError', error)
}

function toStep(step) {
  userInfo.step = step
}

function validateEmail(emailVal) {
  if (!emailVal) {
    emailVal = userInfo.email
  }
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(String(emailVal).toLowerCase())
}

function nextStep() {
  if (userInfo.step === 1 && isValid.value) {
    checkOldAccount(2)
  } else if (userInfo.step === 2) {
    if (userInfo.newAccount && isSignUpValid.value) {
      signUp(3)
    } else if (!userInfo.newAccount && userInfo.hasLoggedIn && isNotEmpty.value) {
      logIn(3)
    }
  }
}

async function appleLogin() {
  AppleID.auth.init({
    clientId: 'com.macOSicons.client',
    scope: 'email name',
    redirectURI: 'https://macosicons.com/redirect',
    usePopup: true,
  })

  try {
    const data = await AppleID.auth.signIn()
    logIn(null, data)
  } catch (error) {
    console.error(error)
  }
}

async function checkOldAccount(step, skipStep = false) {
  isLoading.value = true
  const userEmail = userInfo.email

  try {
    let findUserResponse = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/auth/doesAccountExist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
    findUserResponse = await findUserResponse.json()
    let accountExists = findUserResponse.accountExists

    if (skipStep) {
      return accountExists
    }

    if (accountExists) {
      userInfo.hasLoggedIn = true
      userInfo.newAccount = false
    } else {
      userInfo.hasLoggedIn = false
      userInfo.newAccount = true
    }

    userInfo.step = step
    isLoading.value = false

  } catch (error) {
    console.error("Error: ", error)
    isLoading.value = false
  }
}

async function signUp(step) {
  try {
    isLoading.value = true

    const userExists = await checkOldAccount(2, true)
    if (userExists) {
      userInfo.problems.usernameExists = true
    } else {
      userInfo.problems.usernameExists = false
    }

    let userRes = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/auth/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        username: userInfo.username,
        nameToShow: userInfo.nameToShow,
        password: userInfo.password
      })
    })
    await userRes.json()

    const user = await Parse.User.logIn(userInfo.username, userInfo.password)
    setUser(user)
    userInfo.step = 3
    isLoading.value = false

  } catch (error) {
    isLoading.value = false
    if (error.code === 202) {
      showToast({ id: "toastMessage", message: "Username already in use", variant: "error" })
    }
    if (error.code === 142) {
      userInfo.problems.passNotSecure = true
      showToast({ id: "toastMessage", message: "Password must be more secure", variant: "error" })
    }
    console.error('Parse Error signing up:', error)
  }
}

async function logIn(step, appleData) {
  isLoading.value = true

  if (appleData) {
    const { authorization, user } = appleData
    const parseJwt = (token) => {
      try { return JSON.parse(atob(token.split('.')[1])) }
      catch (e) { return null }
    }

    const decoded = parseJwt(authorization.id_token)
    if (!decoded || !decoded.sub) {
      console.error("Invalid Apple ID token")
      isLoading.value = false
      return
    }

    try {
      const loggedInUser = await Parse.User.logInWith('apple', {
        authData: { id: decoded.sub, token: authorization.id_token }
      })

      if (user) {
        if (user.name) loggedInUser.set("nameToShow", user.name.firstName + " " + user.name.lastName)
        if (user.email) {
          loggedInUser.set("email", user.email)
          loggedInUser.set("username", user.email)
        }
        await loggedInUser.save()
      }

      setUser(loggedInUser)
      isLoading.value = false
      isOpen.value = false
    } catch (e) {
      console.error(e)
      isLoading.value = false
      showToast({ id: "toastMessage", message: "Error logging in with Apple", variant: "error" })
    }
    return
  }

  try {
    const user = await Parse.User.logIn(userInfo.email, userInfo.password)
    setUser(user)
    isLoading.value = false
    isOpen.value = false
    userInfo.step = step
  } catch (e) {
    console.error("error logging in: ", e)
    isLoading.value = false

    if (e.code === 101) {
      showToast({ id: "toastMessage", message: "Invalid password, try again", variant: "error" })
    } else if (e.code === 201) {
      showToast({ id: "toastMessage", message: "Password cannot be empty", variant: "error" })
    }
  }
}

async function resetPassword() {
  const userEmail = userInfo.email

  if (isReset.value) {
    isLoading.value = true
    isReset.value = false
    showResetPassword.value = false

    Parse.User.requestPasswordReset(userEmail).then(() => {
      showToast({ id: "toastMessage", message: "Check your email", variant: "success" })
    })

    Parse.Cloud.run("firstTimeUser", { email: userEmail }).then(() => {
      userInfo.passwordResetSent = true
      isLoading.value = false
    }).catch((error) => {
      console.error("firstTimeUser error: ", error)
    })
  } else {
    showResetPassword.value = true
    isReset.value = true
  }
}

onMounted(async () => {
  const currentUser = Parse.User.current()
  if (currentUser) {
    try {
      const query = new Parse.Query(Parse.User)
      const user = await query.get(currentUser.id)
      setUser(user)
    } catch (error) {
      handleParseError(error)
    }
  }
})
</script>
