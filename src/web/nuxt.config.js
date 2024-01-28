import { ACEPTAR, CANCELAR } from './assets/utils'

export default {
  server: {
    port: process.env.PORT,
    host: 'localhost'
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/syncfusion' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth-next',
    'vuetify-dialog/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
    // proxyHeaders: false,
    // credentials: false,
    // debug: false,
    retry: { retries: 3 }
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    cookie: false,
    resetOnError: true,
    strategies: {
      arven: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.OAUTH_LOGIN_URL,
          userInfo: process.env.OAUTH_PROFILE,
          // token: undefined,
          logout: process.env.REDIRECT_WEB
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'token',
        grantType: 'authorization_code',
        // accessType: undefined,
        // redirectUri: undefined,
        // logoutRedirectUri: undefined,
        clientId: 'SET_ME',
        scope: ['openid', 'profile', 'email'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
        codeChallengeMethod: '',
        responseMode: '',
        acrValues: ''
      }
    }
  },

  vuetify: {
    /* module options */
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  env: {
    API_URL: process.env.API_URL
  },

  vuetifyDialog: {
    actions: [
      { text: ACEPTAR, color: 'primary', key: false },
      { text: CANCELAR, color: 'secondary', key: true }
    ],
    toast: {
      position: 'top-center',
      duration: 5000,
      keepOnHover: true,
      actions: ['Cerrar'],
      dismissible: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
