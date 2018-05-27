<template>
  <div>
    <h4>
      <router-link to="/">Home</router-link> > Login
    </h4>
    <p v-if="isRedirected">
      You need to log in first.
    </p>
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input id="email" v-model="email">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password">
      <button type="submit">Log in</button>
      <span>or</span>
      <router-link to="/signup">Sign up</router-link>   
      <div class="messages">         
        <p v-if="loginError" class="error">{{loginError}}</p>
        <p v-if="isProcessing">Processing...</p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    isRedirected() {
      return this.$route.query.redirect;
    },
    loginError() {
      return this.$store.state.loginError;
    },
    isProcessing() {
      return this.$store.state.isProcessing;
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>

<style scoped>
h4 {
  text-align: center;
  margin-bottom: 2em;
}

.messages {
  margin-top: 1em;
}

.error {
  color: red;
}

label {
  margin: 0;
}

input {
  display: block;
  margin-bottom: 10px;
}
</style>
