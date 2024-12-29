import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';


export const useEventStore = defineStore('event', () => {

    const hasError = ref(false);
    const error = ref("");
    
    const eventsList = ref([])
    const eventsListZip = ref([])

    function postEvent({ title, location, description, zipCode }) {
        return axios.post("/api/createevent", { title, location, description, zipCode }).then(
        (response) => {
            console.log(response);
        }, (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
        });
    }

    function getEvent() {
        return axios.get('/api/events').then(
          (response) => {
            console.log(response);
            eventsList.value = response.data.events;
            console.log("Success")
          },
          (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
          
          }
        );
      }

      function getEventInZip() {
        return axios.get('/api/eventszip').then(
          (response) => {
            console.log(response);
            eventsListZip.value = response.data.events;
            console.log("Success")
          },
          (response) => {
            hasError.value = true;
            error.value = response.response.data.msg;
            return hasError;
          
          }
        );
      }

      


    return {eventsList, eventsListZip, error, hasError, postEvent, getEvent, getEventInZip};

});


