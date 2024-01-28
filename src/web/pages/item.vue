<template>
  <div>
    <ejs-treegrid ref="treegrid" :allow-paging="true" :allow-resizing="true" :allow-sorting="true"
                  :allow-text-wrap="true" :data-source="data" :data-state-change="dataStateChange"
                  :page-settings="pageOptions" :row-data-bound="rowDataBound" :selection-settings="selectionOptions"
                  :text-wrap-settings="wrapOptions" :toolbar="toolbarOptions" :toolbar-click="toolbarClick"
                  :tree-column-index="1" child-mapping="Variations" height="400" locale="es">
      <e-columns>
        <e-column :commands="commands" header-text="Acciones" text-align="Center"/>
        <e-column field="id" header-text="Id"/>
        <e-column :disable-html-encode="false" :value-accessor="thumbnailFormatter" field="thumbnail"
                  header-text="Imágen"/>
        <e-column :disable-html-encode="false" :value-accessor="titleFormatter" field="title" header-text="Título"/>
        <e-column field="status" header-text="Estado"/>
        <e-column field="price" format="C2" header-text="Precio" text-align="Right"/>
        <e-column field="available_quantity" format="N0" header-text="Cantidad" text-align="Right"/>
        <e-column :value-accessor="relatedFormatter" field="seller_custom_field" header-text="Links"/>
      </e-columns>
    </ejs-treegrid>
    <SelectProduct :item="selectProdutItem" :show="showSelectProduct" @cancel="cancelSelectProduct"
                   @select="productoSeleccionado"/>
  </div>
</template>

<script lang="ts">
import {
  CommandColumn,
  DataStateChangeEventArgs,
  Edit,
  Filter,
  Page,
  Resize,
  Sort,
  Toolbar
} from '@syncfusion/ej2-vue-treegrid'
import {Component, Vue} from 'vue-property-decorator'
import {ClickEventArgs} from '@syncfusion/ej2-vue-navigations'
import {closest} from '@syncfusion/ej2-base'
import {ApiDataService} from '~/assets/ApiDataService'
import {ACEPTAR} from '~/assets/utils'
import SelectProduct from "~/components/SelectProduct.vue";

@Component({
  components: {SelectProduct},
  provide: {treegrid: [Page, Edit, Toolbar, Filter, Sort, Resize, CommandColumn]}
})
export default class Item extends Vue {
  url = '/item'
  data: any = {}
  apiDataService = new ApiDataService('/item')
  showSelectProduct = false
  selectProdutItem = null
  selectionOptions = {mode: 'None'}
  pageOptions = {pageSize: 10, pageSizeMode: 'Root'}
  toolbarOptions = [
    'Search',
    {text: 'Download Items', tooltipText: 'Download Items', id: 'downloadItems'},
    {text: 'Upload Items', tooltipText: 'Upload Items', id: 'uploadItems'}
  ]

  wrapOptions = {wrapMode: 'Content'}
  commands = [{
    type: 'link',
    title: 'Link',
    buttonOption: {click: this.link, iconCss: 'e-icons e-link', cssClass: 'e-outline green'}
  }, {
    type: 'unlink',
    title: 'Unlink',
    buttonOption: {click: this.unlink, iconCss: 'e-icons e-unlink', cssClass: 'e-outline red'}
  }]

  target = '#modalTarget'
  width = '335px'
  isModal = true
  position = {X: 'center', Y: 'center'}
  animationSettings = {effect: 'Zoom'}

  mounted() {
    const state = {skip: 0, take: 10};
    this.dataStateChange(state);
  }

  dataStateChange(state: DataStateChangeEventArgs) {
    this.apiDataService.execute(state).then((gridData) => {
      console.log(gridData)
      this.data = gridData
    })
  }

  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case 'downloadItems':
        return this.downloadItems()
      case 'uploadItems':
        return this.updateItems()
    }
  }

  downloadItems() {
    this.$axios.post(`${this.url}/download-items`).then((res) => {
      this.$dialog.message.success(`Se ha disparado un proceso (# ${res.data.id}) de bajar publicaciones. Espere a que finalize el mismo para ver las nuevas publicaciones`)
    }).catch((err) => {
      console.log(err)
      this.$dialog.message.error('Error al obtener los item: ' + err.response.data.error)
    })
  }

  updateItems() {
    this.$axios.post(`${this.url}/update-items`).then((res) => {
      this.$dialog.message.success(`Se ha disparado un proceso (# ${res.data.id}) de actulizar publicaciones. Espere a que finalize el mismo para ver las nuevas publicaciones`)
    }).catch((err) => {
      console.log(err)
      this.$dialog.message.error('Error al obtener los item: ' + err.response.data.error)
    })
  }

  link(args: any) {
    // @ts-ignore
    const rowIndex = (closest(args.target, '.e-row')).rowIndex
    // @ts-ignore
    const data = this.$refs.treegrid.ej2Instances.getCurrentViewRecords()
    const item = data[rowIndex]

    this.selectProdutItem = item
    this.showSelectProduct = true
  }

  async unlink(args: any) {
    // @ts-ignore
    const rowIndex = (closest(args.target, '.e-row')).rowIndex
    // @ts-ignore
    const data = this.$refs.treegrid.ej2Instances.getCurrentViewRecords()
    const item = data[rowIndex]
    if (item.seller_custom_field && item.seller_custom_field.length > 0) {
      console.log('unlink', item)
      const title = item.level === 0 ? `Está seguro de desligar la publicación "${item.title}"` : `Está seguro de desligar la variación ${item.id} de la publicación "${item.parentItem.title}"`
      const res = await this.$dialog.confirm({title: 'Confirmar desligar', text: title})
      if (res === ACEPTAR) {
        this.unlinkItem(item)
      }
    }
  }

  unlinkItem(item: any) {
    if (item !== null) {
      const data: any = {}
      let urlEx = ''
      if (item.level === 0) {
        data.item_id = item.id
        urlEx = 'unlink-item'
      } else {
        data.variation_id = item.id
        urlEx = 'unlink-variation'
      }
      return this.$axios.put(`${this.url}/${urlEx}`, data).then((res) => {
        if (res.data != null) {
          this.$dialog.message.success(`Se ha disparado un proceso (# ${res.data.id}) de unlink. Espere a que finalize el mismo para ver las novedades`)
          this.selectProdutItem = null
          this.showSelectProduct = false
        } else {
          console.log('Error al grabar item con id ' + item.id)
          this.$dialog.message.error('Error al grabar item con id : ' + item.id)
        }
      }).catch((err) => {
        console.log('Error al grabar item con id ' + item.id)
        console.log(err)
        this.$dialog.message.error('Error al grabar item con id : ' + item.id)
      })
    }
  }

  productoSeleccionado(item: any, producto: any) {
    if (item !== null && producto !== null) {
      const data: any = {product_id: producto.id}
      let urlEx = ''
      if (item.level === 0) {
        data.item_id = item.id
        urlEx = 'link-item'
      } else {
        data.variation_id = item.id
        urlEx = 'link-variation'
      }
      return this.$axios
        .put(`${this.url}/${urlEx}`, data)
        .then((res) => {
          if (res.data != null) {
            // this.$dialog.message.success("El item se   grabó con éxito.");
            this.$dialog.message.success(`Se ha disparado un proceso (# ${res.data.id}) de link. Espere a que finalize el mismo para ver las novedades`)
            this.selectProdutItem = null
            this.showSelectProduct = false
          } else {
            console.log('Error al grabar item con id ' + item.id)
            this.$dialog.message.error('Error al grabar item con id : ' + item.id)
          }
        })
        .catch((err) => {
          console.log('Error al grabar item con id ' + item.id)
          console.log(err)
          this.$dialog.message.error('Error al grabar item con id : ' + item.id)
        })
    }
  }

  cancelSelectProduct() {
    this.selectProdutItem = null
    this.showSelectProduct = false
  }

  thumbnailFormatter(field: any, data: any, column: any) {
    return `<a href="${data.permalink}" target="blank"><img src="${data.thumbnail}" width="90" height="90" class="e-image"/></a>`
  }

  titleFormatter(field: any, data: any, column: any) {
    let str = ''
    if (data.level === 0) {
      str = `<a href="${data.permalink}" target="blank">${data.title}</a>`
    }
    return str
  }

  relatedFormatter(field: any, data: any, column: any) {
    const str = data.seller_custom_field
    // if (data.Product) {
    //   if (data.level === 0) {
    //     str = `${data.Product.code} - ${data.Product.description} - ${this.formatPrice(data.Product.price)}`;
    //   } else {
    //     str = `${data.Product.code} - ${data.Product.description} - ${data.Product.stock}`;
    //   }
    // }
    return str
  }

  rowDataBound(args: any) {
    // let data = args.data;
    // if (data.level === 1) {
    //   args.row.cells[0].innerHTML = '';
    // }
  }
}
</script>
