<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="isLogged"
    >
      <v-list dense>
        <template v-if="isAdmin || isWareHouseManager || isSalesManager">
          <v-list-tile :to="{ name: 'home' }">
            <v-list-tile-action> </v-list-tile-action>
            <v-list-tile-title> Home </v-list-tile-title>
          </v-list-tile>
        </template>
        <template v-if="isAdmin || isWareHouseManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Articles </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'categorie' }">
              <v-list-tile-action>
                <v-icon>category</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Categories </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'article' }">
              <v-list-tile-action>
                <v-icon>assignment_turned_in</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Articles list </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin || isFinanceManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Finances </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'bank' }">
              <v-list-tile-action>
                <v-icon>account_balance</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Banks </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'loan' }">
              <v-list-tile-action>
                <v-icon>money</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Loans </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin || isWareHouseManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Orders </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'order' }">
              <v-list-tile-action>
                <v-icon>shopping_bag</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Orders </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'provider' }">
              <v-list-tile-action>
                <v-icon>local_shipping</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Providers </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin || isSalesManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Sales </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'sale' }">
              <v-list-tile-action>
                <v-icon>receipt</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Sales </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'client' }">
              <v-list-tile-action>
                <v-icon>payment</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Clients </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin || isSalesManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Services </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'creditor' }">
              <v-list-tile-action>
                <v-icon>paid</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Creditors list </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin || isRRHHManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Employees </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'employee' }">
              <v-list-tile-action>
                <v-icon>work</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Employee list </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
         <template v-if="isAdmin || isRRHHManager">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Meetings </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'meeting' }">
              <v-list-tile-action>
                <v-icon>groups</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Meetings </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="isAdmin">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> Access Management </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'user' }">
              <v-list-tile-action>
                <v-icon>manage_accounts</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Users </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="info"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
        ></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">proQratio<sup>©</sup> Software</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout()" icon v-if="isLogged">
        <v-icon>logout</v-icon>Logout
      </v-btn>
      <v-btn :to="{ name: 'login' }" icon v-else>
        <v-icon>apps</v-icon>Login
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Developed by <strong>lope martinez</strong> &copy; 2021
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    isLogged() {
      return this.$store.state.user;
    },
    isAdmin() {
      return (
        this.$store.state.user && this.$store.state.user.role == "Administrador"
      );
    },
    isWareHouseManager() {
      return this.$store.state.user && this.$store.state.user.role == "Almacen";
    },
    isSalesManager() {
      return this.$store.state.user && this.$store.state.user.role == "Ventas";
    },
    isFinanceManager() {
      return this.$store.state.user && this.$store.state.user.role == "Finanzas";
    },
    isRRHHManager() {
      return this.$store.state.user && this.$store.state.user.role == "RRHH";
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

