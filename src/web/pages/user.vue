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
      <e-column :is-primary-key="true" :visible="false" field="id" header-text="ID" />
      <e-column :allow-editing="true" field="email" header-text="Email" width="150" />
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

@Component({ provide: { grid: [Page, Edit, Toolbar, Filter, Sort, Resize, Search] } })
export default class User extends Vue {
  data: any = {}
  apiDataService = new ApiDataService('/user')
  filterOptions = { type: 'Menu' }
  Options = { pageSize: 10 }
  toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search']
  editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    showDeleteConfirmDialog: true
  }

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
