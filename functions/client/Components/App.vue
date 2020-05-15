<template>
  <div id="app">
    <div class="root container">
      <h2>App here</h2>
      <Child />
    </div>
  </div>
</template>

<script>
import Child from "./Child";
export default {
  name: "App",
  components: {
    Child,
  },
  methods: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  min-height: 300px;
  color: #333;

  .container {
    border: 1px dotted red;
    margin: 20px auto;
  }
  .root {
    min-width: 600px;
    min-height: 600px;
  }
}
</style>
