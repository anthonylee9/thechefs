<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { reactive } from 'vue';
  import { useSearchStore } from '@/stores/search';

  const store = useSearchStore();

  const state = reactive({
    dialog: false,
  });

  function clearMessage () {
    store.message='';
  }

  function clearZip () {
    store.zip='';
  }

  function clearTag () {
    store.currentTag='';
  }

  function goSearch () {
    store.loadResults();
  }

</script>


<template>
<v-card class="searchBar"
    flat
    height="170px"
    color="white"
    opacity=0.5
  >
    <v-toolbar 
      round
      floating
      color="white"
    >
      <v-text-field class="searchField"
        hide-details
        prepend-inner-icon="mdi-magnify"
        single-line

        v-model="store.message"
        variant="filled"
        clear-icon="mdi-close-circle"
        clearable
        label="Search"
        type="text"
        @click:clear="clearMessage"
        @keydown.enter="goSearch"
      ></v-text-field>


        <v-btn class="search" icon color="gray" dark to="/search" @click="goSearch">
          <v-icon>mdi-send-variant</v-icon>
        </v-btn>

        <v-btn icon color="gray" dark @click="store.showZip = !store.showZip">
          <v-icon>{{ store.showZip ? 'mdi-map-marker': 'mdi-map-marker-off'}}</v-icon>
        </v-btn>

      <v-btn icon color="gray" dark @click="state.dialog = true">
        <v-icon>mdi-tag</v-icon>
        <v-dialog
        v-model="state.dialog"
        width="600">
          <div>
            <v-card color="black">
              <v-text-field
                v-model="store.currentTag"
                label="Add a Tag (Min: 0, Max: 10)"
                @keyup.enter="store.addTag()"
                dense
                clearable
                clear-icon="mdi-close-circle"
                @click:clear="clearTag"
              ></v-text-field>
              <v-chip
                v-for="(tag, index) in store.goodTags"
                :key="index"
                label
                close
                @click:close="store.removeTag(index)"
              >
                <strong>{{ tag }}</strong>&nbsp;
                <v-icon small @click.stop="store.removeTag(index)">mdi-close</v-icon>
              </v-chip>
            </v-card>
          </div>
        </v-dialog>
      </v-btn>
    </v-toolbar>
        <v-text-field v-if="store.showZip" 
          hide-details
          prepend-inner-icon="mdi-magnify"
          single-line

          v-model="store.zip"
          variant="filled"
          clear-icon="mdi-close-circle"
          clearable
          label="Zipcode"
          counter
          maxlength="5"
          type="number"
          @click:clear="clearZip"
          @keyup.enter="goSearch"
        ></v-text-field>
  </v-card>
</template>


<style>
.search {
  margin-left: 10px;
}
.searchBar {
  border: 3px solid rgb(200,200,200);
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: none;
}
.searchField {
  width: 700px;
}
</style>