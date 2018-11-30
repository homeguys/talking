// 节点管理和数据展示公用redux
import axios from 'axios'
import qs from 'qs'
let serverIp = 'aa'
const ALLINFORMATION = 'ALLINFOMATION'
const NEWTRANSFILE = 'NEWTRANSFILE'
const REPORTERATE = 'REPORTERATE'
const CHOOSESTATION = 'CHOOSESTATION'
const ALLROUTEBYIP = 'ALLROUTEBYIP'
const CLEARMONITOR = 'CLEARMONITOR'
const initState = {
  allTroubleinfo: [],
  newTransfile: [],
  reporteRate: [],
  allInformation: {},
  fileAndRate: {},
  allRouteByIp: [],
  chooseStation: ''
}

export function monitorService (state = initState, action) {
  switch (action.type) {
    case NEWTRANSFILE:
      return { ...state, fileAndRate: { ...state.fileAndRate, newTransFile: action.data } }
    case ALLROUTEBYIP:
      return { ...state, allRouteByIp: action.data }
    case REPORTERATE:
      return { ...state, fileAndRate: { ...state.fileAndRate, allRate: action.data } }
    case ALLINFORMATION:
      return { ...state, allInformation: action.data, fileAndRate: action.data1 }
    case CHOOSESTATION:
      return { ...state, chooseStation: action.data }
    case CLEARMONITOR:
      return initState
    default:
      return state
  }
}

// 选中的站点
export function getChooseStation (data) {
  return { type: CHOOSESTATION, data }
}

// 清空监控服务页面redux
export function clearMonitor () {
  return { type: CLEARMONITOR }
}

// 获取所有传输文件
export function getNewTransfile (nodeId) {
  let data = qs.stringify({
    nodeId
  })

  return dispatch => {
    axios.post(serverIp + '/monitorService/getNewTransFile', data).then(function (res) {
      if (res.data.result === 1) {
        dispatch({ type: NEWTRANSFILE, data: res.data.response })
      } else if (res.data.result === -1) {
      }
    })
  }
}

// 获取到报率
export function getReporteRate (nodeId) {
  let data = qs.stringify({
    nodeId
  })

  return dispatch => {
    axios.post(serverIp + '/monitorService/getAllRate', data).then(function (res) {
      if (res.data.result === 1) {
        dispatch({ type: REPORTERATE, data: res.data.response })
      } else if (res.data.result === -1) {
      }
    })
  }
}

// 根据线路两端ip获取所有线路
export function getAllRouteByIp (transIps) {
  let data = qs.stringify({
    transIps
  })

  return dispatch => {
    axios.post(serverIp + '/monitorService/showTransFlow', data).then(function (res) {
      if (res.data.result === 1) {
        dispatch({ type: ALLROUTEBYIP, data: res.data.response })
      } else if (res.data.result === -1) {
      }
    })
  }
}

// 所有节点请求
function NodeInfo () {
  return axios.get(serverIp + '/monitorService/getAllNodeInfo')
}

// 所有传输机请求
function TransInfo () {
  return axios.get(serverIp + '/monitorService/getAllTransInfo')
}

// 所有线路请求
function TransFlowInfo () {
  return axios.get(serverIp + '/monitorService/getAllTransFlowInfo')
}

// 所有传输文件
function NewTransFile () {
  let data = qs.stringify({
    nodeId: window.localStorage.getItem('otherStationId')
  })
  return axios.post(serverIp + '/monitorService/getNewTransFile', data)
}

// 所有故障信息
function AllTroubleinfo () {
  return axios.get(serverIp + '/monitorService/getAllTroubleInfo')
}

// 所有到报率
function AllRate () {
  let data = qs.stringify({
    nodeId: window.localStorage.getItem('otherStationId')
  })
  return axios.post(serverIp + '/monitorService/getAllRate', data)
}

// 获取树结构
export function QueryTree () {
  return axios.post(serverIp + '/nodeMgr/nodeTreeByAuth')
}

// 获取所有关于路线的信息
export function getAllInforMation (nodeId) {
  return dispatch => {
    // Toast.loading('加载中', 10)
    axios
      .all([
        NodeInfo(),
        TransInfo(),
        TransFlowInfo(),
        NewTransFile(nodeId),
        AllTroubleinfo(),
        AllRate(nodeId),
        QueryTree()
      ])
      .then(
        axios.spread(function (nodeInfo, transInfo, transFlowInfo, newTransFile, allTroubleinfo, allRate, queryTree) {
          // Toast.hide()
          if (
            nodeInfo.data.result === 1 &&
						transInfo.data.result === 1 &&
						transFlowInfo.data.result === 1 &&
						newTransFile.data.result === 1 &&
						allTroubleinfo.data.result === 1 &&
						allRate.data.result === 1 &&
						queryTree.data.result === 1
          ) {
            if (newTransFile.data.response.nodeInfo.nodeLevel === 4) {
              window.localStorage.setItem('oceanStation', newTransFile.data.response.nodeInfo.nodeName)
              window.localStorage.setItem('oceanStationId', newTransFile.data.response.nodeInfo.id)
            }
            dispatch({
              type: ALLINFORMATION,
              data: {
                nodeInfo: nodeInfo.data.response,
                transInfo: transInfo.data.response,
                transFlowInfo: transFlowInfo.data.response,
                allTroubleinfo: allTroubleinfo.data.response,
                tree: queryTree.data.response
              },
              data1: {
                newTransFile: newTransFile.data.response,
                allRate: allRate.data.response
              }
            })
          } else {
          }
        })
      )
  }
}
