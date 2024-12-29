<script setup>
    import { onMounted, reactive } from 'vue';
    import { useRecipesStore } from '@/stores/recipes';
    import { useRatingsStore } from '@/stores/ratings';
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/user';

    const route = useRoute();
    const recipesStore = useRecipesStore();
    const ratingsStore = useRatingsStore();
    const userStore = useUserStore();

    const state = reactive({
        score: 0,
        description: '',
        following: false,
    });

    onMounted(async () => {
      const recipeID = route.params.id;
      await recipesStore.getOneRecipe(recipeID);
      await userStore.getWhoPosted(recipesStore.recipe.recipe_userId);
      await ratingsStore.getRatings(recipesStore.recipe.recipe_id);
      if (userStore.currentUser){
        await userStore.getAllFollowing(userStore.currentUser[0].id);
        for (const follow of userStore.following) {
        if (follow.userBeingFollowed.id == recipesStore.recipe.recipe_userId) {
          state.following = true;
        }
      }
      }
    });

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

    function followUser(){
      state.following = !state.following;
      //userStore.followUser(37);

      userStore.followUser(recipesStore.recipe.recipe_userId, userStore.currentUser[0].id);
    }

    function unfollowUser(){
      // TODO Pass in actual user id associated with recipe
      state.following = !state.following;
      userStore.unfollowUser(recipesStore.recipe.recipe_userId, userStore.currentUser[0].id);
    }

</script>

<template>
  <main>
    <v-card class="mx-auto" min-width="1200" variant="outlined" v-if="recipesStore.recipe">
        <v-alert density="compact" type="warning" icon="$warning" title="There was an issue getting your recipes" v-if="recipesStore.hasError">{{ recipesStore.error }}</v-alert>
        <v-card-item>
          <div>
            <div class="text-overline mb-1">
              <h1> {{ recipesStore.recipe.recipe_title }} </h1>
            </div>
            <div class="text-h6 mb-1">
              Description: {{recipesStore.recipe.recipe_description}}
            </div>
            <div class="text-h6 mb-1" v-if="userStore.recipePoster">
              Author:
               {{ userStore.recipePoster[0].firstName }}
               {{ userStore.recipePoster[0].lastName }}
              <v-btn @click="followUser" v-if = "userStore.currentUser && !state.following && (recipesStore.recipe.recipe_userId != userStore.currentUser[0].id)">FOLLOW USER</v-btn>
              <v-btn @click="unfollowUser" v-if = state.following>UNFOLLOW USER</v-btn>
            </div>
            
            

            <div class="text-h6 mb-1" v-if="recipesStore.recipe.recipe_videoLink">
              Video Link: {{recipesStore.recipe.recipe_videoLink}}
            </div>
            <div class="text-h6 mb-1" v-if="recipesStore.recipe.avgScore">
              Score: {{recipesStore.recipe.avgScore}}
            </div>
            <img :src="recipesStore.recipe.recipe_fileName" alt="No Image" style="object-fit: contain;" width="500" height="500"/>
            <v-card class="mx-auto" min-width="1200" variant="outlined" v-for="rating in ratingsStore.ratings[recipesStore.recipe.recipe_id]" :key="rating.id">
              <div class="text-h6 mb-1">
                Rating Score: {{rating.score}}
              </div>
              <div class="test-h6 mb-1" v-if="rating.description">
                Description: {{rating.description}}
              </div>
            </v-card>
            <div>
              <v-btn v-if="userStore.loggedIn">Post Review
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
                      <v-btn color="primary" @click="postReview(recipesStore.recipe.recipe_id, recipesStore.recipe.recipe_title)">Post Review</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </div>
          </div>
        </v-card-item>
    </v-card>
  </main>
</template>