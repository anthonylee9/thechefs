import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';


export const useRatingsStore = defineStore('ratings', () => {
    const hasError = ref(false);
    const error = ref("");
    const ratings = ref([[]]);
    const userRatings = ref([]);


    function postRating({ score, description, recipeID, recipeTitle}) {
        return axios.post(`/api/recipes/${recipeID}/ratings`, { score, description, recipeID, recipeTitle}).then(
        (response) => {
            console.log(response);
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function getRatings(recipeID) {
        return axios.get(`/api/recipes/${recipeID}/ratings`).then(
            (response) => {
                ratings.value[recipeID] = response.data.ratings;
            },
            (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            }
        )
    }

    function getUserRatings() {
        return axios.get("/api/ratings").then(
            (response) => {
                userRatings.value = response.data.ratings;
            },
            (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            }
        )
    }



    function deleteRatings(recipeID) {
        return axios.delete(`/api/recipes/${recipeID}/ratings`).then(() => {
        })
    }

    function deleteRating(rating) {
        const idx = userRatings.value.indexOf(rating);
        return axios.delete(`/api/ratings/${rating.id}`).then(() => {
            userRatings.value.splice(idx, 1);
        })
    }

    
    return { error, hasError, ratings, userRatings, postRating, deleteRatings, deleteRating, getRatings, getUserRatings};
});