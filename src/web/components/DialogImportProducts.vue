<template>
  <v-dialog v-model="showDialog" persistent width="800">
    <v-card>
      <v-toolbar flat dark color="info" class="text-uppercase">
        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-form ref="form_protheus">
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="provider"
                  prepend-icon="edit"
                  :items="providers"
                  item-text="descripcion"
                  item-value="codigo"
                  label="Proveedores"
                  placeholder="Seleccione un proveedor a importar..."
                />
              </v-col>
              <v-col>
                <v-file-input
                  v-model="files"
                  placeholder="Selecciona un archivo"
                  show-size
                  counter
                  accept=".xlsx"
                  outlined
                  @change="handleFileUpload"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click="cancelar">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="upload">
          Processar Archivo
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import Vue from 'vue'

export default {
  name: 'DialogImportProducts',
  props: {
    value: {
      type: Boolean
    },
    formTitle: {
      default: '',
      type: String
    },
    isNew: {
      type: Boolean
    }
  },
  data () {
    return {
      files: null,
      showDialog: false,
      provider: null,
      providers: null
    }
  },
  watch: {
    formTitle (newVal, oldVal) {
      this.title = newVal
    },
    value (newVal, oldVal) {
      this.showDialog = newVal
    },
    isNew (newVal, oldVal) {
      this.isNewItem = newVal
    }
  },
  mounted () {
    this.getProviders()
  },
  methods: {
    getProviders () {
      const _this = this
      return this.$axios
        .get('provider')
        .then((res) => {
          _this.providers = res.data.data
        })
        .catch((err) => {
          this.$dialog.message.error({
            text: 'Error al obtener los item: ' + err.response.data.error,
            type: 'error'
          })
        })
    },

    handleFileUpload (file) {
      this.files = file
    },
    upload () {
      const datos = new FormData()
      datos.append('file', this.files)
      datos.append('codigo', this.provider)
      this.$axios
        .post('product/import', datos)
        .then((res) => {
          this.showDialog = false
          this.$emit('input', this.showDialog)
        })
        .catch((err) => {
          console.log('Error al procesar los archivos')
          console.log(err)
        })
    },
    cancelar () {
      this.showDialog = false
      this.$emit('input', this.showDialog)
    }
  }
}
</script>
