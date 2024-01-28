<template>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col lg="8" md="8" sm="8" xl="8">
            <v-card>
              <v-card-title>Parametros de Mercado Libre</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col lg="6" md="6" sm="6" xl="6">
                    <v-text-field v-model="data.comisionClasica" label="Comisión en % - CLASICA" type="number" />
                  </v-col>
                  <v-col lg="6" md="6" sm="6" xl="6">
                    <v-text-field v-model="data.comisionPremium" label="Comisión en % - PREMIUM" type="number" />
                  </v-col>
                  <v-col lg="6" md="6" sm="6" xl="6">
                    <v-text-field v-model="data.impuestosVarios" label="Impuestos Varios en %" type="number" />
                  </v-col>
                  <v-col lg="6" md="6" sm="6" xl="6">
                    <v-text-field
                      v-model="data.gastosAdminsitrativos"
                      label="Gastos Adminsitrativos en %"
                      type="number"
                    />
                  </v-col>
                  <v-col lg="6" md="6" sm="6" xl="6">
                    <v-text-field v-model="data.limiteCostoEnvio" label="Límite de Costo de Envío" type="number" />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="setParametrosMeli">
                  Grabar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col lg="4" md="4" sm="4" xl="4">
            <v-card>
              <v-card-title>Estado de la cuenta</v-card-title>
              <v-card-text>
                {{ estaActivo ? 'Activo' : 'Inactivo' }}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn v-if="!estaActivo" @click="linkearCuentaMercadoLibre">
                  Linkear cuenta Mercado Libre
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Mercadolibre extends Vue {
  urlParameter = '/parameter'
  urlCuentaMercadoLibre = '/meli'
  state: any = null
  data: any = {
    comisionClasica: '',
    comisionPremium: '',
    impuestosVarios: '',
    gastosAdminsitrativos: '',
    limiteCostoEnvio: ''
  }

  get estaActivo () {
    return this.state !== null
  }

  mounted () {
    this.getParametrosMeli()
    this.getStateMercadoLibre()
  }

  async getParametrosMeli () {
    try {
      const res = await this.$axios.get(this.urlParameter)
      if (res.data != null) {
        this.data.id = res.data._id
        this.data.comisionClasica = res.data.comisionClasica
        this.data.comisionPremium = res.data.comisionPremium
        this.data.impuestosVarios = res.data.impuestosVarios
        this.data.gastosAdminsitrativos = res.data.gastosAdminsitrativos
        this.data.DiasEntrega = res.data.DiasEntrega
        this.data.limiteCostoEnvio = res.data.limiteCostoEnvio
      } else {
        this.$dialog.message.error('Error al obtener el parametros')
      }
    } catch (err) {
      console.error('Error al obtener parametros', err)
      this.$dialog.message.error('Error al obtener el parametros')
    }
  }

  async setParametrosMeli () {
    try {
      await this.$axios.post(this.urlParameter, {
        comisionClasica: Number(this.data.comisionClasica),
        comisionPremium: Number(this.data.comisionPremium),
        impuestosVarios: Number(this.data.impuestosVarios),
        gastosAdminsitrativos: Number(this.data.gastosAdminsitrativos),
        limiteCostoEnvio: Number(this.data.limiteCostoEnvio)
      })
      this.$dialog.message.success('Parametros grabado')
    } catch (err) {
      console.log('Error al grabar parametros', err)
      this.$dialog.message.error('Error al guardar el parametros')
    }
  }

  async linkearCuentaMercadoLibre () {
    const url = `${this.urlCuentaMercadoLibre}/link`
    try {
      const res = await this.$axios.get(url)
      window.location.href = res.data.url
    } catch (err) {
      console.log('Error al obtenr URL para linkear cuenta de Mercado Libre', err)
      this.$dialog.message.error('Error al obtener url para linkear cuenta de Mercado Libre')
    }
  }

  private async getStateMercadoLibre () {
    try {
      const res = await this.$axios.get(`${this.urlCuentaMercadoLibre}/state`)
      if (res.data != null) {
        this.state = res.data
      } else {
        this.$dialog.message.error('Error al obtener el parametros')
      }
    } catch (err) {
      console.error('Error al obtener parametros', err)
      this.$dialog.message.error('Error al obtener el parametros')
    }
  }
}
</script>
