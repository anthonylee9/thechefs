<template>
    <div class="image-panel">
      <v-btn>Button 1</v-btn>
      <v-btn>Button 2</v-btn>
      <v-btn>Button 3</v-btn>
    </div>
  </template>
  
  <script>
  export default {
    name: "ImagePanel",
  };
  </script>
  
  <style scoped>
  .image-panel {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .image-panel v-btn {
    margin-right: 10px;
  }
  </style>
  