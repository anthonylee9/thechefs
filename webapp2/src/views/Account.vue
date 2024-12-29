<script setup>
    import { onMounted, reactive } from 'vue';
    import { useRecipesStore } from '@/stores/recipes';
    import { useRatingsStore } from '@/stores/ratings';
    import { useUserStore } from '@/stores/user';
    import { storeToRefs } from 'pinia';
    //import { SvgIcon } from '@jamescoyle/vue-icon';
    //import { mdiDotsVertical } from '@mdi/js';


    const userStore = useUserStore();
    const recipesStore = useRecipesStore();
    const ratingsStore = useRatingsStore();

    const state = reactive({
        score: 0,
        description: '',
        showEditAccountDialog: false, // Popup for Editing Account details.
        showConfirmDeleteDialog: false, // Popup for confirming delete Account request. 
        showDeletePostDialog: false,
        firstName: '',
        lastName: '',
        zipCode: '',
        email: '',
        id: 0,
        showFollowersDialog: false,
        showFollowingDialog: false,
        followerCount: 8, // TODO Change this number
        followingCount: 20, // TODO Change this number

    })

    onMounted(async () => {
      await userStore.getUser(); // show user first while loading recipes

      state.firstName = userStore.currentUser[0].firstName;
      state.lastName = userStore.currentUser[0].lastName;
      state.zipCode = userStore.currentUser[0].zipCode;
      state.email = userStore.currentUser[0].email;
      state.id = userStore.currentUser[0].id;
      await recipesStore.loadRecipes();

      for (const recipe of recipesStore.recipes) {
        await ratingsStore.getRatings(recipe.recipe_id);
      }

      await ratingsStore.getUserRatings();
      await userStore.getAllFollowers(userStore.currentUser[0].id);
      await userStore.getAllFollowing(userStore.currentUser[0].id);
    });

    function openEditAccountDialog() {
      console.log("Opened edit dialog.");
      state.showEditAccountDialog = true;
    }


    async function saveAccountInfo() {
      console.log("Changes to account information saved.")
      userStore.currentUser[0].firstName = state.firstName;
      userStore.currentUser[0].lastName = state.lastName;
      userStore.currentUser[0].zipCode = state.zipCode;
      userStore.currentUser[0].email = state.email;
      
      if (await userStore.isEmailRegistered(state.email)) {
        if (userStore.duplicateEmailUser.id == userStore.currentUser[0].id) {
          userStore.saveEdit(userStore.currentUser[0]);
        }
        else {
          alert("That email is taken, try another one");
        }
      }
      else {
        userStore.saveEdit(userStore.currentUser[0]);
      }
      state.showEditAccountDialog = false;
      // TODO need to tie to backend. Will be a put instead of a post.
    }



    function askConfirmationToDeleteAccount(){
      console.log("Popup opened: asking confirmation to delete account.")
      state.showConfirmDeleteDialog = true;
    }

    async function deleteAccount(){
      // TODO Actually Delete Account (api call)
      state.showConfirmDeleteDialog = false;
      state.showEditAccountDialog = false;
      for (const recipe of recipesStore.recipes) {
        await deleteRecipe(recipe, recipe.recipe_id);
      }
      for (const rating of ratingsStore.userRatings) {
        await deleteRating(rating);
      }
      await userStore.deleteUserEvents(state.id);
      await userStore.deleteFollows(state.id);
      await userStore.deleteUser(state.id);
      userStore.loggedIn = false;
      alert("Account successfully deleted.");
      window.location.reload();
    }

    function abortDelete(){
      console.log("User decided not to delete account.")
      state.showConfirmDeleteDialog = false;
    }


    function openDeletePostDialog(){
      console.log("Popup opened: asking confirmation to delete account.")
      state.showDeletePostDialog = true;
    }


    function abortDeletePost(){
      console.log("Post not deleted.")
      state.showDeletePostDialog = false;
    }


    function postReview(recipeID, recipeTitle) {
      const {score, description} = state;
      if (isNaN(score) || score > 5 || score < 0) {
        alert("Score Value Invalid, Try Again. 0-5 only.");
      }
      else {
        ratingsStore.postRating({score, description, recipeID, recipeTitle}).then((error) => {
          if (!error) {
            console.log("Review Posted");
            alert("Review Posted, Refresh Page to See");
          }
        });
      }
    }


    function deleteRecipe(recipe, recipeID) {
      deleteRatings(recipeID);
      recipesStore.deleteRecipe(recipe).then((error) => {
        if (!error) {
          console.log("Recipe Deleted");
          alert("Recipe Deleted Successfully");
          refreshPage();
        }
        else {
          alert("Failed to Delete Recipe");
        }
      })
    }

    function deleteRatings(recipeID) {
      ratingsStore.deleteRatings(recipeID).then((error) => {
        if (!error) {
          console.log("Ratings Deleted");
        }
      })
    }

    function deleteRating(rating) {
      ratingsStore.deleteRating(rating).then((error) => {
        if (!error) {
          console.log("Rating Deleted");
        }
      })
    }

    function toggleFollowers(){
      state.showFollowersDialog = true;
      // userStore.getAllFollowers();
    }

    function toggleFollowing(){
      state.showFollowingDialog = true;
    }
  
    function closeScoreChecker() {
      state.invalidScore = false;
    }

    function closeReviewPosted() {
      state.reviewPosted = false;
    }

</script>
    
<template>   
  <main>
    <div>
      <!--<img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600"></img>-->
      <h1>PROFILE</h1>
      <div v-if="userStore.currentUser">
        <ul class="pfInfo">
          <p>First Name: {{ userStore.currentUser[0].firstName }} </p>
          <p>Last Name: {{ userStore.currentUser[0].lastName }} </p>
          <p>Email: {{ userStore.currentUser[0].email }}</p>
          <p>ZipCode: {{ userStore.currentUser[0].zipCode }}</p>
        </ul>  
      </div>
    </div>
    <!-- TODO HTML img tag of profile pic -->
    <!-- This button (and pop up) lets user edit their account. -->
    <v-btn class="editAccBtn" id="editAccount" @click="openEditAccountDialog">Edit Account</v-btn>
          <v-dialog v-model="state.showEditAccountDialog"  width="400">
            <v-card>
              <v-card-text>
                <v-form class="mt-2">
                  <v-text-field label="First Name" type="firstName" v-model="state.firstName"></v-text-field>
                  <v-text-field label="Last Name" type="lastName" v-model="state.lastName"></v-text-field>
                  <v-text-field label="Email address" type="email" v-model="state.email"></v-text-field>
                  <v-text-field label="ZipCode" type="zipcode" v-model="state.zipCode"></v-text-field>
                  <p>Delete my account.</p> 
                  <!-- This button (and pop up) gives user a chance to confirm account deletion. -->
                  <v-btn @click="askConfirmationToDeleteAccount">Delete
                    <v-dialog v-model="state.showConfirmDeleteDialog" width="400">
                      <v-card>
                        <v-card-text>
                          <v-form class="mt-2">
                            <p>Are you sure you want to delete your account?</p>
                            <v-btn @click="deleteAccount">Delete</v-btn>
                            <v-btn @click="abortDelete">NOOOOOO</v-btn>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-btn> 
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-row-reverse ma-2">
                <!-- This button lets user save changes. -->
                <v-btn color="primary" @click="saveAccountInfo()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- This shows followers and followed accounts.-->
          <v-btn @click="toggleFollowers">{{ userStore.followers?.length }} Followers</v-btn>
            <v-dialog v-model="state.showFollowersDialog" max-width="500px">
              <v-card class="popup">
                <v-card-text>
                  <ul>
                    <li v-for="follow in userStore.followers" :key="follow.userWhoIsFollowing.id">{{ follow.userWhoIsFollowing.firstName }} {{ follow.userWhoIsFollowing.lastName }}</li>
                  </ul>
                </v-card-text>
              </v-card>      
            </v-dialog>
          <v-btn @click="toggleFollowing">{{ userStore.following?.length }} Following</v-btn>
            <v-dialog v-model="state.showFollowingDialog" max-width="500px">
              <v-card class="popup">
                <v-card-text>
                  <ul>
                    <li v-for="follow in userStore.following" :key="follow.userBeingFollowed.id"> {{follow.userBeingFollowed.firstName}} {{ follow.userBeingFollowed.lastName }} </li>
                  </ul>
                </v-card-text>
              </v-card>      
            </v-dialog>

    <h1>The Recipes You've Posted</h1>
    <v-card class="mx-auto" min-width="1200" variant="outlined" v-for="recipe in recipesStore.recipes" :key="recipe.recipe_id">
        <v-alert density="compact" type="warning" icon="$warning" title="There was an issue getting your recipes" v-if="recipesStore.hasError">{{ recipesStore.error }}</v-alert>
        <v-card-item>
          <div>
            <div class="text-overline mb-1">
              <h1> {{ recipe.recipe_title }} </h1>
            </div>
            <div class="text-h6 mb-1">
              Description: {{recipe.recipe_description}}
            </div>
            <div class="text-h6 mb-1" v-if="recipe.recipe_videoLink">
              Video Link: {{recipe.recipe_videoLink}}
            </div>
            <div class="text-h6 mb-1" v-if="recipe.avgScore">
              Score: {{recipe.avgScore}}
            </div>
            <img :src="recipe.recipe_fileName" alt="No Image" style="object-fit: contain;" width="500" height="500"/>
            <v-card class="mx-auto" min-width="1200" variant="outlined" v-for="rating in ratingsStore.ratings[recipe.recipe_id]" :key="rating.id">
              <div class="text-h6 mb-1">
                Rating Score: {{rating.score}}
              </div>
              <div class="test-h6 mb-1" v-if="rating.description">
                Description: {{rating.description}}
              </div>
            </v-card>

            <div>
              <!-- ASKS CONFIRMATION TO DELETE RECIPE -->
              <v-btn>Delete recipe
                  <v-dialog activator="parent" width="400">
                    <v-card>
                  <v-card-text>
                    <v-form class="mt-2">
                      <p>Are you sure you want to delete this post?</p>
                      <v-btn @click="deleteRecipe(recipe, recipe.recipe_id)">Delete</v-btn>
                      <v-btn @click="abortDeletePost">NOOOOOO</v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
                  </v-dialog>
                </v-btn>
              <v-btn>Post Review
                <v-dialog activator="parent" width="400">
                  <v-card>
                    <v-card-text>
                      <v-form class="mt-2">
                        <v-text-field
                          label="Score (0-5)"
                          type="number"
                          min="0"
                          max="5"
                          step="0.5"
                          v-model="state.score"
                        ></v-text-field>
                        <v-text-field
                          label="Description"
                          type="text"
                          v-model="state.description">
                        </v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="d-flex flex-row-reverse ma-2">
                      <v-btn color="primary" @click="postReview(recipe.recipe_id, recipe.recipe_title)">Post Review</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </div>
          </div>
        </v-card-item>
    </v-card>

    <h1>The Ratings You've Posted</h1>
    <v-card class="mx-auto" min-width="1200" variant="outlined" v-for="rating in ratingsStore.userRatings" :key="rating.id">
      <div class="text-h6 mb-1">
        Associated Recipe: {{rating.associatedRecipeTitle}}
      </div>
      <div class="text-h6 mb-1">
        Rating Score: {{rating.score}}
      </div>
      <div class="test-h6 mb-1" v-if="rating.description">
        Description: {{rating.description}}
      </div>
      <v-btn @click="deleteRating(rating)">Delete Rating</v-btn>
    </v-card>
  </main>
</template>

<style scoped>

.content {
  min-height: 800px;
  padding: 0 0 2rem 4rem;
  display: flex;
  flex-direction: column;
}

.content h1 {
  font-size: 36px;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

.content ul {
  width: 50%;
  font-size: 18px;
  border: 2px solid rgb(200, 200, 200);
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
}

.content p {
  color: black;
  padding: 0.75rem;
}

.popup {
  background-color: rgba(0, 0, 0, 0.8); /* Opacity: 0.8 */
  color: white;
  border-radius: 5px;
}

.popup ul {
  list-style-type: none;
  padding: 0;
}

.popup li {
  margin-bottom: 10px;
}

.editAccountBtn {
  margin-left: 20px;
  width: 100px;
  height: 40px;
  font-size: 16px;
}

.header-left img {
  width: 80px;
  height: 80px;
  border-radius: 50;
  margin: 20px;
}

h2 {
  margin-right: 20px;
}

.pfInfo {
  border: 1px solid grey;
  padding: 10px;
}


.profile-info {
  display: flex;
  align-items: center;
  margin-left: 10%;
}

.profile-info img {
  width: 80px;
  height: 80px;
  border-radius: 50;
  margin: 20px;
}

.button-container {
  text-align: center;
}

.recipes-button {
  font-size: 24px;
  padding: 20px 40px;
  border-radius: 20px;
  border: none;
  background-color: white;
  margin: 20px;
  margin-bottom: 60px;
}

/* Layout for profile page */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.posts-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 90%;
  margin: 0 auto;
}

.posts-container img {
  width: 100%;
  height: 100%;
}

/* Layout for posts */
.post {
  width: calc(33.33% - 20px);
  margin: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  box-sizing: border-box;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-description {
  padding: 10px;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.post-text {
  font-size: 14px;
  color: #666666;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

nav {
  position: relative;
  background-color: white;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.menu {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 2rem;
}

.f {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-center a svg {
  width: 1.5rem;
  height: 1.5rem;
}

.pfp {
  border-radius: 50%;
  width: 6rem;
}

.preview .text {
  justify-content: flex;
}

main {
  padding: 2rem 1rem;
}

.preview {
  padding-left: 12rem;
}

#prev {
  width: 12rem;
}

</style>