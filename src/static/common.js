import axios from 'axios'

let serverUrl = '/manageWeb'
// let serverUrl = 'http://47.104.145.165:8082/manageWeb'
// let serverUrl = 'http://127.0.0.1:8082/manageWeb'
let SSID = 'SESSIONID'
let SHOPID = 'SHOPID'
let UNAME = 'X-Tocm-Uname'
// sessionStorage.setItem('SESSIONID', 'f610ebcf0958acd69daf5c2e69bf62dd')
// sessionStorage.setItem('SHOPID', '1')

const
  getStorageItem =
    (key) => {
      let val = ''
      if (window.localStorage) {
        val = sessionStorage.getItem(key)
      }
      return val
    }
const
  getSSID =
    () => {
      return getStorageItem(SSID)
    }
const
  getShopId =
    () => {
      return getStorageItem(SHOPID)
    }
const
  getOperatorName =
    () => {
      return getStorageItem(UNAME)
    }
const
  getOperatorId =
    () => {
      return getStorageItem(SSID)
    }
const
  execServerCall =
    (url, type, params, body) => {
      return axios({
        url: url,
        method: type,
        params: params,
        data: body,
        headers: {
          'SESSIONID': getSSID()
        }
      })
    }
const
  httpGet = (methodName, params, url) => {
    let status = url ? 1 : 0
    url = url || (serverUrl)
    url += status === 0 ? (methodName) : ''
    return execServerCall(url, 'get', params)
  }
const
  // 参数列表：方法名，数据对象
  httpPost = (methodName, body, url) => {
    url = serverUrl + methodName
    return execServerCall(url, 'post', {}, body)
  }
const
  // 时间戳转 date
  addZero =
    (num) => {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    }
const
  getUpdateTime = (val) => {
    let d, s
    d = new Date(val)
    s = d.getFullYear() + '-'
    s = s + addZero(d.getMonth() + 1) + '-'
    s += addZero(d.getDate()) + ' '
    s += addZero(d.getHours()) + ':'
    s += addZero(d.getMinutes()) + ':'
    s += addZero(d.getSeconds())
    return s
  }
const
  getDateByLong = (val) => {
    let d, s
    d = new Date(val)
    s = d.getFullYear() + '-'
    s = s + addZero(d.getMonth() + 1) + '-'
    s += addZero(d.getDate())
    return s
  }
const
  // 获取时间戳
  getTimeCode =
    (val) => {
      let d, s
      d = new Date(val)
      s = d.getTime()
      return s
    }
const
  ExportObj = {
    execServerCall,
    httpGet,
    httpPost,
    getDateByLong,
    getUpdateTime,
    getTimeCode,
    serverUrl,
    getShopId,
    getOperatorName,
    getOperatorId,
    getSSID
  }

export default ExportObj
