import Vue from 'vue'

import { GridPlugin } from '@syncfusion/ej2-vue-grids'
import { TreeGridPlugin } from '@syncfusion/ej2-vue-treegrid'
// import { DialogPlugin } from '@syncfusion/ej2-vue-popups'
// import { DashboardLayoutPlugin } from '@syncfusion/ej2-vue-layouts'
// import { ButtonPlugin } from '@syncfusion/ej2-vue-buttons'
import { enableRipple, L10n } from '@syncfusion/ej2-base'
// import { MenuPlugin, SidebarPlugin, TreeViewPlugin } from '@syncfusion/ej2-vue-navigations'
// import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'
// import { MaskedTextBoxPlugin, TextBoxPlugin } from '@syncfusion/ej2-vue-inputs'
import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-grids/styles/material.css'
import '@syncfusion/ej2-treegrid/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'

// import '@syncfusion/ej2-vue-buttons/styles/material.css'
// import '@syncfusion/ej2-vue-popups/styles/material.css'
// import '@syncfusion/ej2-vue-layouts/styles/material.css'
// import '@syncfusion/ej2-vue-navigations/styles/material.css'
// import '@syncfusion/ej2-vue-calendars/styles/material.css'
// import '@syncfusion/ej2-vue-inputs/styles/material.css'

import * as EJ2_LOCALE from '@syncfusion/ej2-locale/src/es.json'

// Vue.use(MaskedTextBoxPlugin)
// Vue.use(TextBoxPlugin)
// Vue.use(DatePickerPlugin)
// Vue.use(TreeViewPlugin)
Vue.use(GridPlugin)
Vue.use(TreeGridPlugin)
// Vue.use(DialogPlugin)
// Vue.use(DashboardLayoutPlugin)
// Vue.use(ButtonPlugin)
// Vue.use(SidebarPlugin)
// Vue.use(MenuPlugin)

enableRipple(true)

// @ts-ignore
EJ2_LOCALE.default.es.treegrid = { ...EJ2_LOCALE.default.es.treegrid, ...EJ2_LOCALE.default.es.grid }

L10n.load({ es: EJ2_LOCALE.es })
