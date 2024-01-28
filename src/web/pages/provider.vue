<template>
  <ejs-grid
    ref="grid"
    :allow-filtering="true"
    :allow-paging="true"
    :allow-resizing="true"
    :allow-sorting="true"
    :data-source="data"
    :data-source-changed="dataSourceChanged"
    :data-state-change="dataStateChange"
    :edit-settings="editOptions"
    :filter-settings="filterOptions"
    :page-settings="Options"
    :toolbar="toolbarOptions"
    height="400"
    locale="es"
  >
    <e-columns>
      <e-column
        :is-primary-key="true"
        :visible="false"
        field="id"
        header-text="ID"
      />
      <e-column
        :allow-editing="true"
        field="codigo"
        header-text="Código"
        width="150"
      />
      <!-- <ejs-combobox id='combobox' :dataSource='sportsData' :autofill='autofill' placeholder='Select a game'></ejs-combobox> -->
      <e-column
        :allow-editing="true"
        field="descripcion"
        header-text="Descripción"
        width="150"
      />
      <e-column
        :allow-editing="true"
        field="ganancia"
        header-text="Ganancia"
        width="150"
        edit-type="numericedit"
        format="C2"
      />
      <e-column
        :allow-editing="true"
        field="impuestosVarios"
        header-text="Impuestos Varios"
        edit-type="numericedit"
        format="p2"
        width="150"
      />
      <e-column
        :allow-editing="true"
        field="gastosAdminsitrativos"
        header-text="Gastos Adminsitrativos"
        edit-type="numericedit"
        format="C2"
        width="150"
      />
      <e-column
        :allow-editing="true"
        field="diasEntrega"
        header-text="Dias de Entrega"
        width="150"
      />
    </e-columns>
  </ejs-grid>
</template>

<script lang="ts">
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  Edit,
  Filter,
  Page,
  Resize,
  Sort,
  Toolbar,
  Search
} from '@syncfusion/ej2-vue-grids'
import { Component, Vue } from 'vue-property-decorator'
import { ApiDataService } from '~/assets/ApiDataService'

@Component({
  provide: { grid: [Page, Edit, Toolbar, Filter, Sort, Resize, Search] }
})
export default class Provider extends Vue {
  data: any = {};
  apiDataService = new ApiDataService('/provider');
  filterOptions = { type: 'Menu' };
  editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    showDeleteConfirmDialog: true
  };

  Options = { pageSize: 10 };
  toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];

  mounted () {
    const state = { skip: 0, take: 10 }
    this.dataStateChange(state)
  }

  dataStateChange (state: DataStateChangeEventArgs) {
    this.apiDataService.execute(state).then((gridData) => {
      this.data = gridData
    })
  }

  dataSourceChanged (state: DataSourceChangedEventArgs) {
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
}
</script>
