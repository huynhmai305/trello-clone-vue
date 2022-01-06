<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="d-flex flex-column justify-center align-center"
          >
            <v-icon>mdi-account-circle-outline</v-icon>
            <span>Signin as {{ $nuxt.$fire.auth.currentUser.email }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app class="mello-topbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <nuxt-link to="/">
        <v-toolbar-title v-text="title" />
      </nuxt-link>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} by Mai</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-view-dashboard-variant-outline",
          title: "My Boards",
          to: "/#",
        },
        {
          icon: "mdi-logout-variant",
          title: "Sign out",
          to: "/auth/signout",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Mello",
    };
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.menu-item a {
  color: $text-color;
  padding: 10px 0 10px 3px;
  font-size: 24px;
}
</style>
