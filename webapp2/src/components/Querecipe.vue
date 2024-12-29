<script>
import axios from 'axios';

export default {
  props: ['obj', 'width', 'height'],
  data() {
    return {
      tags: [],
    };
  },
  mounted() {
    this.getTags();
  },
  methods: {
    getTags() {
      axios.get(`/api/recipes/${this.obj.id}/tags`)
        .then((response) => {
          this.tags = response.data.tags;
          this.tags = JSON.parse(this.tags);
        })
        .catch((error) => {
          console.error('Error occurred:', error);
        });
    },
  },
};
</script>


<template>
  <router-link
    :to="{
      name: 'singleRecipe',
      params: {
        id: obj.id
      }
    }"
  >
    <v-card
      class="pa-4"
      flat
      :height="height"
      :width="width"
      color="black"
      opacity="0.5"
    >
      <div>
        {{ obj.title }}
      </div>
      <div class="text-caption">{{ obj.description }}</div>
      <img
        :src="obj.fileName"
        alt="No Image"
        style="object-fit: contain;"
        width="200"
        height="200"
      />
      <div v-if="obj.user != null">
        ZipCode: {{ obj.user.zipCode }}
      </div>
      <div v-if="obj.user != null">
        By: {{ obj.user.firstName }} {{ obj.user.lastName }}
      </div>
        <div>Tags:</div>
        <div>
          <v-chip v-for="(tag, index) in tags" :key="index">
            <strong>{{ tag }}</strong>&nbsp;
          </v-chip>
        </div>
    </v-card>
  </router-link>
</template>