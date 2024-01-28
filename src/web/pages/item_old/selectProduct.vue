<template>
  <!--  <v-dialog v-model="showModal" persistent hide-overlay transition="dialog-bottom-transition" scrollable>-->
  <!--    <v-card>-->
  <!--      <v-toolbar dark color="primary">-->
  <!--        <h1>Seleccione un producto para {{itemTitle}} {{itemPrice}}</h1>-->
  <!--        <v-spacer/>-->
  <!--      </v-toolbar>-->
  <!--      <v-card-text>-->
  <!--        <ejs-treegrid ref="treegrid" :dataSource="data" :allowPaging="true" :allowSorting="true" :allowResizing="true"-->
  <!--                      :Options="pageOptions" :treeColumnIndex="1" childMapping="children" :toolbar="toolbarOptions"-->
  <!--                      :headerCellInfo="customiseHeader" :queryCellInfo="customiseCell" height="250"-->
  <!--                      :selectionSettings="selectionOptions" :rowSelected="rowSelected" :rowDeselected="rowDeselected"-->
  <!--                      :rowSelecting="rowSelecting">-->
  <!--          <e-columns>-->
  <!--            <e-column field="chk" type='checkbox' width='50' textAlign="Center"/>-->
  <!--            <e-column field="description" :headerText="$t('product.title')" clipMode="EllipsisWithTooltip"-->
  <!--                      width="200"/>-->
  <!--            <e-column field="code" :headerText="$t('product.code')" width="90"/>-->
  <!--            <e-column field="stock" :headerText="$t('product.quantity')" textAlign="Right" format="N0" width="90"/>-->
  <!--            <e-column field="price" :headerText="$t('product.price')" textAlign="Right" format="C2" width="90"/>-->
  <!--            <e-column field="active" :headerText="$t('product.status')" type="boolean" displayAsCheckBox="true"-->
  <!--                      textAlign="Center" width="90"/>-->
  <!--            <e-column field="related" :headerText="$t('product.related')" textAlign="Center"-->
  <!--                      clipMode="EllipsisWithTooltip" width="90"/>-->
  <!--          </e-columns>-->
  <!--        </ejs-treegrid>-->
  <!--      </v-card-text>-->
  <!--      <v-card-actions>-->
  <!--        <v-spacer/>-->
  <!--        <v-btn v-if="selectedProduct !== null" color="primary" @click="aceptar">Aceptar</v-btn>-->
  <!--        <v-btn color="secondary" @click="cancelar">Salir</v-btn>-->
  <!--      </v-card-actions>-->
  <!--    </v-card>-->
  <!--  </v-dialog>-->
  <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
</template>

<script>
// import { Filter, Page, Resize, Sort, Toolbar } from '@syncfusion/ej2-vue-treegrid'

export default {
  name: 'SelectProduct'
  // provide: {
  //   treegrid: [Page, Sort, Filter, Toolbar, Resize]
  // },
  // props: {
  //   show: { type: Boolean, default: false },
  //   item: { type: Object, default: null }
  // },
  // data () {
  //   return {
  //     showModal: false,
  //     itemMeli: null,
  //     url: 'product',
  //     data: {},
  //     pageOptions: { pageSize: 10, pageSizeMode: 'Root' },
  //     toolbarOptions: ['Search'],
  //     selectionOptions: { type: 'Single', mode: 'Both', checkboxMode: 'ResetOnRowClick' },
  //     selectedProduct: null
  //   }
  // },
  // computed: {
  //   itemTitle () {
  //     return this.itemMeli ? this.itemMeli.title : ''
  //   },
  //   itemPrice () {
  //     return this.itemMeli ? this.itemMeli.price : ''
  //   }
  // },
  // watch: {
  //   show (newVal) {
  //     this.showModal = newVal
  //   },
  //   item (newVal) {
  //     this.itemMeli = newVal
  //   }
  // },
  // mounted () {
  //   this.$axios.get(`${this.url}`).then((res) => {
  //     this.data = res.data
  //   }).catch((err) => {
  //     console.log(err)
  //     this.$notify({
  //       group: 'all', type: 'error', text: this.$t('general.errorLoad')
  //     })
  //   })
  // },
  // methods: {
  //   aceptar () {
  //     this.$emit('select', this.itemMeli, this.selectedProduct)
  //   },
  //   cancelar () {
  //     this.$emit('cancel')
  //   },
  //   rowSelected (args) {
  //     if (args.data.children && args.data.children.length > 1) {
  //       this.$refs.treegrid.clearSelection()
  //       this.selectedProduct = null
  //     } else {
  //       this.selectedProduct = args.data
  //     }
  //   },
  //   rowDeselected (args) {
  //     this.selectedProduct = null
  //   },
  //   rowSelecting (args) {
  //     if (this.$refs.treegrid.getSelectedRecords().length) {
  //       this.$refs.treegrid.clearSelection()
  //       this.selectedProduct = null
  //     }
  //   },
  //   customiseHeader (args) {
  //     switch (args.cell.column.field) {
  //       case 'chk':
  //         args.node.children[0].innerHTML = this.$t('general.select')
  //         break
  //     }
  //   },
  //   customiseCell (args) {
  //     switch (args.column.field) {
  //       case 'chk':
  //         if (args.data.children && args.data.children.length > 0) {
  //           args.cell.innerHTML = ''
  //         }
  //         break
  //       case 'active':
  //         if (args.data.children && args.data.children.length > 0) {
  //           args.cell.innerHTML = ''
  //         }
  //         break
  //       case 'related':
  //         if (args.data.Items && args.data.Items.length > 0) {
  //           args.cell.innerHTML = args.data.Items.map(x => x.title).join(', ')
  //         } else if (args.data.ItemVariations && args.data.ItemVariations.length > 0) {
  //           args.cell.innerHTML = args.data.ItemVariations.map(x => x.price).join(', ')
  //         }
  //         break
  //     }
  //   }
  // }
}
</script>

<!--<style>-->
<!--  .e-grid .e-altrow {-->
<!--    background-color: #fafafa;-->
<!--  }-->
<!--</style>-->
