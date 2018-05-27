<template>
  <div>
    <h4>
       <router-link to="/">Home</router-link> > Signup  
    </h4>
    <form @submit.prevent="signup">
      <label for="firstName">First name</label>
      <input id="firstName" v-model="firstName" placeholder="Mark">
      <label for="lastName">Last name</label>
      <input id="lastName" v-model="lastName" placeholder="Twain">
      <label for="email">Email</label>
      <input id="email" v-model="email" placeholder="marktwain@example.com">
      <label for="password">Password*</label>
      <input id="password" v-model="password" placeholder="TomSawyer1876" type="password">
      <button type="submit">Sign up</button>
      <span>or</span>
      <router-link to="/login">Log in</router-link> 
      <small>*(8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username)</small>           
      <div class="messages">
        <p v-if="isProcessing">Processing...</p>
        <p v-if="isRegistered" class="success">Account registered successfully!</p>
        <p v-if="signupError" class="error">{{signupError}}</p>
      </div>
    </form>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
  },
  computed: {
    signupError() {
      return this.$store.state.signupError;
    },
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    isRegistered() {
      return this.$store.state.isRegistered;
    }
  },
  methods: {
    signup() {
      this.$store.dispatch("signup", {
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.email,
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

.success {
  color: limegreen;
}

label {
  margin: 0;
}

small {
  display: block;
  margin-top: 10px;
}

input {
  display: block;
  margin-bottom: 10px;
}
</style>
