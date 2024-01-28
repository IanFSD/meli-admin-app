<template>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col lg-6 md-6 sm-6 xl-6>
            <v-form>
              <v-row>
                <v-col>
                  <DatePicker v-model="fecha" :readonly="true" />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="cotizacion"
                    :rules="[rules.required, rules.isNumber, rules.min]"
                    placeholder="Cotización"
                    required
                    type="number"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="primary" @click="grabar">
                    Grabar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col align-self="center" lg-6 md-6 sm-6 xl-6>
            <v-btn color="success" @click="UpdateCotizacionDolar">
              Actualizar cotización del dolar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DatePicker from '~/components/DatePicker.vue'
import { formatDate } from '~/assets/utils'

const isNumber = require('is-number')

@Component({ components: { DatePicker } })
export default class Dolar extends Vue {
  fecha = formatDate(new Date())
  cotizacion = 0
  rules = {
    required: (value: any) => !!value || 'Este campo es requerido.',
    min: (value: any) => parseFloat(value) > 0 || 'Debe ingresar un valor mayor que 0',
    isNumber: (value: any) => isNumber(value) || 'Debe ingresar un numero'
  }

  mounted () {
    this.getCotizacionDolar()
  }

  async getCotizacionDolar () {
    try {
      const res = await this.$axios.get('cotizaciondolar')
      if (res.data != null) {
        this.cotizacion = parseFloat(res.data.cotizacion)
        this.fecha = formatDate(res.data.fecha)
      } else {
        console.log('Error al obtener cotizacion del dolar')
        this.$dialog.message.error('Error al obtener el cotizacion del dolar')
      }
    } catch (err) {
      console.log('Error al obtener cotizacion del dolar')
      console.log(err)
      this.$dialog.message.error('Error al obtener el cotizacion del dolar')
    }
  }

  async UpdateCotizacionDolar () {
    try {
      const res = await this.$axios.patch('cotizaciondolar')
      this.cotizacion = parseFloat(res.data.cotizacion)
      this.fecha = formatDate(res.data.fecha)
      this.$dialog.message.success('Cotización del dolar actualizada')
    } catch (err) {
      console.log('Error al actualizar cotizacion del dolar')
      console.log(err)
      this.$dialog.message.error('Error al actualizar cotizacion del dolar')
    }
  }

  async grabar () {
    const params = { cotizacion: this.cotizacion, fecha: this.fecha }
    try {
      const res = await this.$axios.post('cotizaciondolar', params)
      this.cotizacion = parseFloat(res.data.cotizacion)
      this.fecha = formatDate(res.data.fecha)
      this.$dialog.message.success('Cotización del dolar actualizada')
    } catch (err) {
      console.log('Error al actualizar cotizacion del dolar')
      console.log(err)
      this.$dialog.message.error('Error al actualizar cotizacion del dolar')
    }
  }
}
</script>
