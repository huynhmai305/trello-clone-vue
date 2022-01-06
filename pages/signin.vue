<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4" align="center">
      <v-card class="elevation-4 text-left">
        <v-card-title class="fancy-title justify-center align-center">
          Mello
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              label="Email"
              name="email"
              prepend-icon="mdi-account"
              type="text"
              v-model="auth.email"
              autocomplete="off"
            ></v-text-field>
            <v-text-field
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="auth.password"
              autocomplete="off"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="text-center">
          <v-btn class="login-button" depressed large @click="login">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-snackbar :timeout="4000" v-model="snackbar" absolute bottom center>
        {{ snackbarText }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "signin",
  data() {
    return {
      snackbar: false,
      snackbarText: "No error message",
      auth: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      let that = this;
      this.$fire.auth
        .signInWithEmailAndPassword(this.auth.email, this.auth.password)
        .then((result) => {
          // signed in
          $nuxt.$router.push("/");
        })
        .catch((err) => {
          that.snackbarText = err.message;
          that.snackbar = true;
        });
    },
  },
};
</script>

<style></style>
