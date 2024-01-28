<template>
  <div>
    <ejs-grid ref="grid" :allow-filtering="true" :allow-paging="true" :allow-resizing="true" :allow-sorting="true"
              :data-source="data" :data-source-changed="dataSourceChanged" :data-state-change="dataStateChange"
              :edit-settings="editOptions" :filter-settings="filterOptions" :page-settings="pageOptions"
              :toolbar="toolbarOptions" :toolbar-click="toolbarClick" height="400" locale="es">
      <e-columns>
        <e-column :is-primary-key="true" :visible="false" field="id" header-text="ID"/>
        <e-column :allow-editing="true" :data-source="providers" :edit="editProvider" editType="dropdownedit"
                  field="provider" foreignKeyField="codigo" foreignKeyValue="descripcion" header-text="Proveedor"
                  width="150"/>
        <e-column :allow-editing="true" field="code" header-text="Código" width="150"/>
        <e-column :allow-editing="true" field="description" header-text="Descripción" width="150"/>
        <e-column :allow-editing="true" field="price" header-text="Precio" width="150"/>
        <e-column :allow-editing="true" field="stock" header-text="Stock" width="150"/>
        <e-column :allow-editing="true" :edit="editMoneda" editType="dropdownedit" field="moneda" header-text="Moneda"
                  width="150"/>
        <e-column :allow-editing="true" field="iva" header-text="IVA" width="150"/>
        <e-column :allow-editing="true" :edit="editActive" editType="booleanedit" field="active" header-text="Activo"
                  width="150"/>
      </e-columns>
    </ejs-grid>
    <DialogImportProducts v-model="dialog" :form-title="formTitle"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {ClickEventArgs} from '@syncfusion/ej2-vue-navigations'
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  Edit,
  Filter,
  ForeignKey,
  Page,
  Resize,
  Sort,
  Toolbar
} from '@syncfusion/ej2-vue-grids'
import {ApiDataService} from '~/assets/ApiDataService'
import DialogImportProducts from '~/components/DialogImportProducts.vue'
import {DataResult, Query} from "@syncfusion/ej2-data";
import {MONEDAS} from "~/assets/utils";

@Component({
  components: {DialogImportProducts},
  provide: {grid: [ForeignKey, Page, Edit, Toolbar, Filter, Sort, Resize]}
})
export default class Product extends Vue {
  data: DataResult | null = null;
  providers = [];
  dialog = false;
  formTitle = '';
  apiDataService = new ApiDataService('/product');
  filterOptions = {type: 'Menu'};
  editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    showDeleteConfirmDialog: true
  };
  pageOptions = {pageSize: 10};
  toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', {
    text: 'Importar',
    tooltipText: 'Importar productos',
    id: 'import'
  }];
  editMoneda = {
    params: {
      // value: MONEDAS[0].value,
      allowFiltering: true,
      dataSource: MONEDAS,
      fields: {text: "value", value: "value"},
      query: new Query(),
      actionComplete: () => false,
    },
  };
  editProvider = {
    params: {
      // value: LOCALSTOCK,
      allowFiltering: true,
      dataSource: [],
      fields: {text: "descripcion", value: "codigo"},
      query: new Query(),
      actionComplete: () => false,
    },
  };
  editActive = {
    params: {
      // checked: true
    }
  };

  // mounted
  async mounted() {
    await this.getProviders();
    const state = {skip: 0, take: 10};
    this.dataStateChange(state);
  }

  // methods
  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case 'import':
        this.formTitle = 'Importar Productos'
        // this.isNew = true
        this.dialog = true
        break
    }
  }

  dataStateChange(state: DataStateChangeEventArgs) {
    this.apiDataService.execute(state).then((gridData) => {
      this.data = gridData
    })
  }

  dataSourceChanged(state: DataSourceChangedEventArgs) {
    if (state.action === 'add') {
      this.apiDataService.addRecord(state).then(() => {
        if (state.endEdit) {
          state.endEdit()
        }
      })
    } else if (state.action === 'edit') {
      this.apiDataService.updateRecord(state).then(() => {
        if (state.endEdit) {
          state.endEdit()
        }
      })
    } else if (state.requestType === 'delete') {
      this.apiDataService.deleteRecord(state).then(() => {
        if (state.endEdit) {
          state.endEdit()
        }
      })
    }
  }

  private async getProviders() {
    return this.$axios.get('/provider?fields=codigo,descripcion').then((ret) => {
      this.providers = ret.data.data;
      this.editProvider.params.dataSource = ret.data.data;
    })
  }
}
</script>
