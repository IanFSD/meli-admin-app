<template>
  <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        :value="date"
        label="Seleccionar una fecha"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" scrollable>
      <v-spacer />
      <v-btn color="primary" text @click="modal = false">
        Cancelar
      </v-btn>
      <v-btn color="primary" text @click="$refs.dialog.save(date)">
        Aceptar
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator'

@Component({})
export default class Dolar extends Vue {
  @VModel({ type: String, required: true, default: null }) date!: string;
  @Prop({ type: Boolean, required: false, default: false }) readonly readonly: boolean | undefined;

  // data
  modal: Boolean = false
}
</script>
