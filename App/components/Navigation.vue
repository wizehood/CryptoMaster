<template>
    <div class="row">
      <div v-if="loggedIn" class="col">
        <router-link to="/logout">Logout</router-link> 
        <router-link to="/purchases">Purchases</router-link> 
      </div>
      <div v-else class="col">
        <router-link to="/signup">Signup</router-link> 
        <router-link to="/login">Login</router-link> 
      </div>
    </div>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  }
};
</script>

<style scoped>
a {
  float: right;
  margin-right: 1em;
}
</style>


