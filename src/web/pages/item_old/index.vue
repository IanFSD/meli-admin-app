<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!--  <div>-->
  <!--    <v-container fluid grid-list-xl py-0>-->
  <!--      <v-card>-->
  <!--        <v-card-text>-->
  <!--          <ejs-treegrid-->
  <!--            ref="treegrid"-->
  <!--            :data-source="data"-->
  <!--            :allow-paging="true"-->
  <!--            :allow-sorting="true"-->
  <!--            :allow-resizing="true"-->
  <!--            :page-settings="pageOptions"-->
  <!--            :tree-column-index="1"-->
  <!--            child-mapping="Variations"-->
  <!--            :toolbar="toolbarOptions"-->
  <!--            :toolbar-click="toolbarClick"-->
  <!--            :selection-settings="selectionOptions"-->
  <!--            :data-source-changed="dataSourceChanged"-->
  <!--            :data-state-change="dataStateChange"-->
  <!--            :allow-text-wrap="true"-->
  <!--            :text-wrap-settings="wrapOptions"-->
  <!--            :row-data-bound="rowDataBound"-->
  <!--          >-->
  <!--            <e-columns>-->
  <!--              <e-column :header-text="$t('item.actions')" :commands="commands" text-align="Center" />-->
  <!--              <e-column field="id" :header-text="$t('item.id')" />-->
  <!--              <e-column-->
  <!--                field="thumbnail"-->
  <!--                :header-text="$t('item.image')"-->
  <!--                :value-accessor="thumbnailFormatter"-->
  <!--                :disable-html-encode="false"-->
  <!--              />-->
  <!--              <e-column-->
  <!--                field="title"-->
  <!--                :header-text="$t('item.title')"-->
  <!--                :value-accessor="titleFormatter"-->
  <!--                :disable-html-encode="false"-->
  <!--              />-->
  <!--              <e-column field="status" :header-text="$t('item.status')" />-->
  <!--              <e-column field="price" :header-text="$t('item.price')" text-align="Right" format="C2" />-->
  <!--              <e-column field="available_quantity" :header-text="$t('item.quantity')" text-align="Right" format="N0" />-->
  <!--              <e-column field="seller_custom_field" :header-text="$t('item.related')" :value-accessor="relatedFormatter" />-->
  <!--            </e-columns>-->
  <!--          </ejs-treegrid>-->
  <!--        </v-card-text>-->
  <!--        <select-product-->
  <!--          :show="showSelectProduct"-->
  <!--          :item="selectProdutItem"-->
  <!--          @select="productoSeleccionado"-->
  <!--          @cancel="cancelSelectProduct"-->
  <!--        />-->
  <!--      </v-card>-->
  <!--    </v-container>-->
  <!--  </div>-->
  <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
</template>

<script>
// import { CommandColumn, Filter, Page, Resize, Sort, Toolbar } from '@syncfusion/ej2-vue-treegrid'
// import { closest } from '@syncfusion/ej2-base'
// import { DialogUtility } from '@syncfusion/ej2-popups'
// import { formatPrice } from 'assets/utils'
// import SelectProduct from './selectProduct'

export default {
  name: 'Publicacion'
  // components: { SelectProduct },
  // provide: {
  //   treegrid: [Page, Sort, Filter, Toolbar, Resize, CommandColumn]
  // },
  // data () {
  //   return {
  //     url: 'item',
  //     showSelectProduct: false,
  //     selectProdutItem: null,
  //     data: {},
  //     // data: new DataManager({
  //     //   url: 'item',
  //     //   adaptor: new ITRIOAdaptor('item', this.$axios, this.$dialog.message),
  //     //   offline: false,
  //     //   crossDomain: true,
  //     //   headers: [{Authorization: `${this.$auth.getToken('local')}`}],
  //     // },),
  //     selectionOptions: { mode: 'None' },
  //     pageOptions: { pageSize: 10, pageSizeMode: 'Root' },
  //     toolbarOptions: [
  //       'Search',
  //       { text: 'Download Items', tooltipText: 'Download Items', id: 'downloadItems' },
  //       { text: 'Upload Items', tooltipText: 'Upload Items', id: 'uploadItems' }
  //     ],
  //     wrapOptions: { wrapMode: 'Content' },
  //     commands: [{
  //       type: 'link',
  //       title: this.$t('item.link'),
  //       buttonOption: { click: this.link, iconCss: 'e-icons Hyperlink', cssClass: 'e-round green' }
  //     }, {
  //       type: 'unlink',
  //       title: this.$t('item.unlink'),
  //       buttonOption: { click: this.unlink, iconCss: 'e-icons RemoveHyperlink', cssClass: 'e-round red' }
  //     }],
  //     target: '#modalTarget',
  //     width: '335px',
  //     isModal: true,
  //     position: { X: 'center', Y: 'center' },
  //     animationSettings: { effect: 'Zoom' }
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
  //   formatPrice,
  //   toolbarClick (args) {
  //     switch (args.item.id) {
  //       case 'downloadItems':
  //         return this.downloadItems()
  //       case 'uploadItems':
  //         return this.updateItems()
  //     }
  //   },
  //   downloadItems () {
  //     this.$axios
  //       .post(`${this.url}/download-items`)
  //       .then((res) => {
  //         console.log(res)
  //         this.$dialog.message.success(
  //           `Se ha disparado un proceso (# ${res.data.id}) de bajar publicaciones. Espere a que finalize el mismo para ver las nuevas publicaciones`
  //         )
  //       }).catch((err) => {
  //         console.log(err)
  //         this.$dialog.message.error(
  //           'Error al obtener los item: ' + err.response.data.error
  //         )
  //       })
  //   },
  //   updateItems () {
  //     this.$axios
  //       .post(`${this.url}/update-items`)
  //       .then((res) => {
  //         console.log(res)
  //         this.$dialog.message.success(
  //           `Se ha disparado un proceso (# ${res.data.id}) de actulizar publicaciones. Espere a que finalize el mismo para ver las nuevas publicaciones`
  //         )
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         this.$dialog.message.error(
  //           'Error al obtener los item: ' + err.response.data.error
  //         )
  //       })
  //   },
  //   link (args) {
  //     const rowIndex = (closest(args.target, '.e-row')).rowIndex
  //     const data = this.$refs.treegrid.ej2Instances.getCurrentViewRecords()
  //     const item = data[rowIndex]
  //
  //     this.selectProdutItem = item
  //     this.showSelectProduct = true
  //   },
  //   unlink (args) {
  //     const rowIndex = (closest(args.target, '.e-row')).rowIndex
  //     const data = this.$refs.treegrid.ej2Instances.getCurrentViewRecords()
  //     const item = data[rowIndex]
  //     if (item.seller_custom_field && item.seller_custom_field.length > 0) {
  //       console.log('unlink', item)
  //       const title = item.level === 0 ? `Está seguro de desligar la publicación "${item.title}"` : `Está seguro de desligar la variación ${item.id} de la publicación "${item.parentItem.title}"`
  //       const dialog = DialogUtility.confirm({
  //         title: 'Confirmar desligar',
  //         content: title,
  //         okButton: { text: this.$t('general.ok'), click: () => this.unlinkItem(item, dialog) },
  //         cancelButton: { text: this.$t('general.cancel'), click: () => dialog.destroy() },
  //         showCloseIcon: true,
  //         closeOnEscape: true,
  //         animationSettings: { effect: 'Zoom' }
  //       })
  //     }
  //   },
  //   unlinkItem (item, dialog) {
  //     if (item !== null) {
  //       const data = {}
  //       let urlEx = ''
  //       if (item.level === 0) {
  //         data.item_id = item.id
  //         urlEx = 'unlink-item'
  //       } else {
  //         data.variation_id = item.id
  //         urlEx = 'unlink-variation'
  //       }
  //       return this.$axios
  //         .put(`${this.url}/${urlEx}`, data)
  //         .then((res) => {
  //           if (res.data != null) {
  //             dialog.destroy()
  //             this.$notify({
  //               group: 'all',
  //               type: 'success',
  //               text: `Se ha disparado un proceso (# ${res.data.id}) de unlink. Espere a que finalize el mismo para ver las novedades`
  //             })
  //             this.selectProdutItem = null
  //             this.showSelectProduct = false
  //           } else {
  //             console.log('Error al grabar item con id ' + item.id)
  //             this.$notify({ group: 'all', type: 'error', text: 'Error al grabar item con id : ' + item.id })
  //           }
  //         })
  //         .catch((err) => {
  //           console.log('Error al grabar item con id ' + item.id)
  //           console.log(err)
  //           this.$notify({ group: 'all', type: 'error', text: 'Error al grabar item con id : ' + item.id })
  //         })
  //     }
  //   },
  //   productoSeleccionado (item, producto) {
  //     if (item !== null && producto !== null) {
  //       const data = { product_id: producto.id }
  //       let urlEx = ''
  //       if (item.level === 0) {
  //         data.item_id = item.id
  //         urlEx = 'link-item'
  //       } else {
  //         data.variation_id = item.id
  //         urlEx = 'link-variation'
  //       }
  //       return this.$axios
  //         .put(`${this.url}/${urlEx}`, data)
  //         .then(async (res) => {
  //           if (res.data != null) {
  //             // this.$dialog.message.success("El item se   grabó con éxito.");
  //             this.$notify({
  //               group: 'all',
  //               type: 'success',
  //               text: `Se ha disparado un proceso (# ${res.data.id}) de link. Espere a que finalize el mismo para ver las novedades`
  //             })
  //             this.selectProdutItem = null
  //             this.showSelectProduct = false
  //           } else {
  //             console.log('Error al grabar item con id ' + item.id)
  //             this.$notify({ group: 'all', type: 'error', text: 'Error al grabar item con id : ' + item.id })
  //           }
  //         })
  //         .catch((err) => {
  //           console.log('Error al grabar item con id ' + item.id)
  //           console.log(err)
  //           this.$notify({ group: 'all', type: 'error', text: 'Error al grabar item con id : ' + item.id })
  //         })
  //     }
  //   },
  //   cancelSelectProduct () {
  //     this.selectProdutItem = null
  //     this.showSelectProduct = false
  //   },
  //   thumbnailFormatter (field, data, column) {
  //     return `<a href="${data.permalink}" target="blank"><img src="${data.thumbnail}" width="90" height="90" class="e-image"/></a>`
  //   },
  //   titleFormatter (field, data, column) {
  //     let str = ''
  //     if (data.level === 0) {
  //       str = `<a href="${data.permalink}" target="blank">${data.title}</a>`
  //     }
  //     return str
  //   },
  //   relatedFormatter (field, data, column) {
  //     const str = data.seller_custom_field
  //     // if (data.Product) {
  //     //   if (data.level === 0) {
  //     //     str = `${data.Product.code} - ${data.Product.description} - ${this.formatPrice(data.Product.price)}`;
  //     //   } else {
  //     //     str = `${data.Product.code} - ${data.Product.description} - ${data.Product.stock}`;
  //     //   }
  //     // }
  //     return str
  //   },
  //   rowDataBound (args) {
  //     // let data = args.data;
  //     // if (data.level === 1) {
  //     //   args.row.cells[0].innerHTML = '';
  //     // }
  //   },
  //   dataSourceChanged () {
  //     console.log('dataSourceChanged', arguments)
  //   },
  //   dataStateChange () {
  //     console.log('dataStateChange', arguments)
  //   }
  // }
}
</script>

<style>
/*.e-grid .e-altrow {*/
/*  background-color: #fafafa;*/
/*}*/

/*.RemoveHyperlink:before {*/
/*  content: '\e286';*/
/*}*/

/*.Hyperlink:before {*/
/*  content: '\e290';*/
/*}*/

</style>
