<script setup>
import SearchBar from '../components/SearchBar.vue'
import Results from '../components/Querecipe.vue'
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();
</script>

<template>
  <div>
    <div>
      We try to find all posts that have at least one tag or at least one matching keyword. Results are NOT sorted
      by recipe post score. Results are sorted by most matching tags, then most matching key words. If a ZipCode 
      is provided, then only posts from a user with a matching ZipCode will be shown. A ZipCode can only be put into the
      ZipCode bar that appears after clicking the location marker icon (next to the tags icon).
    </div>
    <SearchBar />
    <div v-if="searchStore.results.length==0">
      <h1>Looks Like We Couldn’t Find Anything</h1>
      <h1>Try Modifying Your Search</h1>
    </div>
    <div v-else>
      <v-container fluid>
        <Results 
          v-for="result in searchStore.results"
          :key="result.id"
          :obj="result"
          :width="'1200px'"
        ></Results>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
