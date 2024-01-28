export const ACEPTAR = 'Aceptar'
export const CANCELAR = 'Cancelar'
export const LOCALSTOCK = 'LOCALSTOCK'
export const MONEDAS = [{value: 'USD'}, {value: 'ARS'}];

export function formatDecimal(value: any, decimals = 2) {
  if (value) {
    return value.toLocaleString('es', {maximumFractionDigits: decimals, style: 'decimal'})
  } else {
    return ''
  }
}

export function formatDate(value: Date | string) {
  if (value && value instanceof Date) {
    return value.toISOString().substr(0, 10)
  }
  if (value) {
    return new Date(value).toISOString().substr(0, 10)
  }
  return ''
}

export function formatPrice(value: any, decimals = 2, currency = 'ARS') {
  if (value) {
    return value.toLocaleString('es', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      style: 'currency',
      currency
    })
  } else {
    return ''
  }
}

export function formatUrl(url: string, text = 'click', target = '_blank') {
  return `<a href="${url}" target="${target}">${text}</a>`
}

export function formatCategoryPath(value: any[]) {
  if (value) {
    let ret = ''
    for (let i = 0; i < value.length; i++) {
      ret += `${value[i].name} -> `
    }
    return ret
  } else {
    return ''
  }
}

export function arrayFindByAttribute(array: any, attribute: string, value: string, property = null) {
  let ret: any = null
  if (array) {
    for (let i = 0; i < Object.keys(array).length; i++) {
      const key = Object.keys(array)[i]
      if (array[key][attribute] === value) {
        ret = array[key]
        break
      }
    }
    if (property && ret) {
      // @ts-ignore
      ret = ret[property]
    }
  }
  return ret
}

export function validateEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/**
 * Function to return currenr app layout
 */
export function getCurrentAppLayout(router: any) {
  const location = router.history.current.fullPath
  const path = location.split('/')
  return path[1]
}
