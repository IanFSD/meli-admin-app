import { DataResult, DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-vue-grids'
import axios, { AxiosInstance } from 'axios'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { QuerySort } from '@nestjsx/crud-request/lib/types'

const ASCENDING = 'ascending'
const ASC = 'ASC'
const DESC = 'DESC'

export class ApiDataService {
  private axios: AxiosInstance;

  constructor (private readonly url: string/*, private readonly token: string */) {
    // @ts-ignore
    const token: string = window.$nuxt.$auth.strategy.token.get()
    this.axios = axios.create({
      baseURL: process.env.API_URL,
      headers: { Authorization: `${token}` }
    })
  }

  public execute (state: DataStateChangeEventArgs): Promise<DataResult | null> {
    return this.getData(state)
  }

  async addRecord (state: DataSourceChangedEventArgs) {
    try {
      // @ts-ignore
      delete state.data.id
      return await this.axios.post(`${this.url}`, state.data)
    } catch (e) {
      console.error(`Error al agregar el registro [${state.data}]`, e)
      window.$nuxt.$dialog.message.error('Error al agregar el registro')
      throw e
    }
  }

  async updateRecord (state: DataSourceChangedEventArgs) {
    try {
      // @ts-ignore
      return await this.axios.patch(`${this.url}/${state.data.id}`, state.data)
    } catch (e) {
      console.error(`Error al actualizar el registro [${state.data}]`, e)
      window.$nuxt.$dialog.message.error('Error al actualizar el registro')
      throw e
    }
  }

  async deleteRecord (state: DataSourceChangedEventArgs) {
    try {
      // @ts-ignore
      return await this.axios.delete(`${this.url}/${state.data[0].id}`)
    } catch (e) {
      console.error(`Error al eliminar el registro [${state.data}]`, e)
      window.$nuxt.$dialog.message.error('Error al eliminar el registro')
      throw e
    }
  }

  private async getData (state: DataStateChangeEventArgs): Promise<DataResult | null> {
    const queryString = RequestQueryBuilder.create()
    try {
      if (state.take) {
        queryString.setLimit(state.take)
      }
      if (state.action && state.action.requestType === 'paging') {
        // @ts-ignore
        queryString.setPage(Number(state.action.currentPage))
      }
      // if (state.skip) { // NO AGREGAR, NO SIRVE CON CRUDX
      //   queryString.setLimit(state.skip)
      // }
      if (state.sorted) {
        queryString.sortBy(state.sorted.map(x => <QuerySort>{
          field: x.name,
          order: x.direction === ASCENDING ? ASC : DESC
        }))
      }
      if (state.select) {
        queryString.select(state.select)
      }
      if (state.search) {
        for (const search of state.search) {
          // @ts-ignore
          for (const field of search.fields) {
            // @ts-ignore
            queryString.setOr({ field, operator: '$cont', value: search.key })
          }
        }
      }
      if (state.where) {
        for (const where of state.where) {
          for (const predicate of where.predicates) {
            queryString.setFilter({
              field: predicate.field,
              operator: this.translateOperator(predicate.operator),
              value: predicate.value
            })
          }
        }
      }
      const response = await this.axios.get(`${this.url}?${queryString.query()}`)
      let result = []; let count = 0
      if (response.data && response.data.data) {
        result = response.data.data
      }
      if (response.data && response.data.total > 0) {
        count = response.data.total
      }
      return <DataResult>{ result, count }
    } catch (e) {
      console.error(`Error al buscar registros [${queryString}]`, e)
      window.$nuxt.$dialog.message.error('Error al buscar registros')
      throw e
    }
  }

  private translateOperator (operator: any) {
    // TODO: MEJORAR
    switch (operator) {
      case 'contains':
        return '$cont'
      default:
        return '$eq'
    }
  }
}
