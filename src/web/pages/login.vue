<template>
  <v-card class="elevation-12">
    <v-toolbar
      color="primary"
      dark
      flat
    >
      <v-toolbar-title>ArVen - Administración</v-toolbar-title>
    </v-toolbar>
    <v-card-actions>
      <v-btn color="primary" @click="login">
        Ingresar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Login',
  layout: 'login',
  auth: false,
  data () {
    return {
    }
  },
  methods: {
    async login () {
      try {
        console.log('Log In!')
        await this.$auth.loginWith('arven')
      } catch (err) {
        console.error(err)
        this.$dialog.message.error('Error al querer loguearse')
      }
    }
  }
})
</script>
