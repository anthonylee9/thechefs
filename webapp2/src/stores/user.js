import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// Store goes to API, gets current user, then sticks it to a variable. 

export const useUserStore = defineStore('user', () => {

    const loggedIn = ref(false);
    const hasError = ref(false);
    const error = ref("");
    const currentUser = ref();
    const recipePoster = ref();
    const followers = ref([]);
    const following = ref([]);
    const duplicateEmailUser = ref();

    
    function login({ email, password }) {
        console.log("login")
        return axios.post("/api/login", { email, password }).then(
        (response) => {
            console.log(response);
            loggedIn.value = true;
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function signup({firstName, lastName, email, password, zipCode}) {
        return axios.post("/api/signup", {firstName, lastName, email, password, zipCode}).then(
        (response) => {
            console.log(response);
            loggedIn.value = true;
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }


    function logout() {
        return axios.get("/api/logout").then(() => {
            currentUser.value = null;   // Clear cache
            recipePoster.value = null;
            followers.value = [];
            following.value = [];
            loggedIn.value = false;
        });
    }

    function deleteAccount() {
        return axios.get("/api/logout").then(() => {

            loggedIn.value = false;
        });
    }


    function ping() {
        return axios.get("/api/ping").then(() => {
            loggedIn.value = true;
        }, () => {
            loggedIn.value = false;
        });
    }

    function getUser() {
        return axios.get("/api/user").then(
        (response) => {
            currentUser.value=response.data.user;
            loggedIn.value = true;
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function getWhoPosted(userID) {
        return axios.get(`/api/whoPosted/${userID}`).then(
            (response) => {
                recipePoster.value = response.data.user;
            }, (response => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            })
        )
    }

    function saveEdit({id, firstName, lastName, email, zipCode}) {
        console.log("in save edit, id is:", id);
        return axios.put("/api/user", {id, firstName, lastName, email, zipCode}).then(
        (response) => {
            console.log(response);
            loggedIn.value = true;
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function isEmailRegistered(email) {
        return axios.get(`/api/check-email?email=${email}`).then((response) => {
          const emailRegistered  = response.data.emailRegistered;
          const user = response.data.user;
          duplicateEmailUser.value = user;
          return emailRegistered;
        });
      }
    
    function deleteUser(id) {
        return axios.delete(`/api/user/${id}`).then(() => {
            console.log("user deleted in webapp2 user store")
        })
    }


    function followUser(userBeingFollowedID, userWhoIsFollowingID){
        return axios.post("/api/follow", {userBeingFollowedID, userWhoIsFollowingID}).then(
            (response) => {
                console.log(response);
            }, (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            });
    }


    function unfollowUser(userBeingFollowedID, userWhoIsFollowingID){
        //console.log("unfollowing user", userBeingFollowedID)
        return axios.post("/api/unfollow", {userBeingFollowedID, userWhoIsFollowingID}).then(
            (response) => {
                console.log(response);
            }, (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            });
    }


    function getIsFollowing(userId){
        //return axios.get(`/api/user/follow/${userId}`).then(() => {
            // TODO Return true or false if we are following this account
            // TODO make API 
        //})
    }


    function getAllFollowers(userID){
        console.log("requesting users in user store");
        return axios.get(`/api/user/${userID}/followers`).then(
            // TODO pass information back
            (response) => {
                followers.value = response.data.follows;
            }, (response) => {
                console.log("GOT ERROR RESPONSE GETALLFOLLOWERS",response.response.data.msg);

                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            })
    }

    function getAllFollowing(userID){
        console.log("requesting users in user store");
        return axios.get(`/api/user/${userID}/following`).then(
            // TODO pass information back
            (response) => {
                following.value = response.data.follows;
            }, (response) => {
                console.log("GOT ERROR RESPONSE GETALLFOLLOWERS",response.response.data.msg);

                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            })
    }

    function deleteUserEvents(userID) {
        return axios.delete(`/api/user/${userID}/events`).then(() => {
        })
    }

    function deleteFollows(userID) {
        return axios.delete(`/api/user/${userID}/delete`).then(() => {
        })
    }

  

    return { loggedIn, error, hasError, currentUser, followers, following, recipePoster, duplicateEmailUser,
        login, signup, isEmailRegistered, logout, ping, getUser, getWhoPosted, saveEdit, deleteUser, followUser, unfollowUser, getIsFollowing, getAllFollowers, getAllFollowing, deleteUserEvents, deleteFollows};


});