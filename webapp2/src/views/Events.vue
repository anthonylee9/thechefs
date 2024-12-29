<script setup>
import { useEventStore } from '@/stores/event';
import { onMounted } from 'vue';
const store = useEventStore();


onMounted(() => {
  store.getEvent();
  store.getEventInZip();
});

</script>
<template>
  <div class="content">
    <v-btn class="postbutton" to="/createevent">Create Event</v-btn>
    <div>
      <v-card class="event" variant="outlined" v-for="event in store.eventsListZip" :key="event.id">
        <v-card-item>
          <div>
            <div>
              <h1> Location: </h1>
              {{ event.location }} {{ event.zipCode }}
            </div>
            <div>
              {{ event.title }}
            </div>
            <div> Details: {{ event.description }} </div>
          </div>
        </v-card-item>
      </v-card>
    </div>
    <div>
      <v-card class="event" variant="outlined" v-for="event in store.eventsList" :key="event.id">
        <v-card-item>
          <div>
            <div>
              <h1> Location: </h1>
              {{ event.location }} {{ event.zipCode }}
            </div>
            <div>
              {{ event.title }}
            </div>
            <div> Details: {{ event.description }} </div>
          </div>
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>


<style scoped>
.content {
  min-height: 60rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.postbutton {
  background-color: rgb(245, 185, 113);
  color: white;
  height: 70px;
  width: 210px;
  margin: 2rem 0 0 0;
  font-size: 20px;
  border-radius: 14px;
}

.event {
  margin: 4rem 0 4rem 0;
  padding: 1.5rem 1.5rem 2rem 1.5rem;
  width: 700px;
  border-radius: 14px;
  border: 3px solid rgb(200, 200, 200);
  background-color: white;
}

.event h1 {
  padding-bottom: 10px;
}
</style>
