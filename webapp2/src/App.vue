<script setup>
// original
// import router from './router/index.js'
import { useRouter, useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
import { reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRatingsStore } from './stores/ratings';

const routing = useRouter()
const store = useUserStore();
// new line

const state = reactive({    // Kind of like a class- info we want to keep around.
  loginDialog: false,
  signupDialog: false,
  error: '',
  hasError: false,
  firstName: '',
  lastName: '',
  email: '',
  zipCode: '',
  password: '',
  showLogin: true,
  isButtonDisabled: false,
  searchQuery: '',
  isMenuOpen: false,
});

function login() {
  const { email, password } = state;
  store.login({ email, password }).then((error) => {
    if (!error) {
      state.loginDialog = false;
      store.loggedIn = true;
      console.log('Logged in');
      window.location.reload();
    }
  });
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function signup() {
  const { firstName, lastName, email, zipCode, password } = state;
  if (firstName.trim() === '' || lastName.trim() === '') {
    alert('Please enter a valid first name and last name.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (password.length < 8) {
    alert('Please enter a password with at least 8 characters.');
    return;
  }
  
  if (zipCode.length != 5) {
    alert('Zip Code is not five digits');
    return;
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLowerCase || !hasUpperCase || !hasNumber) {
    alert('Password should contain at least one lowercase letter, one uppercase letter, and one number.');
    return;
  }

  try {
    const isEmailRegistered = await store.isEmailRegistered(email);
    if (isEmailRegistered) {
      alert('Email already registered.');
      return;
    }

    await store.signup({ firstName, lastName, email, zipCode, password });
    state.signupDialog = false;
    console.log('Signed up');
    await store.login({ email, password });
    window.location.reload();
  } catch (error) {
    // Handle error from API call
    console.error(error);
  }
}

function switchToSignup() {
  state.loginDialog = false;
  state.signupDialog = true;
}

function switchToLogin() {
  state.loginDialog = true;
  state.signupDialog = false;
}

function logOut() {
  store.logout().then((error) => {
    if (!error) {
      store.loggedIn = false;
      console.log('Logged out');
      navigateTo('/')
    }
  });
}

function toggleMenu(){
  state.isMenuOpen = !state.isMenuOpen;
}

function navigateTo(route) {
  if (!store.loggedIn && (route  != '/') && (route != '/recipes')){
    state.loginDialog = true;
    return;
  }
  // original
  // router.push(route);
  console.log(route);
  routing.push(route);
  toggleMenu(); 
}

  onMounted(() => {
    store.getUser();
  });

</script>


<template>
  <head>
    <!-- Other meta tags, stylesheets, etc. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Pacifico&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Mandali&display=swap" rel="stylesheet">
  </head>

  <div class="header">
    <div class="topBar">
      <div class="barLeft">
        <v-btn class="hamburger" @click="toggleMenu" icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <h1 class="logo" @click="navigateTo('/')">FlavorTown.com</h1>
      </div>

      <div class="menu" :class="{ 'menu-open': state.isMenuOpen }">
        <button class="close-button" @click="toggleMenu">&times;</button>
        <ul>
          <h1 class="menuBtn" @click="navigateTo('/')"><a>Home</a></h1>
          <h1 class="menuBtn" @click="navigateTo('/events')"><a>Events</a></h1>
          <h1 class="menuBtn" @click="navigateTo('/postrecipes')"><a>Post Recipes</a></h1>
          <h1 class="menuBtn" @click="navigateTo('/account')"><a>My Account</a></h1>
        </ul>
      </div>

      <div class="buttonsContainer">
        <v-btn class="signLogBtn" id="login" v-if=!store.loggedIn>Login
          <v-dialog v-model="state.loginDialog" activator="parent" width="400">
            <v-card>
              <v-card-text>
                <v-alert density="compact" type="warning" icon="$warning" title="There was an issue logging in."
                  v-if="store.hasError">{{ store.error }}</v-alert>
                <v-form class="mt-2">
                  <v-text-field label="Email address" type="email" v-model="state.email"></v-text-field>
                  <v-text-field label="Password" type="password" v-model="state.password">
                  </v-text-field>
                  <p>Don't have an account?</p> <v-btn @click="switchToSignup">Sign Up</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-row-reverse ma-2">
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-btn>
        <v-btn class="signLogBtn" id="signup" v-if=!store.loggedIn>Signup
          <v-dialog v-model="state.signupDialog" activator="parent" width="400">
            <v-card>
              <v-card-text>
                <v-alert density="compact" type="warning" icon="$warning" title="There was an issue signing up."
                  v-if="store.hasError">{{ store.error }}</v-alert>
                <v-form class="mt-2">
                  <!-- Make a checkbox. -->
                  <p>By signing up for FlavorTown.com, you are consenting to us using your location.</p> 
                  <v-text-field label="First Name" type="firstName" v-model="state.firstName"></v-text-field>
                  <v-text-field label="Last Name" type="lastName" v-model="state.lastName"></v-text-field>
                  <v-text-field label="Email address" type="email" v-model="state.email"></v-text-field>
                  <v-text-field label="ZipCode" type="zipcode" v-model="state.zipCode"></v-text-field>
                  <v-text-field label="Password" type="password" v-model="state.password">
                  </v-text-field>
                  <p>Already have an account?</p> <v-btn @click="switchToLogin">Log In</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-row-reverse ma-2">
                <v-btn color="primary" @click="signup">sign up</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn id="logout" v-if = store.loggedIn @click="logOut">Logout
        </v-btn>
      </div>
    </div>

    <div class="router">
      <router-view></router-view>
    </div>
  </div>

  <div class="bottomNav">
        <p class="copyright">© 2023 The Chefs</p>
  </div>
</template>



<style> 
li {
  color: white;
}

.logo {
  font-family: 'Pacifico', cursive;
  color: rgb(245, 185, 113);
  font-size: 40px;
  margin-left: 4px;
  cursor: pointer;
}

.barLeft {
  display: flex;
  align-items: center;
  /* Center the items vertically */
}

.hamburger {
  width: 20px;
  /* Adjust the width and height as needed */
  /* Add padding and box-sizing to adjust the size of the lines */
  margin: 20px;
  /* Add background color and other styles as desired */
  background-color: white;
  color: black;
  border: 2px solid rgb(200, 200, 200); /* Add this line to add a border */
  border-radius: 10%;
}

.menu {
  position:fixed;
  top: 0;
  left: 0;
  width: 20%;
  height: 100%;
  background-color: white;
  /* Adjust the background color as needed */
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 2;
  border-radius: 0px 10px 10px 0px;
}

.menu-open {
  transform: translateX(0);
}

.close-button {
  margin-left: 20px;
  border: none;
  background-color: transparent;
  font-size: 40px;
  cursor: pointer;
}

.menuBtn {
  margin: 16px 10px 20px 20%;
  cursor: pointer;
  font-size: 28px;
}

.signLogBtn {
  margin-left: 20px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  font-family: 'Mandali', sans-serif;
  font-weight: bold;

}

#login {
  background-color: rgb(245, 185, 113);
  color: white;
  height: 40px;
}

#logout {
  height: 40px;
  border: 2px solid rgb(200, 200, 200);
}

#signup {
  height: 40px;
  border: 2px solid rgb(200, 200, 200); /* Add this line to add a border */
}

.menu ul {
  list-style-type: none;
  padding: 0;
}

.menu li {
  margin-bottom: 20px;
}

.menu a {
  text-decoration: none;
  color: black;
}

.buttonsContainer {
  position: absolute;
  top: 20px;
  right: 20px;
}

.bottomNav {
  display: flex;
  height: 160px;
  font-size: 20px;
  background-color: #F5B971;
  color: white;
  justify-content: center;
  align-items: center;
}
</style>
