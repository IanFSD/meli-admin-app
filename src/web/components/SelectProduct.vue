<template>
  <div>
    <v-dialog v-model="show" hide-overlay persistent scrollable transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="primary" dark>
          <h1>Seleccione un producto para {{ itemTitle }} {{ itemPrice }}</h1>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <ejs-treegrid
            ref="treegrid"
            :allow-paging="true"
            :allow-resizing="true"
            :allow-sorting="true"
            :data-source="data"
            :header-cell-info="customiseHeader"
            :page-settings="pageOptions"
            :query-cell-info="customiseCell"
            :row-deselected="rowDeselected"
            :row-selected="rowSelected"
            :row-selecting="rowSelecting"
            :selection-settings="selectionOptions"
            :toolbar="toolbarOptions"
            :tree-column-index="1"
            child-mapping="children"
            height="250"
          >
            <e-columns>
              <e-column field="chk" text-align="Center" type="checkbox" width="50" />
              <e-column :is-primary-key="true" :visible="false" field="id" header-text="ID" />
              <e-column field="codigo_proveedor" header-text="Proveedor" width="150" />
              <e-column field="codigo" header-text="Código" width="150" />
              <e-column field="descripcion" header-text="Descripción" width="150" />
              <e-column field="Ganancia" header-text="precio" width="150" />
              <e-column field="ImpuestosVarios" header-text="moneda" width="150" />
              <e-column field="GastosAdminsitrativos" header-text="iva" width="150" />
              <e-column field="DiasEntrega" header-text="codigo fabricante" width="150" />
              <e-column field="DiasEntrega" header-text="stock" width="150" />
            </e-columns>
          </ejs-treegrid>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="selectedProduct !== null" color="primary" @click="aceptar">
            Aceptar
          </v-btn>
          <v-btn color="secondary" @click="cancelar">
            Salir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Filter, Page, Resize, Sort, Toolbar } from '@syncfusion/ej2-vue-treegrid'

@Component({ provide: { treegrid: [Page, Sort, Filter, Toolbar, Resize] } })
export default class SelectProduct extends Vue {
  @Prop({ type: Boolean, required: false, default: false }) readonly show: boolean | undefined
  @Prop({ type: Object, required: false, default: null }) readonly item: any

  url = 'product'
  data = {}
  pageOptions = { pageSize: 10, pageSizeMode: 'Root' }
  toolbarOptions = ['Search']
  selectionOptions = { type: 'Single', mode: 'Both', checkboxMode: 'ResetOnRowClick' }
  selectedProduct: any = null

  // computed
  get itemTitle () {
    return this.item ? this.item.title : ''
  }

  get itemPrice () {
    return this.item ? this.item.price : ''
  }

  mounted () {
    this.$axios.get(`${this.url}`).then((res) => {
      this.data = res.data
    }).catch((err) => {
      console.log(err)
      this.$dialog.message.error('Eror al buscar los productos')
    })
  }

  // methods
  aceptar () {
    // this.$emit('select', this.itemMeli, this.selectedProduct)
  }

  cancelar () {
    this.$emit('cancel')
  }

  rowSelected (args:any) {
    if (args.data.children && args.data.children.length > 1) {
      // this.$refs.treegrid.clearSelection()
      this.selectedProduct = null
    } else {
      this.selectedProduct = args.data
    }
  }

  rowDeselected (args:any) {
    this.selectedProduct = null
  }

  rowSelecting (args:any) {
    // if (this.$refs.treegrid.getSelectedRecords().length) {
    //   this.$refs.treegrid.clearSelection()
    //   this.selectedProduct = null
    // }
  }

  customiseHeader (args:any) {
    switch (args.cell.column.field) {
      case 'chk':
        args.node.children[0].innerHTML = 'Seleccionar'
        break
    }
  }

  customiseCell (args:any) {
    switch (args.column.field) {
      case 'chk':
        if (args.data.children && args.data.children.length > 0) {
          args.cell.innerHTML = ''
        }
        break
      case 'active':
        if (args.data.children && args.data.children.length > 0) {
          args.cell.innerHTML = ''
        }
        break
      case 'related':
        if (args.data.Items && args.data.Items.length > 0) {
          args.cell.innerHTML = args.data.Items.map((x:any) => x.title).join(', ')
        } else if (args.data.ItemVariations && args.data.ItemVariations.length > 0) {
          args.cell.innerHTML = args.data.ItemVariations.map((x:any) => x.price).join(', ')
        }
        break
    }
  }
}
</script>
