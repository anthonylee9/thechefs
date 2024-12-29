import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';


export const useRecipesStore = defineStore('recipes', () => {
    const hasError = ref(false);
    const error = ref("");
    const recipes = ref([]);
    const recipe = ref();
    

    function loadRecipes() {
        return axios.get("/api/recipes").then(
            (response) => {
                recipes.value = response.data.recipes;
            },
            (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            }
        )
    }


    function getOneRecipe(recipeID) {
        return axios.get(`/api/recipes/${recipeID}`).then(
            (response) => {
                recipe.value = response.data.recipe;
            },
            (response) => {
                hasError.value = true;
                error.value = response.response.data.msg;
                return hasError;
            }

        )
    }


    function postRecipe({ title, description, videoLink, file, tags}) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('videoLink', videoLink);
        formData.append('uploaded_file', file);
        formData.append('tags', JSON.stringify(tags));

        
        return axios.post("/api/recipes", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(
        (response) => {
            console.log(response);
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function deleteRecipe(recipe) {
        const idx = recipes.value.indexOf(recipe);
        return axios.delete(`/api/recipes/${recipe.recipe_id}`).then(() => {
            recipes.value.splice(idx, 1);
        })
    }

    return { error, hasError, recipes, recipe, loadRecipes, getOneRecipe, postRecipe, deleteRecipe };
});