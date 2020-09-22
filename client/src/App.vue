<template>
  <div id="app">
    <Game />
    <modal
      v-show="isModalVisible"
      @close="closeModal"
    />
  </div>
</template>

<script>
import modal from "./components/modal.vue";
import Game from "./components/Game.vue";

export default {
  name: "App",
  components: {
    Game,
    modal
  },
  data() {
    return {
      isModalVisible: false
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  }
};
</script>

<style>
body {
  background-color: #70c1b3;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  text-align: center;
}
</style>
