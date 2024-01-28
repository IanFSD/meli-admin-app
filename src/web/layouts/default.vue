<template>
  <v-app id="inspire">
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
      >
        <v-list dense>
          <template v-for="item in items">
            <v-row
              v-if="item.heading"
              :key="item.heading"
              align="center"
            >
              <v-col cols="6">
                <v-subheader v-if="item.heading">
                  {{ item.heading }}
                </v-subheader>
              </v-col>
              <v-col
                class="text-center"
                cols="6"
              >
                <a
                  class="body-2 black--text"
                  href="#!"
                >EDIT</a>
              </v-col>
            </v-row>
            <v-list-group
              v-else-if="item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon=""
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                link
              >
                <v-list-item-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title @click="menuClicked(child)">
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item
              v-else
              :key="item.text"
              link
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title @click="menuClicked(item)">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="blue darken-3"
        dark
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title
          class="ml-0 pl-4"
          style="width: 300px"
        >
          <span class="hidden-sm-and-down">MercadoLibre Admin</span>
        </v-toolbar-title>
        <!--        <v-text-field-->
        <!--          flat-->
        <!--          solo-inverted-->
        <!--          hide-details-->
        <!--          prepend-inner-icon="mdi-magnify"-->
        <!--          label="Search"-->
        <!--          class="hidden-sm-and-down"-->
        <!--        />-->
        <h2>{{ currentPage }}</h2>
        <v-spacer />
        <!--        <v-btn icon>-->
        <!--          <v-icon>mdi-apps</v-icon>-->
        <!--        </v-btn>-->
        <!--        <v-btn icon>-->
        <!--          <v-icon>mdi-bell</v-icon>-->
        <!--        </v-btn>-->
        <v-btn
          large
          text
          @click="logout"
        >
          Salir
          <!--          <v-avatar-->
          <!--            item-->
          <!--            size="32px"-->
          <!--          >-->
          <!--            <v-img-->
          <!--              alt="Vuetify"-->
          <!--              src="https://cdn.vuetifyjs.com/images/logos/logo.svg"-->
          <!--            />-->
          <!--          </v-avatar>-->
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <v-row align="start" justify="start">
            <v-col>
              <Nuxt />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    drawer: null,
    currentPage: '',
    items: [
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Parametría',
        model: true,
        children: [
          { icon: 'mdi-plus', text: 'Mercado Libre', path: '/mercadolibre' },
          { icon: 'mdi-plus', text: 'Dólar', path: '/dolar' },
          { icon: 'mdi-plus', text: 'Usuarios', path: '/user' },
          { icon: 'mdi-plus', text: 'Proveedores', path: '/provider' }
        ]
      },
      { icon: 'mdi-cog', text: 'Productos', path: '/product' },
      { icon: 'mdi-message', text: 'Publicaciones', path: '/item' }
    ]
  }),
  methods: {
    async logout () {
      await this.$auth.logout()
      this.$router.push('/login')
    },
    menuClicked (args: any) {
      if (args.path) {
        this.currentPage = args.text
        this.$router.push(args.path)
      }
    }
  }
})
</script>

<style>
.e-grid .e-altrow {
  background-color: #fafafa;
}

.e-treegrid .e-altrow {
  background-color: #fafafa;
}

.e-link:before {
  content: '\e290';
}

.e-unlink:before {
  content: '\e286';
}
</style>
