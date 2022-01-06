import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - to-do",
    title: "to-do",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/styles.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/filters"],

  router: {
    middlewave: ["auth"],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyCVzygXmUnW1UcABZqWPtE0kBlhfZwxD7Q",
          authDomain: "mai-trello-vue.firebaseapp.com",
          projectId: "mai-trello-vue",
          storageBucket: "mai-trello-vue.appspot.com",
          messagingSenderId: "99119455761",
          appId: "1:99119455761:web:ed28a3c8f183cf7591dbb0",
          measurementId: "G-JQLSN23BFX",
        },
        services: {
          auth: {
            persistence: "local", // default
            initialize: {
              onAuthStateChangedAction: "onAuthStateChangedAction",
              subscribeManually: false,
            },
            ssr: false,
          },
          firestore: true,
          storage: true,
        },
      },
    ],
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    // theme: {
    //   dark: true,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3
    //     }
    //   }
    // }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
